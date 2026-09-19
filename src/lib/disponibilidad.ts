import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { DEFAULT_CALENDAR, type CalendarConfigData } from "@/lib/calendar";
import { ESTADOS_QUE_OCUPAN, HORARIOS, seSolapan } from "@/lib/turnos";

/** Cliente de Prisma o el cliente de una transacción interactiva. */
type Db = typeof prisma | Prisma.TransactionClient;

/** Se lanza cuando el horario pedido choca con otro turno del mismo día. */
export class SlotOcupadoError extends Error {
  constructor(
    message = "Ese horario ya fue reservado. Por favor elegí otro."
  ) {
    super(message);
    this.name = "SlotOcupadoError";
  }
}

/**
 * Rango [desde, hasta) que cubre un día completo.
 * Las fechas se guardan como medianoche UTC, pero consultamos por rango para
 * no depender de que no haya quedado ninguna con hora.
 */
export function rangoDelDia(dateKey: string): { gte: Date; lt: Date } {
  const gte = new Date(`${dateKey}T00:00:00.000Z`);
  const lt = new Date(gte);
  lt.setUTCDate(lt.getUTCDate() + 1);
  return { gte, lt };
}

/** Horas de inicio ya tomadas en una fecha (opcionalmente ignorando un turno). */
export async function reservasDelDia(
  db: Db,
  dateKey: string,
  excluirId?: string
): Promise<{ horaInicio: string }[]> {
  return db.turno.findMany({
    where: {
      fecha: rangoDelDia(dateKey),
      estado: { in: ESTADOS_QUE_OCUPAN },
      ...(excluirId ? { id: { not: excluirId } } : {}),
    },
    select: { horaInicio: true },
  });
}

/**
 * Toma un lock de la fecha hasta el fin de la transacción, de modo que dos
 * reservas simultáneas del mismo día se resuelvan una después de la otra.
 */
export async function lockFecha(db: Db, dateKey: string): Promise<void> {
  // $executeRaw y no $queryRaw: la función devuelve void y Prisma no sabe
  // deserializar ese tipo.
  await db.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${dateKey}))`;
}

/**
 * Verifica que `horaInicio` esté libre en `dateKey`. Debe llamarse dentro de
 * una transacción que ya haya tomado el lock de la fecha.
 * @throws {SlotOcupadoError}
 */
export async function assertHorarioLibre(
  db: Db,
  dateKey: string,
  horaInicio: string,
  excluirId?: string
): Promise<void> {
  const reservas = await reservasDelDia(db, dateKey, excluirId);
  if (reservas.some((r) => seSolapan(horaInicio, r.horaInicio))) {
    throw new SlotOcupadoError();
  }
}

/**
 * Configuración del calendario guardada en la base, o los defaults si la tabla
 * todavía no existe (el proyecto usa `prisma db push`, así que en un entorno
 * recién levantado puede faltar).
 *
 * Cualquier otro error de base se propaga a propósito: quien reserva tiene que
 * fallar cerrado, no dejar pasar un día u horario que el estudio bloqueó.
 */
export async function leerCalendarConfig(
  db: Db = prisma
): Promise<CalendarConfigData> {
  try {
    const record = await (db as any).calendarConfig.findUnique({
      where: { id: "main" },
    });
    return (record?.config as CalendarConfigData) ?? DEFAULT_CALENDAR;
  } catch (error) {
    if (esTablaInexistente(error)) return DEFAULT_CALENDAR;
    throw error;
  }
}

function esTablaInexistente(error: unknown): boolean {
  // P2021 = "The table does not exist in the current database".
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021"
  );
}

/** Valida que el horario sea uno de los slots que ofrece el estudio. */
export function esHorarioValido(horaInicio: unknown): horaInicio is string {
  return typeof horaInicio === "string" && HORARIOS.includes(horaInicio);
}

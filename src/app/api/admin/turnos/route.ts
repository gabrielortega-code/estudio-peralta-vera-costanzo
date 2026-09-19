import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  ADMIN_COOKIE,
  COOKIE_OPTIONS,
  checkAdminAuth,
  revisarSesion,
} from "@/lib/adminAuth";
import { ESTADOS_QUE_OCUPAN, horaFinDe, type EstadoTurno } from "@/lib/turnos";
import {
  assertHorarioLibre,
  esHorarioValido,
  lockFecha,
  SlotOcupadoError,
} from "@/lib/disponibilidad";

export async function GET(req: NextRequest) {
  // El panel llama a esta ruta al abrirse y cada 60 s, así que es el lugar
  // natural para estirar la sesión: mientras Javier lo use, no vuelve a ver la
  // pantalla de login.
  const sesion = await revisarSesion(req);
  if (!sesion.autorizada) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const estado = searchParams.get("estado");

  const turnos = await prisma.turno.findMany({
    where: estado ? { estado: estado as "PENDIENTE" | "CONFIRMADO" | "CANCELADO" | "COMPLETADO" } : undefined,
    orderBy: { fecha: "asc" },
  });

  const res = NextResponse.json(turnos);
  if (sesion.renovacion) {
    res.cookies.set(ADMIN_COOKIE, sesion.renovacion.value, {
      ...COOKIE_OPTIONS,
      maxAge: sesion.renovacion.maxAge,
    });
  }
  return res;
}

export async function PATCH(req: NextRequest) {
  if (!(await checkAdminAuth(req))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { id, estado, notaAdmin, fecha, horaInicio, enlace } = body;

  if (!id) {
    return NextResponse.json({ error: "Falta el id del turno" }, { status: 400 });
  }

  if (horaInicio !== undefined && !esHorarioValido(horaInicio)) {
    return NextResponse.json(
      { error: "El horario seleccionado no es válido." },
      { status: 400 }
    );
  }

  // Solo actualizamos los campos provistos (estado, nota o reprogramación).
  const data: Record<string, unknown> = {};
  if (estado !== undefined) data.estado = estado;
  if (notaAdmin !== undefined) data.notaAdmin = notaAdmin;
  if (fecha !== undefined) data.fecha = new Date(fecha);
  // horaFin se deriva siempre del inicio, para que no puedan quedar desfasados.
  if (horaInicio !== undefined) {
    data.horaInicio = horaInicio;
    data.horaFin = horaFinDe(horaInicio);
  }
  if (enlace !== undefined) data.enlace = enlace;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nada para actualizar" }, { status: 400 });
  }

  try {
    const turno = await prisma.$transaction(async (tx) => {
      const actual = await tx.turno.findUnique({ where: { id } });
      if (!actual) return null;

      const estadoFinal: EstadoTurno = (estado ?? actual.estado) as EstadoTurno;
      const cambiaSlot = fecha !== undefined || horaInicio !== undefined;
      const vuelveDeCancelado =
        actual.estado === "CANCELADO" && estadoFinal !== "CANCELADO";

      // Solo verificamos cuando el turno se mueve a un horario (reprogramación
      // o reactivación de un cancelado); confirmar uno que ya estaba ahí nunca
      // debería bloquearse.
      if (
        (cambiaSlot || vuelveDeCancelado) &&
        ESTADOS_QUE_OCUPAN.includes(estadoFinal)
      ) {
        const fechaFinal = fecha !== undefined ? new Date(fecha) : actual.fecha;
        const dateKey = fechaFinal.toISOString().slice(0, 10);
        const horaFinal = horaInicio ?? actual.horaInicio;

        await lockFecha(tx, dateKey);
        await assertHorarioLibre(tx, dateKey, horaFinal, id);
      }

      return tx.turno.update({ where: { id }, data });
    });

    if (!turno) {
      return NextResponse.json({ error: "Turno no encontrado" }, { status: 404 });
    }

    return NextResponse.json(turno);
  } catch (error) {
    if (error instanceof SlotOcupadoError) {
      return NextResponse.json(
        { error: "Ese horario ya está ocupado por otro turno." },
        { status: 409 }
      );
    }
    console.error("Error actualizando turno:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

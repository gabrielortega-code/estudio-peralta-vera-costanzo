import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getModalidadForDate, horariosHabilitados } from "@/lib/calendar";
import { slotsOcupados } from "@/lib/turnos";
import { leerCalendarConfig, reservasDelDia } from "@/lib/disponibilidad";

export const dynamic = "force-dynamic";

/**
 * Horarios de una fecha. Público: devuelve únicamente horas, nunca datos de los
 * clientes que reservaron.
 *
 * Distingue dos motivos por los que una hora no se puede elegir:
 *  - `ocupados`: ya hay un turno que se solapa (el formulario dice "reservado").
 *  - fuera de `habilitados`: el estudio no atiende a esa hora ese día, según la
 *    configuración del panel. Esas horas directamente no se ofrecen.
 */
export async function GET(req: NextRequest) {
  const fecha = req.nextUrl.searchParams.get("fecha") ?? "";

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return NextResponse.json(
      { error: "Fecha inválida. Formato esperado: YYYY-MM-DD" },
      { status: 400 }
    );
  }

  try {
    const config = await leerCalendarConfig();
    const diaBloqueado = getModalidadForDate(config, fecha) === "bloqueado";
    const habilitados = diaBloqueado ? [] : horariosHabilitados(config, fecha);

    const reservas = await reservasDelDia(prisma, fecha);
    const ocupados = slotsOcupados(reservas);

    return NextResponse.json({
      fecha,
      habilitados,
      ocupados: ocupados.filter((h) => habilitados.includes(h)),
      disponibles: habilitados.filter((h) => !ocupados.includes(h)),
    });
  } catch (error) {
    console.error("Error consultando disponibilidad:", error);
    return NextResponse.json(
      { error: "No se pudo consultar la disponibilidad" },
      { status: 500 }
    );
  }
}

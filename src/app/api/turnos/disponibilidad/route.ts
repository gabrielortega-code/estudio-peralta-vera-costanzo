import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { HORARIOS, slotsOcupados } from "@/lib/turnos";
import { reservasDelDia } from "@/lib/disponibilidad";

export const dynamic = "force-dynamic";

/**
 * Horarios ya tomados para una fecha. Público: devuelve únicamente horas,
 * nunca datos de los clientes que reservaron.
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
    const reservas = await reservasDelDia(prisma, fecha);
    const ocupados = slotsOcupados(reservas);
    return NextResponse.json({
      fecha,
      ocupados,
      disponibles: HORARIOS.filter((h) => !ocupados.includes(h)),
    });
  } catch (error) {
    console.error("Error consultando disponibilidad:", error);
    return NextResponse.json(
      { error: "No se pudo consultar la disponibilidad" },
      { status: 500 }
    );
  }
}

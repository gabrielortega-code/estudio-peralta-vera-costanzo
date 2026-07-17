import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function checkAuth(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  return secret === process.env.ADMIN_SECRET;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const estado = searchParams.get("estado");

  const turnos = await prisma.turno.findMany({
    where: estado ? { estado: estado as "PENDIENTE" | "CONFIRMADO" | "CANCELADO" | "COMPLETADO" } : undefined,
    orderBy: { fecha: "asc" },
  });

  return NextResponse.json(turnos);
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { id, estado, notaAdmin, fecha, horaInicio, horaFin, enlace } = body;

  if (!id) {
    return NextResponse.json({ error: "Falta el id del turno" }, { status: 400 });
  }

  // Solo actualizamos los campos provistos (estado, nota o reprogramación).
  const data: Record<string, unknown> = {};
  if (estado !== undefined) data.estado = estado;
  if (notaAdmin !== undefined) data.notaAdmin = notaAdmin;
  if (fecha !== undefined) data.fecha = new Date(fecha);
  if (horaInicio !== undefined) data.horaInicio = horaInicio;
  if (horaFin !== undefined) data.horaFin = horaFin;
  if (enlace !== undefined) data.enlace = enlace;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nada para actualizar" }, { status: 400 });
  }

  const turno = await prisma.turno.update({
    where: { id },
    data,
  });

  return NextResponse.json(turno);
}

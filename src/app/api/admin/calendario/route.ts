import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_CALENDAR, type CalendarConfigData } from "@/lib/calendar";
import { leerCalendarConfig } from "@/lib/disponibilidad";
import { checkAdminAuth } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  if (!(await checkAdminAuth(req))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    return NextResponse.json(await leerCalendarConfig());
  } catch (error) {
    console.error("Error leyendo la configuración del calendario:", error);
    return NextResponse.json(DEFAULT_CALENDAR);
  }
}

export async function PUT(req: NextRequest) {
  if (!(await checkAdminAuth(req))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const config: CalendarConfigData = await req.json();
  try {
    await (prisma as any).calendarConfig.upsert({
      where: { id: "main" },
      create: { id: "main", config },
      update: { config },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error saving calendar config:", err);
    return NextResponse.json(
      { error: "Error guardando configuración. Verificá que la migración de BD haya sido aplicada (`npx prisma db push`)." },
      { status: 500 }
    );
  }
}

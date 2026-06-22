import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_CALENDAR, type CalendarConfigData } from "@/lib/calendar";

function checkAuth(req: NextRequest) {
  return req.headers.get("x-admin-secret") === process.env.ADMIN_SECRET;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const record = await (prisma as any).calendarConfig.findUnique({
      where: { id: "main" },
    });
    return NextResponse.json(record?.config ?? DEFAULT_CALENDAR);
  } catch {
    return NextResponse.json(DEFAULT_CALENDAR);
  }
}

export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) {
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

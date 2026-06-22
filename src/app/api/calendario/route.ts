import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_CALENDAR } from "@/lib/calendar";

export async function GET() {
  try {
    const record = await (prisma as any).calendarConfig.findUnique({
      where: { id: "main" },
    });
    return NextResponse.json(record?.config ?? DEFAULT_CALENDAR);
  } catch {
    // Tabla no creada aún: devolvemos los defaults
    return NextResponse.json(DEFAULT_CALENDAR);
  }
}

import { NextResponse } from "next/server";
import { DEFAULT_CALENDAR } from "@/lib/calendar";
import { leerCalendarConfig } from "@/lib/disponibilidad";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await leerCalendarConfig());
  } catch (error) {
    // Solo para mostrar el formulario: si la base falla, los defaults dejan la
    // página usable. La validación real de lo que se reserva vive en
    // POST /api/turnos, que sí falla cerrado.
    console.error("Error leyendo la configuración del calendario:", error);
    return NextResponse.json(DEFAULT_CALENDAR);
  }
}

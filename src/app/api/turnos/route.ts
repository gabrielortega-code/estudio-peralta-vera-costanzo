import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendConfirmacionCliente, sendNotificacionAdmin } from "@/lib/email";
import { DEFAULT_CALENDAR, getModalidadForDate, type CalendarConfigData } from "@/lib/calendar";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, email, telefono, dni, modalidad, canal, fecha, horaInicio, mensaje } = body;

    // Basic validation
    if (!nombre || !email || !telefono || !fecha || !horaInicio) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // Parse date
    const fechaDate = new Date(fecha);
    if (isNaN(fechaDate.getTime())) {
      return NextResponse.json({ error: "Fecha inválida" }, { status: 400 });
    }

    // Regla: no se reservan turnos para hoy ni en menos de 24 hs.
    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (fechaDate < tomorrow) {
      return NextResponse.json(
        { error: "Los turnos se reservan a partir del día siguiente (no para hoy ni en menos de 24 hs)." },
        { status: 400 }
      );
    }

    // Validación contra la configuración del calendario
    const dateKey = fechaDate.toISOString().slice(0, 10);
    try {
      const calRecord = await (prisma as any).calendarConfig.findUnique({ where: { id: "main" } });
      const calConfig: CalendarConfigData = calRecord?.config ?? DEFAULT_CALENDAR;
      const modalidadDia = getModalidadForDate(calConfig, dateKey);
      if (modalidadDia === "bloqueado") {
        return NextResponse.json(
          { error: "El estudio no atiende en esa fecha. Por favor elegí otro día." },
          { status: 400 }
        );
      }
      if (modalidadDia === "presencial" && modalidad === "Virtual") {
        return NextResponse.json(
          { error: "En esa fecha solo se ofrecen consultas presenciales." },
          { status: 400 }
        );
      }
      if (modalidadDia === "virtual" && modalidad === "Presencial") {
        return NextResponse.json(
          { error: "En esa fecha solo se ofrecen consultas virtuales." },
          { status: 400 }
        );
      }
    } catch {
      // Si el calendario no está configurado, se permite todo
    }

    // Calculate end time (1 hour later)
    const [hours, minutes] = horaInicio.split(":").map(Number);
    const endHours = hours + 1;
    const horaFin = `${String(endHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

    // Save to database
    const turno = await prisma.turno.create({
      data: {
        nombre,
        email,
        telefono,
        dni: dni || null,
        modalidad: modalidad || null,
        canal: modalidad === "Virtual" ? canal || null : null,
        fecha: fechaDate,
        horaInicio,
        horaFin,
        mensaje: mensaje || null,
      },
    });

    // Send emails (non-blocking - don't fail if email fails)
    const fechaFormatted = fechaDate.toLocaleDateString("es-AR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const modalidadLabel =
      modalidad === "Virtual"
        ? `Virtual${canal ? ` · ${canal}` : ""}`
        : modalidad || "Presencial";

    try {
      await Promise.all([
        sendConfirmacionCliente({ nombre, email, telefono, servicio: modalidadLabel, fecha: fechaFormatted, horaInicio }),
        sendNotificacionAdmin({ nombre, email, telefono, servicio: modalidadLabel, fecha: fechaFormatted, horaInicio, mensaje }),
      ]);
    } catch (emailError) {
      console.error("Error sending emails:", emailError);
      // Don't fail the request if email sending fails
    }

    return NextResponse.json({ success: true, id: turno.id }, { status: 201 });
  } catch (error) {
    console.error("Error creating turno:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendConfirmacionCliente, sendNotificacionAdmin } from "@/lib/email";
import {
  getModalidadForDate,
  horariosHabilitados,
  type CalendarConfigData,
} from "@/lib/calendar";
import { horaFinDe, hoyEnArgentina } from "@/lib/turnos";
import {
  assertHorarioLibre,
  esHorarioValido,
  leerCalendarConfig,
  lockFecha,
  SlotOcupadoError,
} from "@/lib/disponibilidad";

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

    if (!esHorarioValido(horaInicio)) {
      return NextResponse.json(
        { error: "El horario seleccionado no es válido." },
        { status: 400 }
      );
    }

    // Parse date
    const fechaDate = new Date(fecha);
    if (isNaN(fechaDate.getTime())) {
      return NextResponse.json({ error: "Fecha inválida" }, { status: 400 });
    }

    // Regla: no se reservan turnos para hoy ni en menos de 24 hs. La comparación
    // va en hora argentina y no en la del servidor: en Vercel el servidor está
    // en UTC y después de las 21:00 de acá ya pasó al día siguiente.
    const dateKey = fechaDate.toISOString().slice(0, 10);
    if (dateKey <= hoyEnArgentina()) {
      return NextResponse.json(
        { error: "Los turnos se reservan a partir del día siguiente (no para hoy ni en menos de 24 hs)." },
        { status: 400 }
      );
    }

    // Validación contra la configuración del calendario. Si la base falla acá
    // cortamos: dejar pasar la reserva significaría permitir un día o un horario
    // que el estudio bloqueó desde el panel.
    let calConfig: CalendarConfigData;
    try {
      calConfig = await leerCalendarConfig();
    } catch (error) {
      console.error("Error leyendo la configuración del calendario:", error);
      return NextResponse.json(
        { error: "No pudimos verificar la disponibilidad. Probá de nuevo en unos minutos." },
        { status: 503 }
      );
    }

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
    if (!horariosHabilitados(calConfig, dateKey).includes(horaInicio)) {
      return NextResponse.json(
        { error: "El estudio no atiende en ese horario ese día. Por favor elegí otro." },
        { status: 400 }
      );
    }

    const horaFin = horaFinDe(horaInicio);

    // El lock de la fecha + la verificación + el alta van en una sola
    // transacción: dos reservas simultáneas del mismo horario se resuelven
    // una después de la otra y la segunda encuentra el horario tomado.
    const turno = await prisma.$transaction(async (tx) => {
      await lockFecha(tx, dateKey);
      await assertHorarioLibre(tx, dateKey, horaInicio);

      return tx.turno.create({
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
    if (error instanceof SlotOcupadoError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("Error creating turno:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

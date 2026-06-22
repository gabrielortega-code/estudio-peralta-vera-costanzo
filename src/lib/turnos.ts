export type EstadoTurno =
  | "PENDIENTE"
  | "CONFIRMADO"
  | "CANCELADO"
  | "COMPLETADO";

export type Modalidad = "Presencial" | "Virtual";
export type CanalVirtual = "Zoom" | "Google Meet" | "WhatsApp (videollamada)";

export interface Turno {
  id: string;
  createdAt: string;
  nombre: string;
  email: string;
  telefono: string;
  dni: string | null;
  servicio: string;
  /** ISO date (YYYY-MM-DD o datetime). */
  fecha: string;
  horaInicio: string;
  horaFin: string;
  mensaje: string | null;
  estado: EstadoTurno;
  notaAdmin: string | null;
  modalidad?: Modalidad;
  /** Canal elegido cuando la modalidad es Virtual. */
  canal?: CanalVirtual | null;
  /** Enlace de la reunión virtual (Zoom/Meet) que se envía al cliente. */
  enlace?: string | null;
}

export const MODALIDADES: Modalidad[] = ["Presencial", "Virtual"];

export const CANALES_VIRTUAL: CanalVirtual[] = [
  "Zoom",
  "Google Meet",
  "WhatsApp (videollamada)",
];

/**
 * Teléfono de contacto de Javier para reenviar el enlace de la
 * videollamada cuando el cliente no lo encuentra.
 */
export const TEL_JAVIER = "+54 9 351 200-4769";

/** Áreas de práctica del estudio — usado en el formulario y el panel. */
export const SERVICIOS = [
  "Derecho de Seguros",
  "Rechazo de cobertura",
  "Accidente de tránsito",
  "Responsabilidad civil y daños",
  "Destrucción total / Liquidación de siniestro",
  "Mediación / Negociación prejudicial",
  "Otro / No estoy seguro/a",
];

export const HORARIOS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

export const ESTADO_META: Record<
  EstadoTurno,
  { label: string; dot: string; pill: string; ring: string }
> = {
  PENDIENTE: {
    label: "Pendiente",
    dot: "bg-amber-500",
    pill: "bg-amber-100 text-amber-800",
    ring: "ring-amber-200",
  },
  CONFIRMADO: {
    label: "Confirmado",
    dot: "bg-emerald-500",
    pill: "bg-emerald-100 text-emerald-800",
    ring: "ring-emerald-200",
  },
  CANCELADO: {
    label: "Cancelado",
    dot: "bg-rose-500",
    pill: "bg-rose-100 text-rose-700",
    ring: "ring-rose-200",
  },
  COMPLETADO: {
    label: "Completado",
    dot: "bg-slate-400",
    pill: "bg-slate-100 text-slate-700",
    ring: "ring-slate-200",
  },
};

/* ----------------------------- date helpers ----------------------------- */

/** Devuelve YYYY-MM-DD en horario local (no UTC). */
export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Normaliza la fecha de un turno (que puede venir como datetime ISO) a YYYY-MM-DD. */
export function turnoDateKey(t: Turno): string {
  return t.fecha.slice(0, 10);
}

export function addDays(dateKey: string, days: number): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return toDateKey(dt);
}

export function formatLongDate(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatShortDate(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/* --------------------------- contact helpers ---------------------------- */

/** Limpia un teléfono a dígitos en formato internacional (asume AR +54). */
export function whatsappNumber(telefono: string): string {
  let digits = telefono.replace(/\D/g, "");
  if (digits.startsWith("54")) return digits;
  // quitar 0 inicial y el 15 de celular si viniera suelto
  digits = digits.replace(/^0/, "");
  return `54${digits}`;
}

export function whatsappLink(t: Turno): string {
  const msg = `Hola ${t.nombre.split(" ")[0]}, le escribimos del Estudio Jurídico Peralta & Vera Costanzo por su turno del ${formatShortDate(
    turnoDateKey(t)
  )} a las ${t.horaInicio} hs.`;
  return `https://wa.me/${whatsappNumber(t.telefono)}?text=${encodeURIComponent(
    msg
  )}`;
}

export function mailtoLink(t: Turno): string {
  const subject = `Su turno — Estudio Jurídico Peralta & Vera Costanzo`;
  const body = `Estimado/a ${t.nombre},\n\nNos comunicamos en relación a su turno solicitado para el ${formatLongDate(
    turnoDateKey(t)
  )} a las ${t.horaInicio} hs (${t.servicio}).\n\nSaludos cordiales,\nEstudio Jurídico Peralta & Vera Costanzo`;
  return `mailto:${t.email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

export function telLink(t: Turno): string {
  return `tel:${t.telefono.replace(/[^\d+]/g, "")}`;
}

/** Link de WhatsApp con un mensaje arbitrario ya cargado. */
export function waMessageLink(t: Turno, msg: string): string {
  return `https://wa.me/${whatsappNumber(t.telefono)}?text=${encodeURIComponent(
    msg
  )}`;
}

/** Link mailto con asunto y cuerpo ya cargados. */
export function mailMessageLink(
  t: Turno,
  subject: string,
  body: string
): string {
  return `mailto:${t.email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

/** Mensaje de confirmación listo para enviar al cliente. */
export function mensajeConfirmacion(t: Turno, enlace?: string | null): string {
  const nombre = t.nombre.split(" ")[0];
  const fecha = formatLongDate(turnoDateKey(t));
  const cuando = `el ${fecha} a las ${t.horaInicio} hs`;
  const firma = "Estudio Jurídico Peralta & Vera Costanzo.";

  if (t.modalidad === "Virtual" && t.canal === "WhatsApp (videollamada)") {
    return `Hola ${nombre}, confirmamos tu consulta ${cuando}. La haremos por videollamada de WhatsApp a este número, en el horario acordado. ${firma}`;
  }
  if (t.modalidad === "Virtual") {
    const linkTxt = enlace
      ? `\n\nEnlace para conectarte (${t.canal}):\n${enlace}`
      : "";
    return `Hola ${nombre}, confirmamos tu consulta virtual ${cuando} por ${t.canal}.${linkTxt}\n\nCualquier inconveniente, escribinos. ${firma}`;
  }
  return `Hola ${nombre}, confirmamos tu consulta ${cuando} en nuestras oficinas. ${firma}`;
}

export const ASUNTO_CONFIRMACION =
  "Confirmación de tu turno — Estudio Jurídico Peralta & Vera Costanzo";

/* ----------------------- configuración de enlaces ----------------------- */
/**
 * Links fijos que Javier guarda una vez y se reutilizan al confirmar
 * turnos virtuales. Persisten en el navegador (localStorage) hasta que
 * conectemos el backend.
 */
export type LinkSettings = { zoom: string; meet: string };

const LINK_SETTINGS_KEY = "pvc_link_settings";

export function loadLinkSettings(): LinkSettings {
  if (typeof window === "undefined") return { zoom: "", meet: "" };
  try {
    const raw = window.localStorage.getItem(LINK_SETTINGS_KEY);
    return { zoom: "", meet: "", ...(raw ? JSON.parse(raw) : {}) };
  } catch {
    return { zoom: "", meet: "" };
  }
}

export function saveLinkSettings(s: LinkSettings): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LINK_SETTINGS_KEY, JSON.stringify(s));
  }
}

export function defaultLinkFor(
  canal: CanalVirtual | null | undefined,
  s: LinkSettings
): string {
  if (canal === "Zoom") return s.zoom;
  if (canal === "Google Meet") return s.meet;
  return "";
}

/* ------------------------------ mock data ------------------------------- */
/**
 * Datos de demostración para trabajar la UI mientras se conectan
 * Supabase y el envío de emails. Generados relativos a "hoy".
 */
export function buildMockTurnos(): Turno[] {
  const today = toDateKey(new Date());
  const tomorrow = addDays(today, 1);
  const yesterday = addDays(today, -1);
  const now = new Date().toISOString();

  return [
    {
      id: "mock-1",
      createdAt: now,
      nombre: "María Fernanda López",
      email: "mariafer.lopez@gmail.com",
      telefono: "351 615 4422",
      dni: "30.123.456",
      servicio: "Rechazo de cobertura",
      fecha: today,
      horaInicio: "09:30",
      horaFin: "10:30",
      mensaje:
        "Mi aseguradora rechazó el siniestro de mi auto alegando falta de pago, pero tengo los comprobantes al día.",
      estado: "PENDIENTE",
      notaAdmin: null,
      modalidad: "Presencial",
    },
    {
      id: "mock-2",
      createdAt: now,
      nombre: "Carlos Gustavo Medina",
      email: "cg.medina@hotmail.com",
      telefono: "351 244 8890",
      dni: "27.998.110",
      servicio: "Accidente de tránsito",
      fecha: today,
      horaInicio: "11:00",
      horaFin: "12:00",
      mensaje:
        "Choque en cadena en circunvalación. La otra parte tiene seguro pero no responden.",
      estado: "CONFIRMADO",
      notaAdmin: "Traer denuncia policial y fotos.",
      modalidad: "Presencial",
    },
    {
      id: "mock-3",
      createdAt: now,
      nombre: "Lucía Romero",
      email: "lucia.romero88@gmail.com",
      telefono: "351 700 1234",
      dni: null,
      servicio: "Daños y perjuicios",
      fecha: today,
      horaInicio: "15:00",
      horaFin: "16:00",
      mensaje: null,
      estado: "CONFIRMADO",
      notaAdmin: null,
      modalidad: "Virtual",
      canal: "Google Meet",
      enlace: "https://meet.google.com/abc-defg-hij",
    },
    {
      id: "mock-4",
      createdAt: now,
      nombre: "Jorge Alberto Sosa",
      email: "jorge.sosa@gmail.com",
      telefono: "351 333 7788",
      dni: "20.456.789",
      servicio: "Destrucción total / Liquidación de siniestro",
      fecha: today,
      horaInicio: "17:00",
      horaFin: "18:00",
      mensaje:
        "Me ofrecen mucho menos del valor del vehículo por destrucción total.",
      estado: "CONFIRMADO",
      notaAdmin: null,
      modalidad: "Presencial",
    },
    {
      id: "mock-5",
      createdAt: now,
      nombre: "Verónica Paz",
      email: "vero.paz@gmail.com",
      telefono: "351 588 9001",
      dni: "33.221.009",
      servicio: "Derecho de Seguros",
      fecha: tomorrow,
      horaInicio: "10:00",
      horaFin: "11:00",
      mensaje: "Demora de 6 meses en el pago de la indemnización.",
      estado: "PENDIENTE",
      notaAdmin: null,
      modalidad: "Virtual",
      canal: "Zoom",
    },
    {
      id: "mock-6",
      createdAt: now,
      nombre: "Diego Martín Funes",
      email: "diegofunes@gmail.com",
      telefono: "351 410 2255",
      dni: "29.877.123",
      servicio: "Mediación / Negociación prejudicial",
      fecha: tomorrow,
      horaInicio: "14:30",
      horaFin: "15:30",
      mensaje: null,
      estado: "PENDIENTE",
      notaAdmin: null,
      modalidad: "Presencial",
    },
    {
      id: "mock-7",
      createdAt: now,
      nombre: "Ana Beltrán",
      email: "ana.beltran@gmail.com",
      telefono: "351 612 0099",
      dni: "31.554.876",
      servicio: "Accidente de tránsito",
      fecha: yesterday,
      horaInicio: "16:00",
      horaFin: "17:00",
      mensaje: "Consulta resuelta en la reunión.",
      estado: "COMPLETADO",
      notaAdmin: "Se inició reclamo extrajudicial.",
      modalidad: "Presencial",
    },
    {
      id: "mock-8",
      createdAt: now,
      nombre: "Rubén Acosta",
      email: "ruben.acosta@gmail.com",
      telefono: "351 299 4410",
      dni: null,
      servicio: "Responsabilidad civil y daños",
      fecha: yesterday,
      horaInicio: "09:00",
      horaFin: "10:00",
      mensaje: "No se presentó a la reunión.",
      estado: "CANCELADO",
      notaAdmin: "Reprogramar la semana próxima.",
      modalidad: "Presencial",
    },
  ];
}

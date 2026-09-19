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

/* ------------------------- duración y solapamiento ----------------------- */

/** Duración de una consulta, en minutos. */
export const DURACION_MIN = 60;

/** Estados que mantienen el horario ocupado (todos menos CANCELADO). */
export const ESTADOS_QUE_OCUPAN: EstadoTurno[] = [
  "PENDIENTE",
  "CONFIRMADO",
  "COMPLETADO",
];

/** "HH:MM" → minutos desde la medianoche. */
export function horaToMin(hora: string): number {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

/** Minutos desde la medianoche → "HH:MM". */
export function minToHora(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Hora de finalización de un turno que empieza a `horaInicio`. */
export function horaFinDe(horaInicio: string): string {
  return minToHora(horaToMin(horaInicio) + DURACION_MIN);
}

/**
 * Dos turnos se solapan si empiezan a menos de una duración de distancia.
 * Con turnos de 1 h y slots cada 30 min, las 10:00 y las 10:30 chocan.
 */
export function seSolapan(horaA: string, horaB: string): boolean {
  return Math.abs(horaToMin(horaA) - horaToMin(horaB)) < DURACION_MIN;
}

/**
 * Horarios de `HORARIOS` que quedan bloqueados por las reservas de un día.
 * Fuente de verdad compartida por el formulario, el panel y la API.
 */
export function slotsOcupados(
  reservas: { horaInicio: string }[]
): string[] {
  return HORARIOS.filter((slot) =>
    reservas.some((r) => seSolapan(slot, r.horaInicio))
  );
}

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

/**
 * "YYYY-MM-DD" de hoy en hora argentina, sin importar la zona del servidor.
 *
 * En Vercel el servidor corre en UTC, así que entre las 21:00 y la medianoche
 * de acá ya está en el día siguiente. Sin esto, el formulario ofrece una fecha
 * que la API rechaza por la regla de 24 hs.
 */
export function hoyEnArgentina(): string {
  // "en-CA" formatea como YYYY-MM-DD, que es justo la clave que usamos.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date());
}

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

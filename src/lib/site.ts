/**
 * Datos de contacto del estudio, centralizados para reutilizar en todo el sitio
 * (Contact, Footer, página de turnos, botón flotante de WhatsApp y emails).
 */
export const CONTACT = {
  /** Teléfono en formato legible para mostrar al usuario. */
  phoneDisplay: "+54 9 351 200-4769",
  /** Teléfono para enlaces tel: (sólo dígitos y +). */
  phoneTel: "+5493512004769",
  /** Número en formato wa.me (sólo dígitos, sin +). */
  whatsappNumber: "5493512004769",
  email: "estudio@peraltaveracostanzo.com.ar",
  address: {
    line1: "Deán Funes 154, 1° piso, oficina 13",
    line2: "Córdoba, Argentina",
  },
  hours: {
    weekdays: "Lunes – Viernes · 9:00 a 18:00",
    saturday: "Sábados · 9:00 a 13:00",
  },
} as const;

/** Texto para la búsqueda/embebido de Google Maps. */
export const MAPS_QUERY = "Deán Funes 154, Córdoba, Argentina";

/** Enlace de WhatsApp, con un mensaje opcional precargado. */
export function whatsappHref(message?: string): string {
  const base = `https://wa.me/${CONTACT.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const WHATSAPP_DEFAULT_MESSAGE =
  "Hola, me gustaría hacer una consulta legal con el estudio.";

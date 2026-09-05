// Envío de emails transaccionales. Dos canales, a propósito:
//
//   - Al cliente, vía Brevo. Es donde importa la entregabilidad hacia dominios
//     externos (Gmail, Hotmail, etc.) y hoy funciona bien.
//   - Al estudio, vía el SMTP propio del hosting. El servidor de DonWeb rechaza
//     los correos de Brevo con "550 5.7.1 Blacklisted [France, Europe]", así que
//     el aviso interno nunca llegaba. Autenticándonos contra el mismo servidor
//     que aloja las casillas, la entrega es local y no pasa por ese filtro.
//
// El aviso interno NO cae de vuelta a Brevo si el SMTP falla: cada rebote acerca
// la dirección a la lista de bloqueados de Brevo, donde después falla en silencio.

import nodemailer, { type Transporter } from "nodemailer";

import { whatsappHref } from "./site";

interface TurnoData {
  nombre: string;
  email: string;
  telefono: string;
  servicio: string;
  fecha: string;
  horaInicio: string;
  mensaje?: string;
}

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const SENDER_NAME = "Estudio Peralta & Vera Costanzo";

async function sendBrevoEmail(params: {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
}): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = process.env.EMAIL_FROM;

  if (!apiKey || !fromEmail) {
    console.error("Brevo no está configurado: falta BREVO_API_KEY o EMAIL_FROM");
    return;
  }

  const res = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: SENDER_NAME, email: fromEmail },
      to: params.to,
      subject: params.subject,
      htmlContent: params.htmlContent,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Brevo respondió ${res.status}: ${detail}`);
  }
}

// Reutilizamos el transporte entre invocaciones: con Fluid Compute la instancia
// sobrevive a la request y así evitamos rehacer el handshake TLS en cada turno.
let cachedTransporter: Transporter | null = null;

function getSmtpTransport(): Transporter | null {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  if (!cachedTransporter) {
    const port = Number(process.env.SMTP_PORT ?? 465);
    cachedTransporter = nodemailer.createTransport({
      host,
      port,
      // 465 es TLS implícito; 587 arranca en claro y sube con STARTTLS.
      secure: port === 465,
      auth: { user, pass },
      // El servidor publica un AAAA pero no escucha en IPv6, así que nodemailer
      // intenta esa dirección y cae a IPv4. El rechazo es inmediato, no un
      // timeout, así que no vale la pena forzar la familia de direcciones.
      //
      // Estos límites sí importan: sin ellos, un servidor que no responde deja
      // colgada la función hasta el timeout de la plataforma.
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });
  }

  return cachedTransporter;
}

async function sendSmtpEmail(params: {
  to: string;
  subject: string;
  htmlContent: string;
}): Promise<void> {
  const transport = getSmtpTransport();
  if (!transport) throw new Error("SMTP no está configurado");

  await transport.sendMail({
    from: { name: SENDER_NAME, address: process.env.SMTP_USER as string },
    to: params.to,
    subject: params.subject,
    html: params.htmlContent,
  });
}

export async function sendConfirmacionCliente(turno: TurnoData): Promise<void> {
  const whatsappUrl = whatsappHref(
    `Hola, quería consultar algo sobre mi turno del ${turno.fecha} a las ${turno.horaInicio} hs.`
  );

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
      <h2 style="color: #1a3a5c;">Turno confirmado</h2>
      <p>Hola ${turno.nombre},</p>
      <p>Confirmamos tu turno con el Estudio Jurídico Peralta &amp; Vera Costanzo:</p>
      <ul>
        <li><strong>Modalidad:</strong> ${turno.servicio}</li>
        <li><strong>Fecha:</strong> ${turno.fecha}</li>
        <li><strong>Hora:</strong> ${turno.horaInicio} hs</li>
      </ul>
      <p>Ante cualquier duda o si necesitás reprogramar, podés responder este correo.</p>
      <p style="margin: 20px 0;">¿Tenés alguna consulta o algo más para hablar? Escribinos directo por WhatsApp:</p>
      <p style="margin: 20px 0;">
        <a href="${whatsappUrl}" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; font-weight: bold; padding: 12px 24px; border-radius: 6px; font-family: Arial, sans-serif;">
          Hablar por WhatsApp
        </a>
      </p>
      <p style="margin-top: 24px;">Saludos cordiales,<br/>Estudio Jurídico Peralta &amp; Vera Costanzo</p>
    </div>
  `;

  await sendBrevoEmail({
    to: [{ email: turno.email, name: turno.nombre }],
    subject: "Confirmación de tu turno — Estudio Peralta & Vera Costanzo",
    htmlContent: html,
  });
}

export async function sendNotificacionAdmin(turno: TurnoData): Promise<void> {
  const adminEmail = process.env.EMAIL_ADMIN;
  if (!adminEmail) {
    console.error("No se pudo notificar al estudio: falta EMAIL_ADMIN");
    return;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
      <h2 style="color: #1a3a5c;">Nuevo turno reservado</h2>
      <ul>
        <li><strong>Nombre:</strong> ${turno.nombre}</li>
        <li><strong>Email:</strong> ${turno.email}</li>
        <li><strong>Teléfono:</strong> ${turno.telefono}</li>
        <li><strong>Modalidad:</strong> ${turno.servicio}</li>
        <li><strong>Fecha:</strong> ${turno.fecha}</li>
        <li><strong>Hora:</strong> ${turno.horaInicio} hs</li>
        ${turno.mensaje ? `<li><strong>Mensaje:</strong> ${turno.mensaje}</li>` : ""}
      </ul>
    </div>
  `;

  const subject = `Nuevo turno: ${turno.nombre} — ${turno.fecha} ${turno.horaInicio}hs`;

  if (getSmtpTransport()) {
    // Camino normal. Si falla, se registra y el estudio ve la reserva en /admin;
    // no reintentamos por Brevo para no generar rebotes.
    try {
      await sendSmtpEmail({ to: adminEmail, subject, htmlContent: html });
    } catch (err) {
      console.error("No se pudo avisar al estudio por SMTP:", err);
    }
    return;
  }

  // Sin SMTP configurado queda el comportamiento anterior, que hoy rebota en el
  // servidor del estudio. Es un fallback para entornos donde no hay credenciales
  // (desarrollo, previews), no una alternativa válida en producción.
  console.warn("SMTP no configurado: el aviso al estudio sale por Brevo y probablemente rebote");
  await sendBrevoEmail({
    to: [{ email: adminEmail }],
    subject,
    htmlContent: html,
  });
}

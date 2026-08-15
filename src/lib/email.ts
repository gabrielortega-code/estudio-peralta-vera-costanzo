// Envío de emails transaccionales vía Brevo (https://api.brevo.com/v3/smtp/email).

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

  await sendBrevoEmail({
    to: [{ email: adminEmail }],
    subject: `Nuevo turno: ${turno.nombre} — ${turno.fecha} ${turno.horaInicio}hs`,
    htmlContent: html,
  });
}

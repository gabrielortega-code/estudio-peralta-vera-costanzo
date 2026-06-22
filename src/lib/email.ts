import { Resend } from "resend";
import { CONTACT } from "./site";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

interface TurnoData {
  nombre: string;
  email: string;
  telefono: string;
  servicio: string;
  fecha: string;
  horaInicio: string;
}

export async function sendConfirmacionCliente(turno: TurnoData) {
  await getResend().emails.send({
    from: process.env.EMAIL_FROM!,
    to: turno.email,
    subject: "Solicitud de turno recibida - Estudio Peralta Vera Costanzo",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background: #0d1a3d; padding: 24px; text-align: center;">
          <h1 style="color: #c9a84c; margin: 0; font-size: 20px;">Estudio Jurídico Peralta Vera Costanzo</h1>
        </div>
        <div style="padding: 32px; background: #f8f7f2;">
          <p>Estimado/a <strong>${turno.nombre}</strong>,</p>
          <p>Hemos recibido su solicitud de turno. A continuación el resumen:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #e8e4d9;">
              <td style="padding: 10px; font-weight: bold;">Servicio</td>
              <td style="padding: 10px;">${turno.servicio}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Fecha</td>
              <td style="padding: 10px;">${turno.fecha}</td>
            </tr>
            <tr style="background: #e8e4d9;">
              <td style="padding: 10px; font-weight: bold;">Hora</td>
              <td style="padding: 10px;">${turno.horaInicio}</td>
            </tr>
          </table>
          <p style="background: #fff8e1; border-left: 4px solid #c9a84c; padding: 12px; margin: 20px 0;">
            Su turno está <strong>pendiente de confirmación</strong>. Le enviaremos un email de confirmación a la brevedad.
          </p>
          <p>Ante cualquier consulta, comuníquese al <strong>${CONTACT.phoneDisplay}</strong> o responda este email.</p>
        </div>
        <div style="background: #0d1a3d; padding: 16px; text-align: center; color: #8da2d1; font-size: 12px;">
          © 2025 Estudio Jurídico Peralta Vera Costanzo. Todos los derechos reservados.
        </div>
      </div>
    `,
  });
}

export async function sendNotificacionAdmin(turno: TurnoData & { telefono: string; mensaje?: string }) {
  await getResend().emails.send({
    from: process.env.EMAIL_FROM!,
    to: process.env.EMAIL_ADMIN!,
    subject: `Nuevo turno: ${turno.nombre} - ${turno.fecha} ${turno.horaInicio}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0d1a3d;">Nuevo turno solicitado</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Nombre</td><td style="padding: 8px; border: 1px solid #ddd;">${turno.nombre}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td><td style="padding: 8px; border: 1px solid #ddd;">${turno.email}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Teléfono</td><td style="padding: 8px; border: 1px solid #ddd;">${turno.telefono}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Servicio</td><td style="padding: 8px; border: 1px solid #ddd;">${turno.servicio}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Fecha</td><td style="padding: 8px; border: 1px solid #ddd;">${turno.fecha}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Hora</td><td style="padding: 8px; border: 1px solid #ddd;">${turno.horaInicio}</td></tr>
          ${turno.mensaje ? `<tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Mensaje</td><td style="padding: 8px; border: 1px solid #ddd;">${turno.mensaje}</td></tr>` : ""}
        </table>
        <p style="margin-top: 20px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin" style="background: #0d1a3d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
            Ver en el panel de administración
          </a>
        </p>
      </div>
    `,
  });
}

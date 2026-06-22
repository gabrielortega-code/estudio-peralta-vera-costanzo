// Email sending deshabilitado temporalmente.
// Se implementará con Brevo en la fase de producción.

interface TurnoData {
  nombre: string;
  email: string;
  telefono: string;
  servicio: string;
  fecha: string;
  horaInicio: string;
  mensaje?: string;
}

export async function sendConfirmacionCliente(_turno: TurnoData): Promise<void> {
  // pendiente
}

export async function sendNotificacionAdmin(_turno: TurnoData): Promise<void> {
  // pendiente
}

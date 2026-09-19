/**
 * Reglas de la contraseña del panel. Vive aparte de `adminAuth.ts` porque el
 * formulario del panel las necesita y ese módulo importa Prisma y `node:crypto`,
 * que no pueden entrar al bundle del navegador.
 *
 * El cliente las usa para avisar mientras se escribe; quien decide es el
 * servidor, que valida lo mismo en `POST /api/admin/password`.
 */

/** Largo mínimo de la contraseña del panel. */
export const PASSWORD_MIN = 12;

/** Motivo por el que una contraseña no sirve, o null si está bien. */
export function motivoPasswordInvalida(password: unknown): string | null {
  if (typeof password !== "string" || password.length < PASSWORD_MIN) {
    return `La contraseña tiene que tener al menos ${PASSWORD_MIN} caracteres.`;
  }
  if (password.trim().length !== password.length) {
    return "La contraseña no puede empezar ni terminar con espacios.";
  }
  const obvias = ["contraseña", "password", "123456", "qwerty", "peralta"];
  const normalizada = password.toLowerCase();
  if (obvias.some((o) => normalizada.includes(o))) {
    return "Elegí una contraseña menos previsible: no puede contener palabras como “password”, “123456” o el nombre del estudio.";
  }
  return null;
}

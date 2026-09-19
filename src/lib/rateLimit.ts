import { NextRequest } from "next/server";

/**
 * Rate limit por clave, en memoria de la instancia. Con Fluid Compute las
 * instancias se reutilizan, así que frena ráfagas reales; no es un límite
 * distribuido y se pierde en un arranque en frío.
 *
 * Es la primera barrera, no la única: los límites que tienen que sobrevivir a
 * un reinicio (intentos por código, códigos emitidos por hora) viven en la base.
 */
export function crearLimitador(maxIntentos: number, ventanaMs: number) {
  const intentos = new Map<string, { count: number; resetAt: number }>();

  return function superaLimite(clave: string): boolean {
    const ahora = Date.now();
    const actual = intentos.get(clave);

    if (!actual || ahora > actual.resetAt) {
      intentos.set(clave, { count: 1, resetAt: ahora + ventanaMs });
      // Aprovechamos para no dejar crecer el Map sin control.
      if (intentos.size > 1000) {
        intentos.forEach((v, k) => {
          if (ahora > v.resetAt) intentos.delete(k);
        });
      }
      return false;
    }

    actual.count += 1;
    return actual.count > maxIntentos;
  };
}

/** IP del cliente según el proxy de Vercel. */
export function ipDe(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest } from "next/server";

/**
 * Autenticación del panel admin.
 *
 * Dos vías de acceso a las rutas /api/admin/*:
 *  - Header `x-admin-secret` con la clave (para scripts/diagnóstico).
 *  - Cookie de sesión httpOnly firmada, creada por POST /api/admin/login,
 *    para que el navegador quede logueado sin reingresar la clave.
 *
 * La cookie es un token `exp.hmac(exp)` firmado con ADMIN_SECRET: rotar la
 * clave invalida todas las sesiones activas.
 */

export const ADMIN_COOKIE = "admin_session";
const SESSION_DAYS = 30;

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function sign(payload: string): string {
  return createHmac("sha256", process.env.ADMIN_SECRET ?? "")
    .update(payload)
    .digest("hex");
}

export function isValidSecret(secret: string | null | undefined): boolean {
  const expected = process.env.ADMIN_SECRET;
  if (!expected || !secret) return false;
  return safeEqual(secret, expected);
}

export function createSessionCookie(): { value: string; maxAge: number } {
  const exp = String(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  return {
    value: `${exp}.${sign(exp)}`,
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  };
}

function isValidSessionToken(token: string | undefined): boolean {
  if (!token || !process.env.ADMIN_SECRET) return false;
  const dot = token.indexOf(".");
  if (dot === -1) return false;
  const exp = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
  return safeEqual(sig, sign(exp));
}

export function checkAdminAuth(req: NextRequest): boolean {
  const header = req.headers.get("x-admin-secret");
  if (header) return isValidSecret(header);
  return isValidSessionToken(req.cookies.get(ADMIN_COOKIE)?.value);
}

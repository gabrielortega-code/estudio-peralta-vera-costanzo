import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  createSessionCookie,
  isValidSecret,
} from "@/lib/adminAuth";

/**
 * Rate limit simple por IP para los intentos de login. Vive en memoria de la
 * instancia (con Fluid Compute las instancias se reutilizan, así que frena
 * ráfagas reales aunque no sea un límite global distribuido).
 */
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Demasiados intentos. Esperá un minuto y volvé a probar." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => ({}));
  if (!isValidSecret(body.secret)) {
    return NextResponse.json({ error: "Clave incorrecta" }, { status: 401 });
  }

  const session = createSessionCookie();
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, session.value, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: session.maxAge,
    path: "/",
  });
  return res;
}

/** Cierra la sesión eliminando la cookie. */
export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, maxAge: 0, path: "/" });
  return res;
}

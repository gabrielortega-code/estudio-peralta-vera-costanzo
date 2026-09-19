import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";
import { crearLimitador, ipDe } from "@/lib/rateLimit";
import {
  ADMIN_COOKIE,
  ADMIN_DEVICE_COOKIE,
  CODIGO_MAX_INTENTOS,
  COOKIE_OPTIONS,
  createDeviceCookie,
  createSessionCookie,
  getAdminUser,
  hashCodigo,
} from "@/lib/adminAuth";

/**
 * Segundo paso del login: el código que llegó por correo. Recién acá se emite
 * la cookie de sesión.
 */

const superaLimite = crearLimitador(15, 60 * 1000);

function hashesIguales(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

const VENCIDO = "El código venció o ya se usó. Volvé a ingresar tu contraseña para pedir uno nuevo.";

export async function POST(req: NextRequest) {
  if (superaLimite(ipDe(req))) {
    return NextResponse.json(
      { error: "Demasiados intentos. Esperá un minuto y volvé a probar." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const { challengeId, codigo, recordar } = body ?? {};

  if (typeof challengeId !== "string" || typeof codigo !== "string") {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const desafio = await (prisma as any).adminLoginCode.findUnique({
    where: { id: challengeId },
  });

  if (
    !desafio ||
    desafio.usedAt ||
    desafio.expiresAt < new Date() ||
    desafio.attempts >= CODIGO_MAX_INTENTOS
  ) {
    return NextResponse.json({ error: VENCIDO }, { status: 400 });
  }

  // El intento se cuenta antes de comparar: si la respuesta se pierde en el
  // camino, el intento igual quedó consumido.
  const { attempts } = await (prisma as any).adminLoginCode.update({
    where: { id: challengeId },
    data: { attempts: { increment: 1 } },
    select: { attempts: true },
  });

  if (!hashesIguales(hashCodigo(codigo.trim()), desafio.codeHash)) {
    const restantes = CODIGO_MAX_INTENTOS - attempts;
    return NextResponse.json(
      {
        error:
          restantes > 0
            ? `Código incorrecto. Te ${restantes === 1 ? "queda 1 intento" : `quedan ${restantes} intentos`}.`
            : VENCIDO,
      },
      { status: 401 }
    );
  }

  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "No se pudo iniciar sesión" }, { status: 503 });
  }

  // Un solo uso: se quema apenas se acierta.
  await (prisma as any).adminLoginCode.update({
    where: { id: challengeId },
    data: { usedAt: new Date() },
  });

  const session = createSessionCookie(user.tokenVersion);
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, session.value, {
    ...COOKIE_OPTIONS,
    maxAge: session.maxAge,
  });

  // Solo si lo pidió explícitamente: entrar una vez desde la computadora de un
  // cliente no tiene por qué dejarla marcada.
  if (recordar === true) {
    const device = createDeviceCookie(user.tokenVersion);
    res.cookies.set(ADMIN_DEVICE_COOKIE, device.value, {
      ...COOKIE_OPTIONS,
      maxAge: device.maxAge,
    });
  }

  return res;
}

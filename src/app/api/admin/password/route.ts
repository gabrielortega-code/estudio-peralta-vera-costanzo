import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { crearLimitador, ipDe } from "@/lib/rateLimit";
import {
  ADMIN_COOKIE,
  ADMIN_USER_ID,
  COOKIE_OPTIONS,
  checkAdminAuth,
  createSessionCookie,
  getAdminUser,
  hashPassword,
  motivoPasswordInvalida,
  verifyPassword,
} from "@/lib/adminAuth";

/**
 * Cambio de la contraseña del panel. Pide la actual aunque ya haya sesión, para
 * que una sesión olvidada en un dispositivo ajeno no alcance para quedarse con
 * el panel.
 *
 * Al guardar se incrementa `tokenVersion`, lo que invalida todas las sesiones
 * abiertas; la del navegador que hizo el cambio se renueva en la respuesta.
 */

const superaLimite = crearLimitador(10, 60 * 1000);

export async function POST(req: NextRequest) {
  if (!(await checkAdminAuth(req))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (superaLimite(ipDe(req))) {
    return NextResponse.json(
      { error: "Demasiados intentos. Esperá un minuto y volvé a probar." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const { actual, nueva } = body ?? {};

  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json(
      { error: "El panel todavía no tiene una contraseña configurada." },
      { status: 503 }
    );
  }

  if (typeof actual !== "string" || !(await verifyPassword(actual, user.passwordHash))) {
    return NextResponse.json(
      { error: "La contraseña actual no es correcta." },
      { status: 401 }
    );
  }

  const motivo = motivoPasswordInvalida(nueva);
  if (motivo) return NextResponse.json({ error: motivo }, { status: 400 });

  if (actual === nueva) {
    return NextResponse.json(
      { error: "La contraseña nueva tiene que ser distinta de la actual." },
      { status: 400 }
    );
  }

  const actualizado = await (prisma as any).adminUser.update({
    where: { id: ADMIN_USER_ID },
    data: {
      passwordHash: await hashPassword(nueva),
      tokenVersion: { increment: 1 },
    },
  });

  const session = createSessionCookie(actualizado.tokenVersion);
  const res = NextResponse.json({
    success: true,
    mensaje:
      "Contraseña actualizada. Las sesiones abiertas en otros dispositivos se cerraron.",
  });
  res.cookies.set(ADMIN_COOKIE, session.value, {
    ...COOKIE_OPTIONS,
    maxAge: session.maxAge,
  });
  return res;
}

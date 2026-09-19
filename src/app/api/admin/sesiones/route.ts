import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  ADMIN_DEVICE_COOKIE,
  ADMIN_USER_ID,
  COOKIE_OPTIONS,
  checkAdminAuth,
  createSessionCookie,
  getAdminUser,
} from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

/**
 * Cierra todas las sesiones y da de baja todos los dispositivos de confianza.
 *
 * Es la contraparte de tener una sesión larga que se renueva sola: si Javier
 * pierde la notebook o sospecha que alguien entró, con esto corta todo de una.
 *
 * Incrementar `tokenVersion` invalida de golpe las cookies de sesión y las de
 * dispositivo, porque las dos llevan la versión adentro de la firma. La pestaña
 * desde la que se hace el pedido recibe una sesión nueva, para no quedar afuera
 * por usar el botón.
 */
export async function DELETE(req: NextRequest) {
  if (!(await checkAdminAuth(req))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json(
      { error: "El panel todavía no tiene una contraseña configurada." },
      { status: 503 }
    );
  }

  const actualizado = await (prisma as any).adminUser.update({
    where: { id: ADMIN_USER_ID },
    data: { tokenVersion: { increment: 1 } },
  });

  const session = createSessionCookie(actualizado.tokenVersion);
  const res = NextResponse.json({
    success: true,
    mensaje:
      "Listo: se cerraron las sesiones en todos los dispositivos. Esta pestaña sigue conectada.",
  });
  res.cookies.set(ADMIN_COOKIE, session.value, {
    ...COOKIE_OPTIONS,
    maxAge: session.maxAge,
  });
  // Esta computadora también deja de ser de confianza: el próximo login vuelve
  // a pedir el código y ahí puede volver a marcarla.
  res.cookies.set(ADMIN_DEVICE_COOKIE, "", { ...COOKIE_OPTIONS, maxAge: 0 });
  return res;
}

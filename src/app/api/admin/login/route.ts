import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendCodigoAcceso } from "@/lib/email";
import { crearLimitador, ipDe } from "@/lib/rateLimit";
import {
  ADMIN_COOKIE,
  ADMIN_DEVICE_COOKIE,
  COOKIE_OPTIONS,
  CODIGO_MAX_POR_HORA,
  CODIGO_VIGENCIA_MIN,
  createSessionCookie,
  generarCodigo,
  getAdminUser,
  hashCodigo,
  isTrustedDevice,
  verifyPassword,
} from "@/lib/adminAuth";

/**
 * Primer paso del login: la contraseña.
 *
 * Si este navegador quedó marcado como de confianza, la contraseña alcanza y la
 * sesión se abre acá mismo. Si no, manda un código de un solo uso al correo de
 * Javier y devuelve el id del desafío para `POST /api/admin/login/verify`.
 */

const superaLimite = crearLimitador(10, 60 * 1000);

/** Deja ver a qué casilla fue el código sin exponerla entera. */
function ofuscarEmail(email: string): string {
  const [usuario, dominio] = email.split("@");
  if (!dominio) return "tu correo";
  const visible = usuario.slice(0, 1);
  return `${visible}${"•".repeat(Math.max(usuario.length - 1, 3))}@${dominio}`;
}

export async function POST(req: NextRequest) {
  if (superaLimite(ipDe(req))) {
    return NextResponse.json(
      { error: "Demasiados intentos. Esperá un minuto y volvé a probar." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const password = body?.password ?? body?.secret;

  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json(
      {
        error:
          "El panel todavía no tiene una contraseña configurada. Avisale a quien administra el sitio.",
      },
      { status: 503 }
    );
  }

  if (typeof password !== "string" || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  // Dispositivo de confianza: Javier ya verificó un código en este navegador y
  // pidió no volver a tener que hacerlo. El segundo factor protege contra quien
  // conoce la contraseña sin tener su navegador, y eso se sigue cumpliendo.
  if (await isTrustedDevice(req.cookies.get(ADMIN_DEVICE_COOKIE)?.value)) {
    const session = createSessionCookie(user.tokenVersion);
    const res = NextResponse.json({ step: "listo" });
    res.cookies.set(ADMIN_COOKIE, session.value, {
      ...COOKIE_OPTIONS,
      maxAge: session.maxAge,
    });
    return res;
  }

  // Tope de códigos por hora: que adivinar la contraseña no sirva para inundar
  // la casilla del estudio.
  const desdeHaceUnaHora = new Date(Date.now() - 60 * 60 * 1000);
  const emitidos = await (prisma as any).adminLoginCode.count({
    where: { createdAt: { gte: desdeHaceUnaHora } },
  });
  if (emitidos >= CODIGO_MAX_POR_HORA) {
    return NextResponse.json(
      {
        error:
          "Se pidieron demasiados códigos en la última hora. Esperá un rato o usá el último que recibiste.",
      },
      { status: 429 }
    );
  }

  const codigo = generarCodigo();
  const desafio = await (prisma as any).adminLoginCode.create({
    data: {
      codeHash: hashCodigo(codigo),
      expiresAt: new Date(Date.now() + CODIGO_VIGENCIA_MIN * 60 * 1000),
    },
  });

  try {
    await sendCodigoAcceso(user.email, codigo, CODIGO_VIGENCIA_MIN);
  } catch (error) {
    console.error("No se pudo enviar el código de acceso:", error);
    // Sin correo entregado el código es inútil: lo borramos para no gastar el
    // cupo por hora con un desafío que nadie va a poder responder.
    await (prisma as any).adminLoginCode
      .delete({ where: { id: desafio.id } })
      .catch(() => {});
    return NextResponse.json(
      { error: "No pudimos enviarte el código por correo. Probá de nuevo en unos minutos." },
      { status: 503 }
    );
  }

  // Limpieza oportunista de los códigos viejos.
  await (prisma as any).adminLoginCode
    .deleteMany({ where: { createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } } })
    .catch(() => {});

  return NextResponse.json({
    step: "codigo",
    challengeId: desafio.id,
    email: ofuscarEmail(user.email),
    vigenciaMin: CODIGO_VIGENCIA_MIN,
  });
}

/**
 * Cierra la sesión. No borra la marca de dispositivo de confianza: salir y
 * volver a entrar desde la computadora de siempre sigue pidiendo solo la
 * contraseña. Para dar de baja los dispositivos está "Cerrar sesión en todos
 * los dispositivos", en Seguridad.
 */
export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, "", { ...COOKIE_OPTIONS, maxAge: 0 });
  return res;
}

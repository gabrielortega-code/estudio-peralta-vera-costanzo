import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { crearLimitador, ipDe } from "@/lib/rateLimit";
import {
  ADMIN_COOKIE,
  ADMIN_USER_ID,
  COOKIE_OPTIONS,
  createSessionCookie,
  getAdminUser,
  hashPassword,
  isValidSecret,
  motivoPasswordInvalida,
} from "@/lib/adminAuth";

/**
 * Primera contraseña del panel, definida desde el navegador.
 *
 * Existe para que poner el panel en marcha no dependa de que alguien corra un
 * script contra la base de producción: al desplegar, la primera persona que
 * entre a /admin define la contraseña ahí mismo. `npm run admin:password` sigue
 * estando como recuperación si Javier se la olvida.
 *
 * Se protege con `ADMIN_SECRET`, que vive solo en las variables de entorno de
 * Vercel, y **se cierra sola apenas existe un administrador**: a partir de ahí
 * devuelve 409 y la única forma de cambiar la contraseña es sabiendo la actual.
 */

const superaLimite = crearLimitador(5, 60 * 1000);

const YA_CONFIGURADO =
  "El panel ya tiene una contraseña configurada. Para cambiarla, entrá y usá Seguridad.";

export async function POST(req: NextRequest) {
  if (superaLimite(ipDe(req))) {
    return NextResponse.json(
      { error: "Demasiados intentos. Esperá un minuto y volvé a probar." },
      { status: 429 }
    );
  }

  if (await getAdminUser()) {
    return NextResponse.json({ error: YA_CONFIGURADO }, { status: 409 });
  }

  const body = await req.json().catch(() => ({}));
  const { secret, email, password } = body ?? {};

  if (!isValidSecret(secret)) {
    return NextResponse.json(
      { error: "La clave de instalación no es correcta." },
      { status: 401 }
    );
  }

  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Hace falta un email válido: ahí van a llegar los códigos de acceso." },
      { status: 400 }
    );
  }

  const motivo = motivoPasswordInvalida(password);
  if (motivo) return NextResponse.json({ error: motivo }, { status: 400 });

  // `create` y no `upsert`: si entre el chequeo de arriba y esta línea alguien
  // más se adelantó, la clave primaria duplicada corta acá en vez de pisar la
  // contraseña que el otro acaba de definir.
  let user;
  try {
    user = await (prisma as any).adminUser.create({
      data: {
        id: ADMIN_USER_ID,
        email: email.trim(),
        passwordHash: await hashPassword(password),
      },
    });
  } catch (error) {
    // Solo la clave duplicada significa "alguien se adelantó". Cualquier otro
    // error de base tiene que verse como lo que es y no como un panel ya
    // configurado, que mandaría a Javier a buscar una contraseña inexistente.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json({ error: YA_CONFIGURADO }, { status: 409 });
    }
    console.error("Error configurando el administrador del panel:", error);
    return NextResponse.json(
      { error: "No pudimos guardar la contraseña. Probá de nuevo en unos minutos." },
      { status: 500 }
    );
  }

  const session = createSessionCookie(user.tokenVersion);
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, session.value, {
    ...COOKIE_OPTIONS,
    maxAge: session.maxAge,
  });
  return res;
}

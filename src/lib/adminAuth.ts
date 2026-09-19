import {
  createHmac,
  randomBytes,
  randomInt,
  createHash,
  scrypt as scryptCb,
  timingSafeEqual,
  type ScryptOptions,
} from "crypto";
import { promisify } from "util";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Autenticación del panel admin.
 *
 * Javier tiene una contraseña propia, que puede cambiar desde el panel y que se
 * guarda hasheada con scrypt en la tabla `admin_user`. Al entrar con ella se le
 * manda un código de un solo uso al correo: la cookie de sesión recién se emite
 * cuando verifica ese código.
 *
 * `ADMIN_SECRET` ya NO es la contraseña. Cumple dos funciones:
 *  - firma la cookie de sesión (rotarla cierra todas las sesiones abiertas);
 *  - habilita el acceso de emergencia por header `x-admin-secret`, sin segundo
 *    factor, para poder entrar si el correo de Javier deja de funcionar. Vive
 *    solo en las variables de entorno de Vercel.
 *
 * La cookie es `exp.ver.hmac(exp.ver)`. Incluir `tokenVersion` hace que cambiar
 * la contraseña invalide las sesiones viejas sin guardar una tabla de sesiones.
 */

// Las reglas de la contraseña viven aparte para que el formulario del panel las
// pueda importar sin arrastrar Prisma ni node:crypto al bundle del navegador.
export { PASSWORD_MIN, motivoPasswordInvalida } from "@/lib/passwordPolicy";

// `promisify` pierde la sobrecarga que acepta opciones, así que la recuperamos.
const scrypt = promisify(scryptCb) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
  options: ScryptOptions
) => Promise<Buffer>;

export const ADMIN_COOKIE = "admin_session";
export const ADMIN_DEVICE_COOKIE = "admin_device";
export const ADMIN_USER_ID = "main";

/**
 * Duración de la sesión. Se renueva sola: cada vez que el panel consulta los
 * turnos, si a la cookie le queda menos de la mitad se emite una nueva. Usando
 * el panel con cierta regularidad, Javier no vuelve a ver la pantalla de login.
 */
const SESSION_DAYS = 30;

/**
 * Cuánto dura la marca de "esta computadora es de confianza". En un dispositivo
 * marcado, el login solo pide la contraseña: el código por correo protege contra
 * quien averigua la contraseña pero no tiene el navegador de Javier, y una
 * cookie httpOnly en su máquina no le sirve a esa persona.
 */
const DEVICE_DAYS = 90;

/* ------------------------------ contraseñas ------------------------------ */

// Parámetros de scrypt. N=16384 es el mínimo recomendado y corre en ~100 ms.
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEYLEN = 64;

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** Deriva el hash guardable de una contraseña: `scrypt$N$r$p$salt$hash`. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, SCRYPT_KEYLEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  });
  return [
    "scrypt",
    SCRYPT_N,
    SCRYPT_R,
    SCRYPT_P,
    salt.toString("base64"),
    derived.toString("base64"),
  ].join("$");
}

/** Verifica una contraseña contra un hash guardado. Nunca lanza. */
export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  try {
    const [algo, n, r, p, saltB64, hashB64] = stored.split("$");
    if (algo !== "scrypt") return false;

    const salt = Buffer.from(saltB64, "base64");
    const esperado = Buffer.from(hashB64, "base64");
    const derived = await scrypt(password, salt, esperado.length, {
      N: Number(n),
      r: Number(r),
      p: Number(p),
    });
    return timingSafeEqual(derived, esperado);
  } catch {
    return false;
  }
}

/* --------------------------- códigos de un uso --------------------------- */

/** Minutos que vive un código antes de vencer. */
export const CODIGO_VIGENCIA_MIN = 10;
/** Intentos permitidos por código antes de quemarlo. */
export const CODIGO_MAX_INTENTOS = 5;
/** Códigos que se pueden pedir por hora, para no inundar la casilla. */
export const CODIGO_MAX_POR_HORA = 3;

/** Código de 6 dígitos, con ceros a la izquierda, de un generador criptográfico. */
export function generarCodigo(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export function hashCodigo(codigo: string): string {
  // sha256 alcanza: el código vive 10 minutos, tiene 5 intentos y un solo uso.
  return createHash("sha256").update(codigo).digest("hex");
}

/* --------------------------------- sesión -------------------------------- */

/**
 * Para qué sirve un token. Va adentro de la firma para que una cookie de
 * dispositivo no pueda presentarse como una de sesión, ni al revés.
 */
type Proposito = "sesion" | "dispositivo";

function sign(proposito: Proposito, payload: string): string {
  return createHmac("sha256", process.env.ADMIN_SECRET ?? "")
    .update(`${proposito}:${payload}`)
    .digest("hex");
}

export interface CookieFirmada {
  value: string;
  maxAge: number;
}

function crearToken(
  proposito: Proposito,
  dias: number,
  tokenVersion: number
): CookieFirmada {
  const exp = String(Date.now() + dias * 24 * 60 * 60 * 1000);
  const payload = `${exp}.${tokenVersion}`;
  return {
    value: `${payload}.${sign(proposito, payload)}`,
    maxAge: dias * 24 * 60 * 60,
  };
}

/**
 * Vencimiento del token en milisegundos si es válido, o null si no lo es.
 * Recibe el usuario ya leído para no repetir la consulta cuando el llamador
 * necesita validar y renovar en el mismo paso.
 */
function validarToken(
  proposito: Proposito,
  token: string | undefined,
  user: { tokenVersion: number } | null
): number | null {
  if (!token || !process.env.ADMIN_SECRET || !user) return null;

  const partes = token.split(".");
  if (partes.length !== 3) return null;
  const [exp, ver, sig] = partes;

  if (!/^\d+$/.test(exp) || !/^\d+$/.test(ver)) return null;
  if (Number(exp) < Date.now()) return null;
  if (!safeEqual(sig, sign(proposito, `${exp}.${ver}`))) return null;

  // La firma es válida, pero la contraseña puede haber cambiado después de
  // emitirla: en ese caso `tokenVersion` avanzó y el token ya no vale.
  if (Number(ver) !== user.tokenVersion) return null;

  return Number(exp);
}

/** Clave de emergencia por header. No emite sesión ni pide segundo factor. */
export function isValidSecret(secret: string | null | undefined): boolean {
  const expected = process.env.ADMIN_SECRET;
  if (!expected || !secret) return false;
  return safeEqual(secret, expected);
}

export function createSessionCookie(tokenVersion: number): CookieFirmada {
  return crearToken("sesion", SESSION_DAYS, tokenVersion);
}

/** Marca de dispositivo de confianza: saltea el código en este navegador. */
export function createDeviceCookie(tokenVersion: number): CookieFirmada {
  return crearToken("dispositivo", DEVICE_DAYS, tokenVersion);
}

/** Opciones de la cookie, compartidas por login, verificación y cambio de clave. */
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  path: "/",
} as const;

/** ¿Este valor de cookie corresponde a una sesión vigente? */
export async function isValidSessionToken(
  token: string | undefined
): Promise<boolean> {
  return validarToken("sesion", token, await getAdminUser()) !== null;
}

/** ¿Este navegador quedó marcado como de confianza y la marca sigue vigente? */
export async function isTrustedDevice(
  token: string | undefined
): Promise<boolean> {
  return validarToken("dispositivo", token, await getAdminUser()) !== null;
}

export async function getAdminUser() {
  try {
    return await (prisma as any).adminUser.findUnique({
      where: { id: ADMIN_USER_ID },
    });
  } catch {
    // Tabla todavía no creada (`prisma db push` pendiente).
    return null;
  }
}

export interface SesionAdmin {
  autorizada: boolean;
  /**
   * Cookie nueva cuando la sesión entró en su segunda mitad. La ruta que la
   * recibe la escribe en la respuesta; así la sesión se estira sola mientras
   * Javier use el panel, sin pedirle nada.
   */
  renovacion: CookieFirmada | null;
}

/**
 * ¿La request puede tocar /api/admin/*? Acepta el header de emergencia o una
 * cookie de sesión vigente, y de paso dice si conviene renovarla.
 */
export async function revisarSesion(req: NextRequest): Promise<SesionAdmin> {
  const header = req.headers.get("x-admin-secret");
  // El acceso de emergencia no abre sesión: no hay nada que renovar.
  if (header) return { autorizada: isValidSecret(header), renovacion: null };

  const user = await getAdminUser();
  const exp = validarToken("sesion", req.cookies.get(ADMIN_COOKIE)?.value, user);
  if (exp === null || !user) return { autorizada: false, renovacion: null };

  const mitad = (SESSION_DAYS * 24 * 60 * 60 * 1000) / 2;
  const renovacion =
    exp - Date.now() < mitad ? createSessionCookie(user.tokenVersion) : null;

  return { autorizada: true, renovacion };
}

/** Atajo para las rutas a las que no les interesa renovar la sesión. */
export async function checkAdminAuth(req: NextRequest): Promise<boolean> {
  return (await revisarSesion(req)).autorizada;
}

#!/usr/bin/env node
/**
 * Alta o cambio de la contraseña del panel desde la línea de comandos.
 *
 * Es la única forma de crear el primer administrador: el panel no tiene
 * registro público, a propósito. También sirve para recuperar el acceso si
 * Javier se olvida la contraseña.
 *
 * Uso:
 *   node scripts/admin-set-password.mjs
 *
 * Corre contra la base que apunte DATABASE_URL, así que para producción hay que
 * exportar la URL de Neon antes de ejecutarlo. Cambiar la contraseña cierra
 * todas las sesiones abiertas (incrementa tokenVersion).
 */

import { createInterface } from "node:readline";
import { randomBytes, scrypt as scryptCb } from "node:crypto";
import { promisify } from "node:util";
import { PrismaClient } from "@prisma/client";

const scrypt = promisify(scryptCb);

// Mismo formato que lee `verifyPassword` en src/lib/adminAuth.ts. Los parámetros
// viajan dentro del propio hash, así que la verificación no depende de que estos
// números sigan siendo iguales.
const N = 16384;
const R = 8;
const P = 1;
const KEYLEN = 64;
const MIN_LARGO = 12;

async function hashPassword(password) {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, KEYLEN, { N, r: R, p: P });
  return ["scrypt", N, R, P, salt.toString("base64"), derived.toString("base64")].join("$");
}

function preguntar(rl, texto, { oculto = false } = {}) {
  return new Promise((resolve) => {
    if (!oculto) return rl.question(texto, resolve);

    // readline no tiene modo contraseña: silenciamos la salida mientras escribe.
    const alEscribir = (char) => {
      if (char === "\n" || char === "\r" || char === "\u0004") return;
      rl.output.write("\u001b[2K\u001b[200D" + texto + "*".repeat(rl.line.length));
    };
    process.stdin.on("data", alEscribir);
    rl.question(texto, (valor) => {
      process.stdin.removeListener("data", alEscribir);
      rl.output.write("\n");
      resolve(valor);
    });
  });
}

async function main() {
  const prisma = new PrismaClient();
  const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });

  try {
    const existente = await prisma.adminUser.findUnique({ where: { id: "main" } });
    console.log(
      existente
        ? `Ya hay un administrador configurado (${existente.email}). Esto reemplaza su contraseña.\n`
        : "No hay administrador configurado todavía. Vamos a crear el primero.\n"
    );

    const emailPorDefecto = existente?.email ?? process.env.EMAIL_ADMIN ?? "";
    const emailIngresado = (
      await preguntar(rl, `Email del administrador${emailPorDefecto ? ` [${emailPorDefecto}]` : ""}: `)
    ).trim();
    const email = emailIngresado || emailPorDefecto;

    if (!email.includes("@")) {
      throw new Error("Hace falta un email válido: ahí llegan los códigos de acceso.");
    }

    const password = await preguntar(rl, "Contraseña nueva: ", { oculto: true });
    if (password.length < MIN_LARGO) {
      throw new Error(`La contraseña tiene que tener al menos ${MIN_LARGO} caracteres.`);
    }

    const repetida = await preguntar(rl, "Repetila: ", { oculto: true });
    if (password !== repetida) throw new Error("Las contraseñas no coinciden.");

    const passwordHash = await hashPassword(password);
    await prisma.adminUser.upsert({
      where: { id: "main" },
      create: { id: "main", email, passwordHash },
      // Subir tokenVersion cierra las sesiones abiertas con la clave anterior.
      update: { email, passwordHash, tokenVersion: { increment: 1 } },
    });

    console.log(`\n✓ Listo. ${email} ya puede entrar a /admin con esa contraseña.`);
    console.log("  El código de acceso de cada login va a llegar a esa casilla.");
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(`\n✗ ${error.message}`);
  process.exit(1);
});

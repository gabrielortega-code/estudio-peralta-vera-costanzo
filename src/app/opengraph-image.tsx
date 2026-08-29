import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

// Imagen que se muestra al compartir el sitio (WhatsApp, LinkedIn, X).
// Se genera en build a partir del logo, para no depender de un PNG a mano.
export const alt =
  "Estudio Jurídico Peralta & Vera Costanzo — Especialistas en Derecho de Seguros";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const logo = fs.readFileSync(
    path.join(process.cwd(), "public/branding/logo-horizontal-dorado.png")
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #080f24 0%, #0d1a3d 55%, #14285c 100%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} alt="" width={420} height={100} />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 58,
              lineHeight: 1.15,
              color: "#ffffff",
              letterSpacing: "-0.02em",
            }}
          >
            Especialistas en Derecho de Seguros
          </div>
          <div
            style={{
              fontSize: 58,
              lineHeight: 1.15,
              color: "#c9a84c",
              letterSpacing: "-0.02em",
            }}
          >
            En defensa del asegurado
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              width: 120,
              height: 3,
              backgroundColor: "#c9a84c",
              marginBottom: 24,
            }}
          />
          <div style={{ fontSize: 26, color: "#b3c1e0" }}>
            Córdoba, Argentina · Más de 14 años de trayectoria
          </div>
        </div>
      </div>
    ),
    size
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Estudio Jurídico Peralta & Vera Costanzo — Derecho de Seguros y Daños",
  description:
    "Estudio Jurídico especializado en Derecho de Seguros y Daños. Representamos a asegurados, damnificados y terceros en conflictos con compañías aseguradoras. Reserve su consulta.",
  keywords: [
    "abogados derecho de seguros",
    "reclamo a compañía de seguros",
    "rechazo de cobertura",
    "accidentes de tránsito",
    "daños y perjuicios",
    "Peralta Vera Costanzo",
    "abogados Córdoba",
  ],
  openGraph: {
    title: "Estudio Jurídico Peralta & Vera Costanzo",
    description:
      "Especialistas en Derecho de Seguros y Daños. Defendemos los derechos del asegurado desde hace más de 12 años.",
    type: "website",
  },
  icons: {
    icon: "/branding/isologo-oscuro.png",
    apple: "/branding/isologo-oscuro.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  );
}

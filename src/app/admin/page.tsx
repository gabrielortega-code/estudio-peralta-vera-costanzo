import { cookies } from "next/headers";
import AdminPanel from "@/components/admin/AdminPanel";
import { ADMIN_COOKIE, isValidSessionToken } from "@/lib/adminAuth";

export const metadata = {
  title: "Panel de Turnos | Peralta & Vera Costanzo",
  robots: { index: false, follow: false },
};

// La sesión se resuelve en cada visita, así que la página no se prerenderiza.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Resolver la sesión en el servidor evita el parpadeo de "Verificando
  // sesión…" y le ahorra una request al navegador cuando no hay sesión. La
  // protección real de los datos sigue estando en las rutas /api/admin/*.
  const sesionActiva = await isValidSessionToken(
    cookies().get(ADMIN_COOKIE)?.value
  );

  return <AdminPanel sesionActiva={sesionActiva} />;
}

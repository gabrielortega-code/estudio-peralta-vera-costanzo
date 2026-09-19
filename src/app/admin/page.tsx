import { cookies } from "next/headers";
import AdminPanel from "@/components/admin/AdminPanel";
import { ADMIN_COOKIE, getAdminUser, isValidSessionToken } from "@/lib/adminAuth";

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
  let sesionActiva = false;
  let necesitaSetup = false;

  try {
    sesionActiva = await isValidSessionToken(cookies().get(ADMIN_COOKIE)?.value);
    // Panel recién desplegado, sin contraseña todavía: en vez de la pantalla de
    // login mostramos la de instalación. Se resuelve acá y no con una ruta
    // propia para no exponerle a nadie más si el panel está configurado o no.
    necesitaSetup = !sesionActiva && !(await getAdminUser());
  } catch (error) {
    // La base no responde. Se muestra el login normal: ofrecer configurar el
    // panel cuando en realidad ya tiene contraseña sería peor que pedirla.
    console.error("No se pudo resolver el estado del panel:", error);
  }

  return (
    <AdminPanel sesionActiva={sesionActiva} necesitaSetup={necesitaSetup} />
  );
}

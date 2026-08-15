import Link from "next/link";
import Image from "next/image";

/**
 * Variante B del Hero: la foto del equipo va de fondo, anclada al borde inferior
 * derecho y atenuada con un degradé para que no compita con el texto.
 * Convive con `Hero.tsx` (variante A, foto al costado) hasta que el cliente elija
 * una; la que no se use se elimina junto con la ruta /preview/hero-fondo.
 */

const stats = [
  { value: "+14", label: "años de trayectoria" },
  { value: "+50", label: "productores de seguros asesorados" },
];

export default function HeroBackdrop() {
  return (
    <section className="relative min-h-screen flex items-center bg-navy-950 overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a84c' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Foto del equipo de fondo */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[72%] opacity-25 lg:opacity-100 pointer-events-none select-none">
        <Image
          src="/equipo/equipo-completo.png"
          alt=""
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 72vw"
          className="object-contain object-bottom lg:object-right-bottom"
        />
        {/* Velo lateral: funde la foto contra el navy por la izquierda */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/20 lg:to-transparent" />
        {/* Velo superior: evita el corte duro del recorte contra el borde */}
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-navy-950 to-transparent" />
      </div>

      {/* Gold accent line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600" />

      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-28">
        <div className="max-w-2xl">
          <p className="text-gold-400 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-5">
            Peralta &amp; Vera Costanzo · Estudio Jurídico
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white leading-[1.1] mb-5">
            Especialistas en Derecho de Seguros.
            <span className="block text-gold-400">
              En defensa del asegurado
            </span>
          </h1>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-10 max-w-xl">
            Asesoramos, defendemos y representamos a los asegurados frente a todo
            tipo de incumplimiento contractual por parte de las aseguradoras.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/turnos"
              className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-base px-8 py-4 rounded text-center transition-colors duration-200"
            >
              Reservar consulta
            </Link>
            <a
              href="#servicios"
              className="border-2 border-white/30 text-white hover:border-gold-400 hover:text-gold-400 font-semibold text-base px-8 py-4 rounded text-center transition-colors duration-200"
            >
              Ver áreas de práctica
            </a>
          </div>

          {/* Stats */}
          <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-white/10 pt-10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-gold-400 font-serif text-3xl md:text-4xl font-bold">
                  {stat.value}
                </dt>
                <dd className="text-gray-400 text-sm mt-1 leading-snug">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import Image from "next/image";

/**
 * Variante B del Hero: en desktop la foto del equipo va de fondo, a sangre sobre
 * el borde derecho y atenuada sólo en el sector donde se cruza con el texto.
 * En mobile el concepto de "fondo" no se lee, así que la foto baja como bloque
 * entre los botones y las métricas, apoyada sobre una luz suave.
 * Convive con `Hero.tsx` (variante A, foto en recuadro) hasta que el cliente
 * elija una; la que no se use se elimina junto con /preview/hero-fondo.
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

      {/* Desktop — foto de fondo sobre el borde derecho */}
      <div className="hidden lg:block absolute inset-y-0 right-0 w-[57%] pointer-events-none select-none">
        {/* Luz de fondo: despega los trajes oscuros del navy de la sección */}
        <div className="absolute right-[4%] bottom-0 w-[85%] h-[80%] rounded-[50%] bg-navy-700/45 blur-3xl" />
        <Image
          src="/equipo/equipo-completo.png"
          alt=""
          fill
          priority
          sizes="57vw"
          className="object-contain object-right-bottom brightness-110 contrast-[1.05]"
        />
        {/* Velo lateral: sólo funde el borde izquierdo, donde la foto se cruza
            con el texto. Se corta antes de llegar a las personas. */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, #080f24 0%, rgba(8,15,36,0.92) 8%, rgba(8,15,36,0.55) 18%, rgba(8,15,36,0) 29%)",
          }}
        />
        {/* Velo superior: evita el corte duro del recorte contra el borde */}
        <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-navy-950 to-transparent" />
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

          {/* Mobile/tablet — la foto baja como bloque, sobre una luz suave que
              evita que los trajes oscuros se pierdan contra el navy */}
          <div className="lg:hidden relative mt-12">
            <div className="absolute inset-x-[6%] bottom-0 h-[85%] rounded-[50%] bg-navy-700/45 blur-3xl" />
            <Image
              src="/equipo/equipo-completo.png"
              alt="Equipo del Estudio Jurídico Peralta & Vera Costanzo"
              width={1600}
              height={900}
              sizes="(max-width: 640px) 100vw, 448px"
              className="relative w-full h-auto max-w-sm sm:max-w-md mx-auto brightness-110 contrast-[1.05]"
            />
          </div>

          {/* Stats */}
          <dl className="mt-12 lg:mt-16 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-white/10 pt-10">
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

import Link from "next/link";
import Image from "next/image";

const stats = [
  { value: "+14", label: "años de trayectoria" },
  { value: "+50", label: "productores de seguros asesorados" },
];

/** Trama dorada de fondo, reutilizada en la sección y dentro del recuadro. */
const goldPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a84c' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-navy-950 overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{ backgroundImage: goldPattern }}
      />

      {/* Gold accent line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600" />

      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Texto */}
          <div className="lg:col-span-7">
            <p className="text-gold-400 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-5">
              Peralta &amp; Vera Costanzo · Estudio Jurídico
            </p>
            {/* El tamaño en lg/xl está calibrado para que la línea dorada
                entre completa en un solo renglón dentro de esta columna. */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.25rem] xl:text-[2.6rem] font-serif font-bold text-white leading-[1.1] mb-5">
              Especialistas en Derecho de Seguros.
              <span className="block text-gold-400 lg:whitespace-nowrap">
                En defensa del asegurado
              </span>
            </h1>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-10">
              Asesoramos, defendemos y representamos a los asegurados frente a
              todo tipo de incumplimiento contractual por parte de las
              aseguradoras.
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
          </div>

          {/* Foto del equipo en recuadro redondeado con fondo propio: el panel
              más claro despega los trajes oscuros del navy de la sección. */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] w-full max-w-md mx-auto lg:max-w-none rounded-3xl overflow-hidden bg-gradient-to-b from-navy-700 via-navy-800 to-navy-900 ring-1 ring-white/15 shadow-2xl shadow-black/40">
              <div
                className="absolute inset-0 opacity-[0.09]"
                style={{ backgroundImage: goldPattern }}
              />
              <Image
                src="/equipo/equipo-completo.png"
                alt="Equipo del Estudio Jurídico Peralta & Vera Costanzo"
                fill
                priority
                sizes="(max-width: 1024px) 448px, 42vw"
                className="object-cover object-bottom scale-110 origin-bottom"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <dl className="mt-12 lg:mt-14 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-white/10 pt-10 max-w-xl">
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
    </section>
  );
}

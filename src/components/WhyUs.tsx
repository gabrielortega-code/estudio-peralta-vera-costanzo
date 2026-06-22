const reasons = [
  {
    title: "Especialización",
    description:
      "Nos dedicamos especialmente al Derecho de Seguros, con experiencia en reclamos contra compañías aseguradoras y conflictos derivados de siniestros.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    title: "Experiencia práctica",
    description:
      "Conocemos el funcionamiento del mercado asegurador, sus procedimientos internos y las defensas habituales frente a los reclamos.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Estrategia jurídica",
    description:
      "Analizamos cada caso en profundidad para definir la vía más conveniente: negociación, mediación, reclamo administrativo o acción judicial.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: "Atención personalizada",
    description:
      "Cada cliente recibe un acompañamiento directo, claro y constante durante todo el proceso.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    title: "Gestión integral del reclamo",
    description:
      "Intervenimos desde el análisis inicial de la póliza y del siniestro hasta la resolución extrajudicial o judicial del conflicto.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    title: "Compromiso profesional",
    description:
      "Trabajamos con seriedad, transparencia y orientación a resultados concretos.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
];

export default function WhyUs() {
  return (
    <section id="por-que-elegirnos" className="py-20 bg-navy-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left column */}
          <div className="lg:sticky lg:top-28">
            <p className="text-gold-400 text-sm font-semibold uppercase tracking-widest mb-4">
              Por qué elegirnos
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
              En defensa de los derechos del asegurado desde hace más de 12 años
            </h2>
            <p className="text-gray-400 leading-relaxed mb-8">
              Somos un Estudio Jurídico especializado en Derecho de Seguros y
              Daños. Representamos a asegurados, damnificados y terceros en
              conflictos con compañías aseguradoras, combinando especialización,
              estrategia y un acompañamiento cercano en cada etapa del reclamo.
            </p>
            <div className="border-l-4 border-gold-500 pl-6">
              <p className="text-white font-serif italic text-lg">
                "Cada caso es único. Cada cliente merece una solución a medida,
                no una respuesta genérica."
              </p>
              <p className="text-gold-400 text-sm mt-3">
                — Estudio Jurídico Peralta &amp; Vera Costanzo
              </p>
            </div>
          </div>

          {/* Right column - reasons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {reasons.map((reason) => (
              <div
                key={reason.title}
                className="bg-navy-900 rounded-lg p-6 border border-navy-700"
              >
                <div className="w-11 h-11 rounded-lg bg-gold-500/15 text-gold-400 flex items-center justify-center mb-4">
                  {reason.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{reason.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

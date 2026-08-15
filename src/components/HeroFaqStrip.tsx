const highlight = {
  question: "¿Problemas con tu aseguradora?",
  answer:
    "Te asesoramos y representamos ante conflictos derivados de siniestros, análisis de póliza, incumplimiento de la aseguradora, demoras injustificadas, liquidaciones de pago insuficientes, rechazos de cobertura, toda controversia en el vínculo contractual entre asegurado y aseguradora.",
};

const items = [
  {
    question: "¿Sufriste un accidente de tránsito?",
    answer: "Reclamamos tus daños.",
  },
  {
    question: "¿Te reclaman por un siniestro?",
    answer: "Te defendemos.",
  },
];

export default function HeroFaqStrip() {
  return (
    <section className="bg-gray-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="border-l-4 border-gold-500 pl-5 sm:pl-6">
          <p className="text-navy-900 font-serif font-bold text-xl sm:text-2xl leading-snug">
            {highlight.question}
          </p>
          <p className="text-gray-700 text-base leading-relaxed mt-2">
            {highlight.answer}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mt-8 pt-6 border-t border-gray-200">
          {items.map((item) => (
            <p key={item.question} className="text-sm text-gray-600 leading-snug">
              <span className="font-medium text-navy-900">{item.question}</span>{" "}
              {item.answer}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

const items = [
  {
    question: "¿Tu compañía de seguros no responde?",
    answer: "Defendemos al asegurado.",
  },
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
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

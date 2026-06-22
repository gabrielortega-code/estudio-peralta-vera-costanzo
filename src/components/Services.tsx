import Link from "next/link";
import { services, servicesIntro } from "@/lib/services";
import { serviceIcons } from "@/lib/serviceIcons";

export default function Services() {
  return (
    <section id="servicios" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="section-subtitle">Áreas de práctica</p>
          <h2 className="section-title">Especializados en Derecho de Seguros y Daños</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">{servicesIntro}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/servicios/${service.slug}`}
              className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow duration-200 group border border-gray-100 flex flex-col"
            >
              <div className="w-16 h-16 bg-navy-50 rounded-lg flex items-center justify-center text-navy-700 group-hover:bg-navy-900 group-hover:text-gold-400 transition-colors duration-200 mb-6">
                {serviceIcons[service.slug]}
              </div>
              <h3 className="text-xl font-serif font-bold text-navy-900 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {service.cardDescription}
              </p>
              <span className="text-navy-700 group-hover:text-gold-600 font-semibold text-sm mt-4 inline-flex items-center gap-1 transition-colors">
                Ver más
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/servicios"
            className="inline-block border-2 border-navy-700 text-navy-700 hover:bg-navy-700 hover:text-white font-semibold text-sm px-8 py-3 rounded transition-colors"
          >
            Ver todas las áreas de práctica
          </Link>
        </div>
      </div>
    </section>
  );
}

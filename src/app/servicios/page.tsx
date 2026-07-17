import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { services, servicesIntro } from "@/lib/services";
import { serviceIcons } from "@/lib/serviceIcons";

export const metadata: Metadata = {
  title: "Áreas de práctica — Estudio Jurídico Peralta & Vera Costanzo",
  description:
    "Áreas de práctica del Estudio Jurídico Peralta & Vera Costanzo: Derecho de Seguros, rechazos de cobertura, accidentes de tránsito, responsabilidad civil y daños, liquidación de siniestros y más.",
};

export default function ServiciosPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative bg-navy-950 pt-36 pb-20 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gold-400 text-sm font-semibold uppercase tracking-widest mb-4">
              Áreas de práctica
            </p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              Especializados en Derecho de Seguros y Daños
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">{servicesIntro}</p>
          </div>
        </section>

        {/* Grid de áreas */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {services.filter((service) => service.featured).map((service) => (
                <Link
                  key={service.slug}
                  href={`/servicios/${service.slug}`}
                  className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow duration-200 group border border-gray-100 flex flex-col"
                >
                  <div className="w-16 h-16 bg-navy-50 rounded-lg flex items-center justify-center text-navy-700 group-hover:bg-navy-900 group-hover:text-gold-400 transition-colors duration-200 mb-6">
                    {serviceIcons[service.slug]}
                  </div>
                  <h2 className="text-xl font-serif font-bold text-navy-900 mb-3">
                    {service.title}
                  </h2>
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
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="section-title mb-4">
              ¿Tuvo un conflicto con su compañía de seguros?
            </h2>
            <p className="text-gray-600 mb-8">
              Analizamos su caso y definimos juntos la mejor estrategia. La
              primera consulta es sin compromiso.
            </p>
            <Link
              href="/turnos"
              className="inline-block bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-base px-8 py-4 rounded transition-colors"
            >
              Reservar consulta
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

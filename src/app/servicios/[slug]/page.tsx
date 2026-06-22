import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { services, getService } from "@/lib/services";
import { serviceIcons } from "@/lib/serviceIcons";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: `${service.longTitle} — Estudio Jurídico Peralta & Vera Costanzo`,
    description: service.cardDescription,
  };
}

export default async function ServicioDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative bg-navy-950 pt-36 pb-20 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-16 bg-navy-900 rounded-lg flex items-center justify-center text-gold-400 mx-auto mb-6">
              {serviceIcons[service.slug]}
            </div>
            <p className="text-gold-400 text-sm font-semibold uppercase tracking-widest mb-4">
              Áreas de práctica
            </p>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
              {service.longTitle}
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">{service.lead}</p>
          </div>
        </section>

        {/* Contenido */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Intro */}
            <div className="space-y-5 mb-14">
              {service.intro.map((p, i) => (
                <p key={i} className="text-gray-600 text-lg leading-relaxed">
                  {p}
                </p>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Situaciones típicas */}
              <div>
                <h2 className="text-xl font-serif font-bold text-navy-900 mb-5">
                  ¿Cuándo consultarnos?
                </h2>
                <ul className="space-y-3">
                  {service.situations.map((item) => (
                    <li key={item} className="flex gap-3 text-gray-600">
                      <svg
                        className="w-5 h-5 text-navy-400 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cómo intervenimos */}
              <div>
                <h2 className="text-xl font-serif font-bold text-navy-900 mb-5">
                  Cómo intervenimos
                </h2>
                <ul className="space-y-3">
                  {service.howWeHelp.map((item) => (
                    <li key={item} className="flex gap-3 text-gray-600">
                      <svg
                        className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="section-title mb-4">
              ¿Su caso encaja con esta área?
            </h2>
            <p className="text-gray-600 mb-8">
              Analizamos su situación y definimos juntos la mejor estrategia. La
              primera consulta es sin compromiso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/turnos"
                className="inline-block bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-base px-8 py-4 rounded transition-colors"
              >
                Reservar consulta
              </Link>
              <Link
                href="/servicios"
                className="inline-block border-2 border-navy-700 text-navy-700 hover:bg-navy-700 hover:text-white font-semibold text-base px-8 py-4 rounded transition-colors"
              >
                Ver todas las áreas
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

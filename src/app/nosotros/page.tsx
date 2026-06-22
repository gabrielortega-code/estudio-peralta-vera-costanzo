import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { team, teamIntro } from "@/lib/team";

export const metadata: Metadata = {
  title: "Sobre Nosotros — Estudio Jurídico Peralta & Vera Costanzo",
  description:
    "Conozca al equipo del Estudio Jurídico Peralta & Vera Costanzo, especializado en Derecho de Seguros y Daños. Abogados dedicados a la defensa de asegurados, damnificados y terceros.",
};

export default function NosotrosPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative bg-navy-950 pt-36 pb-20 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gold-400 text-sm font-semibold uppercase tracking-widest mb-4">
              Sobre nosotros
            </p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              Un equipo especializado en Derecho de Seguros y Daños
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              {teamIntro}
            </p>
          </div>
        </section>

        {/* Team photo band */}
        <section className="bg-navy-900">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Image
              src="/equipo/equipo-completo.png"
              alt="Equipo del Estudio Jurídico Peralta & Vera Costanzo"
              width={1600}
              height={900}
              className="w-full h-auto max-w-3xl mx-auto"
              priority
            />
          </div>
        </section>

        {/* Members */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
            {team.map((member, i) => (
              <article
                key={member.slug}
                id={member.slug}
                className="scroll-mt-28 grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 items-start"
              >
                {/* Photo */}
                <div
                  className={`md:col-span-2 ${
                    i % 2 === 1 ? "md:order-2" : ""
                  }`}
                >
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-navy-100 shadow-md">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover object-top"
                    />
                  </div>
                </div>

                {/* Detail */}
                <div className="md:col-span-3">
                  <p className="text-gold-600 text-sm font-semibold uppercase tracking-widest mb-2">
                    {member.role} · {member.matricula}
                  </p>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-navy-900">
                    {member.name}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1 mb-5">
                    {member.title}
                  </p>

                  <p className="text-gray-600 leading-relaxed mb-6">
                    {member.profile}
                  </p>

                  {/* Áreas */}
                  <p className="text-navy-900 font-semibold text-sm mb-3">
                    Áreas de intervención
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {member.areas.map((area) => (
                      <span
                        key={area}
                        className="bg-navy-50 text-navy-700 text-xs font-medium px-3 py-1.5 rounded-full"
                      >
                        {area}
                      </span>
                    ))}
                  </div>

                  {/* Antecedentes */}
                  <p className="text-navy-900 font-semibold text-sm mb-3">
                    Antecedentes destacados
                  </p>
                  <ul className="space-y-2">
                    {member.background.map((item) => (
                      <li key={item} className="flex gap-3 text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5"
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

                  {member.pending && (
                    <p className="text-gray-400 text-xs italic mt-5">
                      Ficha profesional ampliada próximamente.
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-50 py-16">
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

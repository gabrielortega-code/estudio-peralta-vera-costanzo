import Link from "next/link";
import Image from "next/image";
import { team, teamIntro } from "@/lib/team";

export default function Team() {
  return (
    <section id="equipo" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="section-subtitle">Quiénes somos</p>
          <h2 className="section-title">Nuestro equipo</h2>
          <p className="text-gray-600 mt-4 max-w-3xl mx-auto leading-relaxed">
            {teamIntro}
          </p>
        </div>

        {/* Team photo */}
        <div className="relative mb-14 rounded-2xl bg-navy-950 overflow-hidden border border-navy-800">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a84c'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <Image
            src="/equipo/equipo-completo.png"
            alt="Equipo del Estudio Jurídico Peralta & Vera Costanzo"
            width={1600}
            height={900}
            className="relative w-full h-auto max-w-3xl mx-auto"
          />
        </div>

        {/* Member cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <Link
              key={member.slug}
              href={`/nosotros#${member.slug}`}
              className="group text-center"
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-navy-100 mb-4">
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="text-base font-serif font-bold text-navy-900 leading-tight">
                {member.name}
              </h3>
              <p className="text-gold-600 text-sm font-semibold mt-1">
                {member.role}
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/nosotros"
            className="inline-block border-2 border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white font-semibold text-sm px-7 py-3 rounded transition-colors"
          >
            Conocé más sobre nosotros
          </Link>
        </div>
      </div>
    </section>
  );
}

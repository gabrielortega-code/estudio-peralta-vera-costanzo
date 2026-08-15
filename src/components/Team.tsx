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

import Link from "next/link";
import { CONTACT, MAPS_QUERY, whatsappHref, WHATSAPP_DEFAULT_MESSAGE } from "@/lib/site";

export default function Contact() {
  return (
    <section id="contacto" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact info */}
          <div>
            <p className="section-subtitle">Estamos para ayudarle</p>
            <h2 className="section-title mb-6">Contacto</h2>
            <p className="text-gray-600 leading-relaxed mb-10">
              ¿Tiene una consulta legal? Comuníquese con nosotros por el medio
              que prefiera. La primera consulta es sin cargo y sin compromiso.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-navy-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-navy-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-navy-900">Dirección</p>
                  <p className="text-gray-600 text-sm mt-1">
                    {CONTACT.address.line1}<br />
                    {CONTACT.address.line2}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-navy-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-navy-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-navy-900">Teléfono / WhatsApp</p>
                  <a
                    href={`tel:${CONTACT.phoneTel}`}
                    className="text-gray-600 text-sm mt-1 block hover:text-navy-900 transition-colors"
                  >
                    {CONTACT.phoneDisplay}
                  </a>
                  <a
                    href={whatsappHref(WHATSAPP_DEFAULT_MESSAGE)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#1ebe5d] text-sm font-medium mt-1 hover:underline"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Escribinos por WhatsApp
                  </a>
                  <p className="text-gray-500 text-xs mt-1">Lun–Vie 9:00 a 18:00</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-navy-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-navy-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-navy-900">Email</p>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="text-gray-600 text-sm mt-1 block hover:text-navy-900 transition-colors"
                  >
                    {CONTACT.email}
                  </a>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-10 p-6 bg-navy-950 rounded-lg">
              <p className="text-gold-400 font-semibold mb-2">
                ¿Prefiere elegir fecha y hora?
              </p>
              <p className="text-gray-400 text-sm mb-4">
                Reserve su turno de consulta online en menos de 2 minutos.
              </p>
              <Link
                href="/turnos"
                className="inline-block bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-sm px-6 py-3 rounded transition-colors"
              >
                Reservar turno online
              </Link>
            </div>
          </div>

          {/* Map */}
          <div className="flex flex-col gap-6">
            <div className="flex-1 rounded-lg overflow-hidden min-h-64 border border-gray-200">
              <iframe
                title="Ubicación del estudio en Google Maps"
                src={`https://www.google.com/maps?q=${encodeURIComponent(MAPS_QUERY)}&output=embed`}
                className="w-full h-full min-h-64"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            {/* Office hours */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-navy-900 mb-4">Horario de atención</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Lunes – Viernes</span>
                  <span className="font-medium text-navy-900">9:00 – 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sábados</span>
                  <span className="font-medium text-navy-900">9:00 – 13:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Domingos y feriados</span>
                  <span className="text-gray-400">Cerrado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

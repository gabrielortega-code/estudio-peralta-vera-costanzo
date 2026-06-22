"use client";

import { useEffect, useState } from "react";
import {
  HORARIOS,
  CANALES_VIRTUAL,
  TEL_JAVIER,
  toDateKey,
  addDays,
  type Modalidad,
  type CanalVirtual,
} from "@/lib/turnos";
import {
  type CalendarConfigData,
  type ModalidadDia,
  DEFAULT_CALENDAR,
  getModalidadForDate,
} from "@/lib/calendar";

type FormState = "idle" | "loading" | "success" | "error";

export default function BookingForm() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [modalidad, setModalidad] = useState<Modalidad>("Presencial");
  const [canal, setCanal] = useState<CanalVirtual>("Zoom");
  const [confirm, setConfirm] = useState<{
    modalidad: Modalidad;
    canal: CanalVirtual | null;
  } | null>(null);

  // Mínimo reservable: el día siguiente (no hoy ni en menos de 24 hs)
  const minDate = addDays(toDateKey(new Date()), 1);

  // Fecha controlada para poder reaccionar a cambios y consultar el calendario
  const [fecha, setFecha] = useState(minDate);

  // Configuración del calendario
  const [calConfig, setCalConfig] = useState<CalendarConfigData>(DEFAULT_CALENDAR);
  useEffect(() => {
    fetch("/api/calendario")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setCalConfig(d); })
      .catch(() => {});
  }, []);

  const modalidadDia: ModalidadDia = getModalidadForDate(calConfig, fecha);

  // Sincroniza modalidad cuando el día solo permite una opción
  useEffect(() => {
    if (modalidadDia === "presencial") setModalidad("Presencial");
    else if (modalidadDia === "virtual") setModalidad("Virtual");
  }, [modalidadDia]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as Record<string, string>;

    // Validación de la regla de 24 hs en el cliente
    if (fecha < minDate) {
      setState("error");
      setErrorMsg(
        "Los turnos se reservan a partir del día siguiente. Elegí una fecha desde mañana."
      );
      return;
    }

    // Validación contra la configuración del calendario
    if (modalidadDia === "bloqueado") {
      setState("error");
      setErrorMsg("El estudio no atiende en esa fecha. Por favor elegí otro día.");
      return;
    }

    const payload = {
      ...data,
      modalidad,
      canal: modalidad === "Virtual" ? canal : null,
    };

    setState("loading");
    try {
      const res = await fetch("/api/turnos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Error al procesar la solicitud");
      }

      setConfirm({ modalidad, canal: modalidad === "Virtual" ? canal : null });
      setState("success");
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Error inesperado");
    }
  }

  /* --------------------------- thank you page --------------------------- */
  if (state === "success" && confirm) {
    const esVirtual = confirm.modalidad === "Virtual";
    const esWhatsapp = confirm.canal === "WhatsApp (videollamada)";
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-serif font-bold text-navy-900 mb-3">
          ¡Solicitud recibida!
        </h3>
        <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
          Un <strong>especialista del estudio</strong> se pondrá en contacto a la
          brevedad para confirmar el día y horario de tu consulta.
        </p>

        {esVirtual && (
          <div className="mt-6 text-left bg-navy-50 border border-navy-100 rounded-lg p-5 max-w-md mx-auto">
            <p className="text-sm font-semibold text-navy-900 mb-1">
              Tu consulta será virtual por {confirm.canal}
            </p>
            {esWhatsapp ? (
              <p className="text-sm text-gray-600">
                Te contactaremos por WhatsApp al número que indicaste para
                realizar la videollamada en el horario acordado.
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                Te enviaremos el enlace de la reunión por email y WhatsApp antes
                de la consulta.
              </p>
            )}
            <p className="text-sm text-gray-600 mt-3">
              Si no encontrás el enlace, comunicate con <strong>Javier</strong>:
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <a
                href={`https://wa.me/${TEL_JAVIER.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413z" />
                </svg>
                WhatsApp
              </a>
              <a
                href={`tel:${TEL_JAVIER.replace(/[^\d+]/g, "")}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 bg-navy-50 hover:bg-navy-100 px-3 py-1.5 rounded-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {TEL_JAVIER}
              </a>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-6">
          También recibirás un email con el resumen de tu solicitud.
        </p>
      </div>
    );
  }

  /* ------------------------------- form -------------------------------- */
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal data */}
      <div>
        <h3 className="text-base font-semibold text-navy-900 mb-4 pb-2 border-b border-gray-200">
          Datos personales
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              placeholder="Juan García"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              DNI
            </label>
            <input
              type="text"
              name="dni"
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              placeholder="12.345.678"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              placeholder="juan@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="telefono"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              placeholder="351 123 4567"
            />
          </div>
        </div>
      </div>

      {/* Modalidad */}
      <div>
        <h3 className="text-base font-semibold text-navy-900 mb-4 pb-2 border-b border-gray-200">
          Modalidad de la consulta
        </h3>

        {modalidadDia === "bloqueado" ? (
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-sm text-rose-700">
            <p className="font-semibold">El estudio no atiende en esa fecha.</p>
            <p className="mt-1 text-rose-600">Por favor, elegí otra fecha disponible en el calendario.</p>
          </div>
        ) : (
          <>
            {modalidadDia !== "ambas" && (
              <p className="text-xs text-slate-500 mb-3">
                {modalidadDia === "presencial"
                  ? "En esa fecha solo se ofrecen consultas presenciales."
                  : "En esa fecha solo se ofrecen consultas virtuales."}
              </p>
            )}
            <div className={`gap-3 ${modalidadDia === "ambas" ? "grid grid-cols-2" : "flex"}`}>
              {modalidadDia !== "virtual" && (
                <button
                  type="button"
                  onClick={() => setModalidad("Presencial")}
                  className={`flex items-center justify-center gap-2 py-3 rounded-lg border-2 text-sm font-semibold transition-colors ${
                    modalidad === "Presencial"
                      ? "border-navy-900 bg-navy-50 text-navy-900"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Presencial
                </button>
              )}
              {modalidadDia !== "presencial" && (
                <button
                  type="button"
                  onClick={() => setModalidad("Virtual")}
                  className={`flex items-center justify-center gap-2 py-3 rounded-lg border-2 text-sm font-semibold transition-colors ${
                    modalidad === "Virtual"
                      ? "border-navy-900 bg-navy-50 text-navy-900"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Virtual
                </button>
              )}
            </div>
          </>
        )}

        {/* Canal virtual */}
        {modalidad === "Virtual" && modalidadDia !== "bloqueado" && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Por dónde preferís la videollamada?{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {CANALES_VIRTUAL.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCanal(c)}
                  className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-colors ${
                    canal === c
                      ? "border-gold-500 bg-gold-50 text-navy-900"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Día y horario */}
      <div>
        <h3 className="text-base font-semibold text-navy-900 mb-4 pb-2 border-b border-gray-200">
          Día y horario
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="fecha"
              required
              min={minDate}
              value={fecha}
              onChange={e => e.target.value && setFecha(e.target.value)}
              className={`w-full border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent ${
                modalidadDia === "bloqueado"
                  ? "border-rose-300 bg-rose-50"
                  : "border-gray-300"
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Horario <span className="text-red-500">*</span>
            </label>
            <select
              name="horaInicio"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent bg-white"
            >
              <option value="">Seleccioná un horario…</option>
              {HORARIOS.map((h) => (
                <option key={h} value={h}>{h} hs</option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-gold-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          Los turnos se reservan a partir del día siguiente.
        </p>
      </div>

      {/* Descripción */}
      <div>
        <h3 className="text-base font-semibold text-navy-900 mb-4 pb-2 border-b border-gray-200">
          Tu caso
        </h3>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Breve descripción del caso <span className="text-red-500">*</span>
        </label>
        <textarea
          name="mensaje"
          rows={4}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent resize-none"
          placeholder="Contanos brevemente tu situación (qué pasó, con qué aseguradora, en qué etapa estás) para que el especialista pueda prepararse."
        />
      </div>

      {state === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700">
          {errorMsg || "Ocurrió un error. Por favor intentá nuevamente."}
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-xs text-amber-800">
        La primera consulta es <strong>sin cargo</strong>. Un especialista se
        comunicará para confirmar la disponibilidad del horario.
      </div>

      <button
        type="submit"
        disabled={state === "loading" || modalidadDia === "bloqueado"}
        className="w-full bg-navy-900 hover:bg-navy-800 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded transition-colors duration-200 flex items-center justify-center gap-2"
      >
        {state === "loading" ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Enviando…
          </>
        ) : (
          "Solicitar turno"
        )}
      </button>
    </form>
  );
}

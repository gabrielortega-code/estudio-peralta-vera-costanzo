"use client";

import { useState, useMemo } from "react";
import {
  type CalendarConfigData,
  type ModalidadDia,
  type BlockedRange,
  DEFAULT_CALENDAR,
  getModalidadForDate,
  MODALIDAD_LABEL,
  WEEKDAY_NAMES,
  WEEKDAY_ABBR,
  CALENDAR_HEADER,
  MONTH_NAMES,
  horariosHabilitados,
  monthCells,
} from "@/lib/calendar";
import {
  type Turno,
  ESTADOS_QUE_OCUPAN,
  HORARIOS,
  horaToMin,
  toDateKey,
  turnoDateKey,
} from "@/lib/turnos";

/* ─── visual tokens ─────────────────────────────────────────── */

const TOK: Record<
  ModalidadDia,
  { bg: string; ring: string; text: string; dot: string; chip: string }
> = {
  ambas:      { bg: "bg-emerald-50", ring: "ring-emerald-300", text: "text-emerald-800", dot: "bg-emerald-500", chip: "bg-emerald-100 text-emerald-800" },
  presencial: { bg: "bg-amber-50",   ring: "ring-amber-300",   text: "text-amber-800",   dot: "bg-amber-500",   chip: "bg-amber-100 text-amber-800"   },
  virtual:    { bg: "bg-blue-50",    ring: "ring-blue-300",    text: "text-blue-800",    dot: "bg-blue-500",    chip: "bg-blue-100 text-blue-800"    },
  bloqueado:  { bg: "bg-rose-50",    ring: "ring-rose-200",    text: "text-rose-700",    dot: "bg-rose-400",    chip: "bg-rose-100 text-rose-700"    },
};

/* ─── horarios ──────────────────────────────────────────────── */

// El corte del mediodía: los slots arrancan de nuevo a las 14:00.
const SLOTS_MANANA = HORARIOS.filter((h) => horaToMin(h) < 13 * 60);
const SLOTS_TARDE = HORARIOS.filter((h) => horaToMin(h) >= 13 * 60);

function mismoConjunto(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((h) => b.includes(h));
}

/** Texto corto para no tener que abrir la fila y ver los 15 horarios. */
function resumenHoras(horas: string[]): string {
  if (horas.length === 0) return "Sin horarios";
  if (mismoConjunto(horas, HORARIOS)) return "Todos los horarios";
  if (mismoConjunto(horas, SLOTS_MANANA)) return "Solo por la mañana";
  if (mismoConjunto(horas, SLOTS_TARDE)) return "Solo por la tarde";
  return `${horas.length} de ${HORARIOS.length} horarios`;
}

/* ─── calendar helpers ──────────────────────────────────────── */

function weekdayOf(dk: string): string {
  const [y, m, d] = dk.split("-").map(Number);
  return String(new Date(y, m - 1, d).getDay());
}

function dateLabel(dk: string): string {
  const [y, m, d] = dk.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function dayLongLabel(dk: string): string {
  const [y, m, d] = dk.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/* ─── grilla de horarios ────────────────────────────────────── */

const ATAJOS: [string, string[]][] = [
  ["Todo el día", HORARIOS],
  ["Solo mañana", SLOTS_MANANA],
  ["Solo tarde", SLOTS_TARDE],
  ["Ninguno", []],
];

/** Los 15 horarios como chips que se prenden y apagan, más los atajos. */
function GrillaHoras({
  horas,
  onToggle,
  onAtajo,
  deshabilitada,
}: {
  horas: string[];
  onToggle: (hora: string) => void;
  onAtajo: (horas: string[]) => void;
  deshabilitada?: boolean;
}) {
  return (
    <div className={deshabilitada ? "opacity-40 pointer-events-none" : ""}>
      <div className="flex flex-wrap gap-1.5 mb-2.5">
        {ATAJOS.map(([label, set]) => (
          <button
            key={label}
            type="button"
            onClick={() => onAtajo([...set])}
            className={[
              "px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors",
              mismoConjunto(horas, set)
                ? "bg-navy-900 border-navy-900 text-white"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-5 sm:grid-cols-8 gap-1.5">
        {HORARIOS.map(h => {
          const activo = horas.includes(h);
          return (
            <button
              key={h}
              type="button"
              aria-pressed={activo}
              onClick={() => onToggle(h)}
              className={[
                "py-1.5 rounded-lg text-[11px] font-semibold border transition-colors",
                activo
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                  : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50 line-through decoration-slate-300",
              ].join(" ")}
            >
              {h}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── component ─────────────────────────────────────────────── */

interface Props {
  initialConfig: CalendarConfigData;
  onSave: (config: CalendarConfigData) => void;
  onClose: () => void;
  saving?: boolean;
  /** Turnos ya cargados, para avisar si un cambio deja alguno fuera de horario. */
  turnos?: Turno[];
}

export default function CalendarConfigPanel({
  initialConfig,
  onSave,
  onClose,
  saving,
  turnos = [],
}: Props) {
  const todayKey = toDateKey(new Date());
  const now = new Date();

  /* draft state */
  const [draft, setDraft] = useState<CalendarConfigData>({
    weekdayDefaults: {
      ...DEFAULT_CALENDAR.weekdayDefaults,
      ...initialConfig.weekdayDefaults,
    },
    dayOverrides: { ...initialConfig.dayOverrides },
    blockedRanges: [...initialConfig.blockedRanges],
    weekdayHours: { ...initialConfig.weekdayHours },
    dayHours: { ...initialConfig.dayHours },
  });

  /* fila de horarios abierta en "Horarios de atención" */
  const [wdAbierto, setWdAbierto] = useState<string | null>(null);

  /* calendar nav */
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selected, setSelected] = useState<string | null>(null);

  /* add-range form */
  const [showAddRange, setShowAddRange] = useState(false);
  const [newFrom, setNewFrom] = useState(todayKey);
  const [newTo, setNewTo] = useState(todayKey);
  const [newMotivo, setNewMotivo] = useState("");

  const cells = useMemo(
    () => monthCells(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  /* mutations */
  function setOverride(dk: string, val: ModalidadDia | null) {
    setDraft(prev => {
      const ov = { ...prev.dayOverrides };
      if (val === null) delete ov[dk];
      else ov[dk] = val;
      return { ...prev, dayOverrides: ov };
    });
  }

  function setWeekdayDefault(wd: string, val: ModalidadDia) {
    setDraft(prev => ({
      ...prev,
      weekdayDefaults: { ...prev.weekdayDefaults, [wd]: val },
    }));
  }

  /** Horarios habilitados hoy para un día de la semana (sin configurar = todos). */
  function horasDeWeekday(wd: string): string[] {
    return draft.weekdayHours?.[wd] ?? HORARIOS;
  }

  function setWeekdayHours(wd: string, horas: string[]) {
    setDraft(prev => ({
      ...prev,
      weekdayHours: { ...prev.weekdayHours, [wd]: horas },
    }));
  }

  function toggleHoraWeekday(wd: string, hora: string) {
    const actuales = horasDeWeekday(wd);
    setWeekdayHours(
      wd,
      actuales.includes(hora)
        ? actuales.filter(h => h !== hora)
        : HORARIOS.filter(h => h === hora || actuales.includes(h))
    );
  }

  /** Horarios de una fecha puntual, o null si hereda los del día de la semana. */
  function horasDeDia(dk: string): string[] | null {
    return draft.dayHours?.[dk] ?? null;
  }

  function setDayHours(dk: string, horas: string[] | null) {
    setDraft(prev => {
      const dh = { ...prev.dayHours };
      if (horas === null) delete dh[dk];
      else dh[dk] = horas;
      return { ...prev, dayHours: dh };
    });
  }

  function toggleHoraDia(dk: string, hora: string) {
    const actuales = horasDeDia(dk) ?? horasDeWeekday(weekdayOf(dk));
    setDayHours(
      dk,
      actuales.includes(hora)
        ? actuales.filter(h => h !== hora)
        : HORARIOS.filter(h => h === hora || actuales.includes(h))
    );
  }

  function handleAddRange() {
    if (!newFrom || !newTo || newFrom > newTo) return;
    const id = `br_${Date.now()}`;
    setDraft(prev => ({
      ...prev,
      blockedRanges: [
        ...prev.blockedRanges,
        { id, from: newFrom, to: newTo, motivo: newMotivo.trim() || undefined },
      ].sort((a, b) => a.from.localeCompare(b.from)),
    }));
    setShowAddRange(false);
    setNewFrom(todayKey);
    setNewTo(todayKey);
    setNewMotivo("");
  }

  function removeRange(id: string) {
    setDraft(prev => ({
      ...prev,
      blockedRanges: prev.blockedRanges.filter(r => r.id !== id),
    }));
  }

  /**
   * Turnos futuros que el borrador dejaría fuera de la agenda: o porque se
   * bloqueó el día, o porque se apagó su horario. No se cancelan solos — esto
   * es un aviso para que Javier los reprograme o hable con el cliente.
   */
  const conflictos = useMemo(() => {
    return turnos
      .filter(
        t =>
          ESTADOS_QUE_OCUPAN.includes(t.estado) && turnoDateKey(t) >= todayKey
      )
      .filter(t => {
        const dk = turnoDateKey(t);
        if (getModalidadForDate(draft, dk) === "bloqueado") return true;
        return !horariosHabilitados(draft, dk).includes(t.horaInicio);
      })
      .sort((a, b) => turnoDateKey(a).localeCompare(turnoDateKey(b)));
  }, [turnos, draft, todayKey]);

  /* derived for selected day */
  const selWd        = selected ? weekdayOf(selected) : null;
  const selOverride  = selected ? (draft.dayOverrides[selected] ?? null) : null;
  const selWdDefault = selWd ? (draft.weekdayDefaults[selWd] ?? "ambas") : null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="absolute inset-0 bg-navy-950/50" onClick={onClose} aria-hidden />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-2 sm:my-8 overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-5 sm:px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-serif font-bold text-navy-900 text-lg sm:text-xl">
              Configuración del calendario
            </h2>
            <p className="text-slate-500 text-sm mt-0.5">
              Definí modalidades y horarios por día, y bloqueá períodos sin
              disponibilidad.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="text-slate-400 hover:text-slate-700 ml-4 mt-1 flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(100dvh-160px)] px-5 sm:px-6 py-5 space-y-7">

          {/* ── Calendario ── */}
          <section>
            {/* Nav de mes */}
            <div className="flex items-center gap-2 mb-4">
              <button
                type="button"
                onClick={prevMonth}
                className="w-8 h-8 grid place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 flex-shrink-0"
                aria-label="Mes anterior"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <p className="flex-1 text-center font-serif font-bold text-navy-900 capitalize text-base sm:text-lg">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </p>
              <button
                type="button"
                onClick={nextMonth}
                className="w-8 h-8 grid place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 flex-shrink-0"
                aria-label="Mes siguiente"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              {(viewYear !== now.getFullYear() || viewMonth !== now.getMonth()) && (
                <button
                  type="button"
                  onClick={() => { setViewYear(now.getFullYear()); setViewMonth(now.getMonth()); }}
                  className="text-xs text-navy-700 hover:text-navy-900 font-medium border border-slate-200 px-2.5 h-8 rounded-lg flex-shrink-0"
                >
                  Hoy
                </button>
              )}
            </div>

            {/* Grilla */}
            <div className="grid grid-cols-7 gap-1">
              {/* Cabecera: lunes primero */}
              {CALENDAR_HEADER.map(d => (
                <div key={d} className="text-center text-[10px] sm:text-xs font-semibold text-slate-400 py-1 uppercase tracking-wide">
                  {d}
                </div>
              ))}

              {cells.map((dk, i) => {
                if (!dk) return <div key={`pad-${i}`} />;
                const m = getModalidadForDate(draft, dk);
                const tok = TOK[m];
                const isToday = dk === todayKey;
                const isSel = dk === selected;
                const hasOverride = Boolean(draft.dayOverrides[dk]);
                const isPast = dk < todayKey;
                const dayNum = parseInt(dk.slice(8), 10);

                return (
                  <button
                    key={dk}
                    type="button"
                    onClick={() => setSelected(isSel ? null : dk)}
                    className={[
                      "relative flex flex-col items-center justify-center h-9 sm:h-11 rounded-lg text-xs sm:text-sm font-medium transition-all select-none",
                      tok.bg,
                      isPast ? "opacity-40 cursor-default" : "cursor-pointer hover:opacity-80",
                      isSel
                        ? `ring-2 ${tok.ring} shadow-md scale-[1.1] z-10`
                        : `ring-1 ${tok.ring} ring-opacity-30`,
                    ].join(" ")}
                  >
                    <span className={isToday ? "font-bold " + tok.text : tok.text}>
                      {dayNum}
                    </span>
                    {isToday && (
                      <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-navy-600" />
                    )}
                    {hasOverride && (
                      <span className={`absolute bottom-0.5 w-1 h-1 rounded-full ${tok.dot}`} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Leyenda */}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 pt-3 border-t border-slate-100">
              {(["ambas", "presencial", "virtual", "bloqueado"] as ModalidadDia[]).map(m => {
                const tok = TOK[m];
                return (
                  <div key={m} className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className={`w-3 h-3 rounded-sm ${tok.bg} ring-1 ${tok.ring}`} />
                    {MODALIDAD_LABEL[m]}
                  </div>
                );
              })}
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                Punto = excepción puntual
              </div>
            </div>
          </section>

          {/* ── Día seleccionado ── */}
          {selected && selWd && selWdDefault && (
            <section className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Configuración para este día
                  </p>
                  <p className="font-serif font-bold text-navy-900 capitalize text-base mt-0.5">
                    {dayLongLabel(selected)}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selOverride
                      ? <>Excepción manual activa · regla del {WEEKDAY_NAMES[selWd].toLowerCase()}: <span className="font-medium">{MODALIDAD_LABEL[selWdDefault].toLowerCase()}</span></>
                      : <>Hereda la regla del {WEEKDAY_NAMES[selWd].toLowerCase()} · configurá una excepción abajo</>
                    }
                  </p>
                </div>
                {selOverride && (
                  <button
                    type="button"
                    onClick={() => setOverride(selected, null)}
                    className="text-xs text-rose-500 hover:text-rose-700 font-semibold ml-3 flex-shrink-0 mt-1"
                  >
                    Quitar excepción
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["ambas", "presencial", "virtual", "bloqueado"] as ModalidadDia[]).map(opt => {
                  const tok = TOK[opt];
                  const isWdDefault = selWdDefault === opt && !selOverride;
                  const isActive = selOverride === opt || isWdDefault;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() =>
                        setOverride(
                          selected,
                          // Si ya es el default del día de semana y no hay override, no hacemos nada; si hay override del mismo valor, lo quitamos
                          selOverride === opt
                            ? null
                            : opt === selWdDefault
                            ? null
                            : opt
                        )
                      }
                      className={[
                        "flex flex-col items-start gap-1.5 py-3 px-3 rounded-xl border text-xs font-medium transition-all",
                        isActive
                          ? `${tok.bg} border-transparent ring-2 ${tok.ring} ${tok.text} font-semibold`
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${isActive ? tok.dot : "bg-slate-300"}`} />
                      <span>
                        {MODALIDAD_LABEL[opt]}
                        {isWdDefault && (
                          <span className="block text-[10px] opacity-60 font-normal mt-0.5">por defecto</span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Horarios de este día puntual */}
              {getModalidadForDate(draft, selected) !== "bloqueado" && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex items-start justify-between mb-2.5">
                    <div>
                      <p className="text-xs font-semibold text-slate-700">
                        Horarios de este día
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {horasDeDia(selected)
                          ? "Excepción solo para esta fecha."
                          : <>Hereda los horarios del {WEEKDAY_NAMES[selWd].toLowerCase()}. Tocá un horario para crear una excepción.</>}
                      </p>
                    </div>
                    {horasDeDia(selected) && (
                      <button
                        type="button"
                        onClick={() => setDayHours(selected, null)}
                        className="text-[11px] text-rose-500 hover:text-rose-700 font-semibold ml-3 flex-shrink-0"
                      >
                        Volver a los del {WEEKDAY_ABBR[Number(selWd)].toLowerCase()}
                      </button>
                    )}
                  </div>
                  <GrillaHoras
                    horas={horasDeDia(selected) ?? horasDeWeekday(selWd)}
                    onToggle={h => toggleHoraDia(selected, h)}
                    onAtajo={hs => setDayHours(selected, hs)}
                  />
                </div>
              )}
            </section>
          )}

          {/* ── Reglas por día de la semana ── */}
          <section>
            <h3 className="text-sm font-semibold text-navy-900 mb-0.5">
              Reglas por día de la semana
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Cada día aplica esta regla salvo que hayas configurado una excepción puntual.
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {["1", "2", "3", "4", "5", "6", "0"].map(wd => {
                const val = draft.weekdayDefaults[wd] ?? "ambas";
                const tok = TOK[val];
                return (
                  <div key={wd} className={`rounded-xl p-2.5 ${tok.bg} ring-1 ${tok.ring}`}>
                    <p className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wide text-center">
                      {WEEKDAY_ABBR[Number(wd)]}
                    </p>
                    <select
                      value={val}
                      onChange={e => setWeekdayDefault(wd, e.target.value as ModalidadDia)}
                      className="w-full text-[11px] bg-white border border-slate-200 rounded-md px-1 py-1.5 focus:outline-none focus:ring-1 focus:ring-navy-500 cursor-pointer"
                    >
                      <option value="ambas">Ambas</option>
                      <option value="presencial">Presencial</option>
                      <option value="virtual">Virtual</option>
                      <option value="bloqueado">Sin turnos</option>
                    </select>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Horarios de atención ── */}
          <section>
            <h3 className="text-sm font-semibold text-navy-900 mb-0.5">
              Horarios de atención
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              En qué horas se puede reservar cada día. Las consultas duran 1 hora,
              así que un turno a las 10:00 también ocupa las 09:30 y las 10:30.
            </p>
            <div className="space-y-1.5">
              {["1", "2", "3", "4", "5", "6", "0"].map(wd => {
                const bloqueado =
                  (draft.weekdayDefaults[wd] ?? "ambas") === "bloqueado";
                const horas = horasDeWeekday(wd);
                const abierto = wdAbierto === wd;
                return (
                  <div
                    key={wd}
                    className="border border-slate-200 rounded-xl overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setWdAbierto(abierto ? null : wd)}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-sm font-semibold text-navy-900 w-20 sm:w-24 flex-shrink-0">
                        {WEEKDAY_NAMES[wd]}
                      </span>
                      <span
                        className={`text-xs flex-1 ${
                          bloqueado ? "text-rose-600" : "text-slate-500"
                        }`}
                      >
                        {bloqueado ? "Sin turnos ese día" : resumenHoras(horas)}
                      </span>
                      <svg
                        className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${
                          abierto ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {abierto && (
                      <div className="px-3.5 pb-3.5 pt-3 border-t border-slate-100">
                        {bloqueado && (
                          <p className="text-[11px] text-rose-600 mb-2.5">
                            Este día está marcado como “Sin turnos” más arriba, así
                            que no se reserva a ninguna hora.
                          </p>
                        )}
                        <GrillaHoras
                          horas={horas}
                          deshabilitada={bloqueado}
                          onToggle={h => toggleHoraWeekday(wd, h)}
                          onAtajo={hs => setWeekdayHours(wd, hs)}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Períodos bloqueados ── */}
          <section>
            <h3 className="text-sm font-semibold text-navy-900 mb-0.5">
              Períodos sin disponibilidad
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Feriados, vacaciones, licencias o cualquier ausencia. Bloquean el calendario completo.
            </p>

            {draft.blockedRanges.length > 0 && (
              <div className="space-y-2 mb-3">
                {draft.blockedRanges.map(r => (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 bg-rose-50 ring-1 ring-rose-200 rounded-lg px-4 py-2.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold text-rose-800">
                        {dateLabel(r.from)}
                        {r.from !== r.to && <> → {dateLabel(r.to)}</>}
                      </span>
                      {r.motivo && (
                        <span className="text-xs text-rose-600 ml-2">· {r.motivo}</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeRange(r.id)}
                      className="text-rose-300 hover:text-rose-600 transition-colors flex-shrink-0"
                      aria-label="Eliminar período"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showAddRange ? (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <p className="text-sm font-semibold text-slate-700">Nuevo período bloqueado</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Desde</label>
                    <input
                      type="date"
                      value={newFrom}
                      onChange={e => {
                        setNewFrom(e.target.value);
                        if (e.target.value > newTo) setNewTo(e.target.value);
                      }}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Hasta</label>
                    <input
                      type="date"
                      value={newTo}
                      min={newFrom}
                      onChange={e => setNewTo(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Motivo <span className="text-slate-400">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    value={newMotivo}
                    onChange={e => setNewMotivo(e.target.value)}
                    placeholder="Ej. Vacaciones, Feriado, Congreso…"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleAddRange}
                    disabled={!newFrom || !newTo || newFrom > newTo}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white text-sm font-semibold rounded-lg"
                  >
                    Agregar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddRange(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 text-sm font-medium rounded-lg"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowAddRange(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50 rounded-lg text-sm font-medium text-slate-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Agregar período bloqueado
              </button>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-4 border-t border-slate-100">
          {conflictos.length > 0 && (
            <div className="mb-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-amber-900">
                {conflictos.length === 1
                  ? "Hay 1 turno agendado fuera de esta configuración"
                  : `Hay ${conflictos.length} turnos agendados fuera de esta configuración`}
              </p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                No se cancelan al guardar. Revisalos y reprogramalos o avisale al
                cliente.
              </p>
              <ul className="mt-2 space-y-0.5">
                {conflictos.slice(0, 5).map(t => (
                  <li key={t.id} className="text-[11px] text-amber-800">
                    · {dateLabel(turnoDateKey(t))} a las {t.horaInicio} hs —{" "}
                    {t.nombre}
                  </li>
                ))}
                {conflictos.length > 5 && (
                  <li className="text-[11px] text-amber-700">
                    · y {conflictos.length - 5} más
                  </li>
                )}
              </ul>
            </div>
          )}
          <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-slate-400 hidden sm:block">
            Los cambios se aplican al formulario de turnos de inmediato.
          </p>
          <div className="flex gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => onSave(draft)}
              disabled={saving}
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-navy-900 hover:bg-navy-800 disabled:opacity-50 text-white"
            >
              {saving ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

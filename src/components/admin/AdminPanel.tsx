"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  type Turno,
  type EstadoTurno,
  type LinkSettings,
  ESTADO_META,
  HORARIOS,
  toDateKey,
  addDays,
  turnoDateKey,
  formatLongDate,
  formatShortDate,
  whatsappLink,
  mailtoLink,
  telLink,
  waMessageLink,
  mailMessageLink,
  mensajeConfirmacion,
  ASUNTO_CONFIRMACION,
  loadLinkSettings,
  saveLinkSettings,
  defaultLinkFor,
} from "@/lib/turnos";
import { type CalendarConfigData, DEFAULT_CALENDAR } from "@/lib/calendar";
import CalendarConfigPanel from "./CalendarConfigPanel";

/* ------------------------------- helpers -------------------------------- */

function addHour(hora: string): string {
  const [h, m] = hora.split(":").map(Number);
  const d = new Date();
  d.setHours(h + 1, m, 0, 0);
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

function StatusPill({ estado }: { estado: EstadoTurno }) {
  const meta = ESTADO_META[estado];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${meta.pill}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

/* ------------------------------ component ------------------------------- */

const ESTADO_FILTERS: { value: "TODOS" | EstadoTurno; label: string }[] = [
  { value: "TODOS", label: "Todos" },
  { value: "PENDIENTE", label: "Pendientes" },
  { value: "CONFIRMADO", label: "Confirmados" },
  { value: "CANCELADO", label: "Cancelados" },
  { value: "COMPLETADO", label: "Completados" },
];

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [secret, setSecret] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [dateKey, setDateKey] = useState(toDateKey(new Date()));
  const [estadoFilter, setEstadoFilter] = useState<"TODOS" | EstadoTurno>(
    "TODOS"
  );
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Turno | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [settings, setSettings] = useState<LinkSettings>({ zoom: "", meet: "" });
  const [showSettings, setShowSettings] = useState(false);
  const [calendarConfig, setCalendarConfig] = useState<CalendarConfigData>(DEFAULT_CALENDAR);
  const [showCalendar, setShowCalendar] = useState(false);
  const [savingCalendar, setSavingCalendar] = useState(false);

  useEffect(() => {
    setSettings(loadLinkSettings());
  }, []);

  // Si hay una sesión activa (cookie), entra directo sin pedir la clave.
  useEffect(() => {
    fetch("/api/admin/turnos")
      .then(async (res) => {
        if (!res.ok) return;
        setTurnos(await res.json());
        setAuthenticated(true);
        loadCalendarConfig();
      })
      .catch(() => {})
      .finally(() => setCheckingSession(false));
  }, []);

  const todayKey = toDateKey(new Date());

  function notify(msg: string) {
    setToast(msg);
    window.clearTimeout((notify as any)._t);
    (notify as any)._t = window.setTimeout(() => setToast(null), 2600);
  }

  /* ----------------------------- data load ----------------------------- */

  async function loadCalendarConfig() {
    try {
      const res = await fetch("/api/admin/calendario");
      if (res.ok) setCalendarConfig(await res.json());
    } catch {
      /* usa defaults */
    }
  }

  async function handleSaveCalendar(config: CalendarConfigData) {
    setSavingCalendar(true);
    try {
      const res = await fetch("/api/admin/calendario", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setCalendarConfig(config);
        setShowCalendar(false);
        notify("Calendario guardado");
      } else {
        const json = await res.json().catch(() => ({}));
        notify(json.error ?? "Error al guardar el calendario");
      }
    } catch {
      notify("Error de conexión al guardar el calendario");
    } finally {
      setSavingCalendar(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    try {
      const login = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
      });
      if (login.status === 429) {
        setLoginError("Demasiados intentos. Esperá un minuto y volvé a probar.");
        return;
      }
      if (!login.ok) throw new Error();
      const res = await fetch("/api/admin/turnos");
      if (!res.ok) throw new Error();
      setTurnos(await res.json());
      setSecret("");
      setAuthenticated(true);
      loadCalendarConfig();
    } catch {
      setLoginError("Clave incorrecta o sin conexión a la base de datos.");
    } finally {
      setLoggingIn(false);
    }
  }

  /** Actualiza el turno en memoria y persiste en la API. */
  function mutate(id: string, patch: Partial<Turno>, msg?: string) {
    setTurnos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch } : t))
    );
    setSelected((sel) => (sel && sel.id === id ? { ...sel, ...patch } : sel));
    fetch("/api/admin/turnos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    }).catch(() => {});
    if (msg) notify(msg);
  }

  /* ------------------------------ derived ------------------------------ */

  const delDia = useMemo(
    () => turnos.filter((t) => turnoDateKey(t) === dateKey),
    [turnos, dateKey]
  );

  const visibles = useMemo(() => {
    const q = search.trim().toLowerCase();
    return delDia
      .filter((t) => estadoFilter === "TODOS" || t.estado === estadoFilter)
      .filter(
        (t) =>
          !q ||
          t.nombre.toLowerCase().includes(q) ||
          t.email.toLowerCase().includes(q) ||
          t.telefono.toLowerCase().includes(q) ||
          t.servicio.toLowerCase().includes(q)
      )
      .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
  }, [delDia, estadoFilter, search]);

  const stats = useMemo(() => {
    const count = (e: EstadoTurno) =>
      delDia.filter((t) => t.estado === e).length;
    const weekEnd = addDays(todayKey, 7);
    const semana = turnos.filter(
      (t) => turnoDateKey(t) >= todayKey && turnoDateKey(t) < weekEnd
    ).length;
    return {
      dia: delDia.length,
      pendientes: count("PENDIENTE"),
      confirmados: count("CONFIRMADO"),
      semana,
    };
  }, [delDia, turnos, todayKey]);

  /* ------------------------------- login ------------------------------- */

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Verificando sesión…</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-8">
            <Image
              src="/branding/isologo-claro.png"
              alt="Peralta & Vera Costanzo"
              width={64}
              height={62}
              className="h-12 w-auto mb-4"
            />
            <h1 className="text-white font-serif font-bold text-xl">
              Panel de Turnos
            </h1>
            <p className="text-gray-400 text-sm">Peralta &amp; Vera Costanzo</p>
          </div>

          <form
            onSubmit={handleLogin}
            className="bg-white rounded-xl shadow-xl p-6 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Clave de acceso
              </label>
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                placeholder="Ingrese la clave…"
                autoFocus
              />
            </div>
            {loginError && (
              <p className="text-rose-600 text-xs">{loginError}</p>
            )}
            <button
              type="submit"
              disabled={loggingIn}
              className="w-full bg-navy-900 hover:bg-navy-800 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              {loggingIn ? "Verificando…" : "Ingresar al panel"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ----------------------------- dashboard ----------------------------- */

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top bar */}
      <header className="bg-navy-950 text-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/branding/isologo-claro.png"
              alt=""
              width={40}
              height={39}
              className="h-8 w-auto"
            />
            <div className="leading-tight">
              <p className="font-serif font-bold text-sm sm:text-base">
                Panel de Turnos
              </p>
              <p className="text-gray-400 text-[11px] hidden sm:block">
                Peralta &amp; Vera Costanzo
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCalendar(true)}
              title="Configurar calendario"
              className="flex items-center gap-1.5 text-gray-300 hover:text-white text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="hidden sm:inline">Calendario</span>
            </button>
            <button
              onClick={() => setShowSettings(true)}
              title="Configuración de enlaces"
              className="flex items-center gap-1.5 text-gray-300 hover:text-white text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="hidden sm:inline">Configuración</span>
            </button>
            <button
              onClick={() => {
                fetch("/api/admin/login", { method: "DELETE" }).catch(() => {});
                setAuthenticated(false);
                setTurnos([]);
                setSecret("");
              }}
              className="text-gray-300 hover:text-white text-sm transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <StatCard
            label="Turnos del día"
            value={stats.dia}
            accent="text-navy-900"
          />
          <StatCard
            label="Pendientes"
            value={stats.pendientes}
            accent="text-amber-600"
          />
          <StatCard
            label="Confirmados"
            value={stats.confirmados}
            accent="text-emerald-600"
          />
          <StatCard
            label="Próximos 7 días"
            value={stats.semana}
            accent="text-navy-900"
          />
        </div>

        {/* Date navigator */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDateKey(addDays(dateKey, -1))}
                className="w-9 h-9 grid place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                aria-label="Día anterior"
              >
                <Chevron dir="left" />
              </button>
              <div className="min-w-[15rem] text-center">
                <p className="font-serif font-bold text-navy-900 capitalize leading-tight">
                  {formatLongDate(dateKey)}
                </p>
                {dateKey === todayKey && (
                  <p className="text-emerald-600 text-xs font-semibold">Hoy</p>
                )}
              </div>
              <button
                onClick={() => setDateKey(addDays(dateKey, 1))}
                className="w-9 h-9 grid place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                aria-label="Día siguiente"
              >
                <Chevron dir="right" />
              </button>
              <button
                onClick={() => setDateKey(todayKey)}
                className="ml-1 px-3 h-9 rounded-lg border border-slate-200 text-sm font-medium text-navy-700 hover:bg-slate-50"
              >
                Hoy
              </button>
              <input
                type="date"
                value={dateKey}
                onChange={(e) => e.target.value && setDateKey(e.target.value)}
                className="h-9 px-2 rounded-lg border border-slate-200 text-sm text-slate-600"
              />
            </div>

            {/* Search */}
            <div className="relative lg:w-64">
              <svg
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar cliente, email…"
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
              />
            </div>
          </div>

          {/* Estado filter */}
          <div className="flex flex-wrap gap-2 mt-4">
            {ESTADO_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setEstadoFilter(f.value)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  estadoFilter === f.value
                    ? "bg-navy-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Agenda */}
        {visibles.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 grid place-items-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-slate-500 text-sm">
              No hay turnos para este día
              {estadoFilter !== "TODOS" || search ? " con esos filtros" : ""}.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibles.map((t) => (
              <TurnoRow
                key={t.id}
                turno={t}
                onView={() => setSelected(t)}
                onConfirm={() =>
                  mutate(
                    t.id,
                    { estado: "CONFIRMADO" },
                    `Turno de ${t.nombre.split(" ")[0]} confirmado`
                  )
                }
                onReschedule={() => setSelected(t)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Detail drawer */}
      {selected && (
        <TurnoDrawer
          turno={selected}
          settings={settings}
          onClose={() => setSelected(null)}
          onChangeEstado={(estado, msg) => mutate(selected.id, { estado }, msg)}
          onConfirmVirtual={(enlace) =>
            mutate(
              selected.id,
              { estado: "CONFIRMADO", enlace },
              "Turno confirmado · listo para enviar el enlace"
            )
          }
          onReschedule={(fecha, horaInicio, horaFin) =>
            mutate(
              selected.id,
              { fecha, horaInicio, horaFin, estado: "CONFIRMADO" },
              "Turno reprogramado y confirmado"
            )
          }
          onSaveNota={(notaAdmin) =>
            mutate(selected.id, { notaAdmin }, "Nota guardada")
          }
        />
      )}

      {showSettings && (
        <SettingsModal
          settings={settings}
          onClose={() => setShowSettings(false)}
          onSave={(s) => {
            setSettings(s);
            saveLinkSettings(s);
            setShowSettings(false);
            notify("Enlaces guardados");
          }}
        />
      )}

      {showCalendar && (
        <CalendarConfigPanel
          initialConfig={calendarConfig}
          onSave={handleSaveCalendar}
          onClose={() => setShowCalendar(false)}
          saving={savingCalendar}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-navy-900 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2">
          <svg
            className="w-4 h-4 text-emerald-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          {toast}
        </div>
      )}
    </div>
  );
}

/* ----------------------------- subcomponents ---------------------------- */

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <p className="text-slate-500 text-xs font-medium">{label}</p>
      <p className={`text-2xl sm:text-3xl font-serif font-bold mt-1 ${accent}`}>
        {value}
      </p>
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={dir === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
      />
    </svg>
  );
}

function TurnoRow({
  turno,
  onView,
  onConfirm,
  onReschedule,
}: {
  turno: Turno;
  onView: () => void;
  onConfirm: () => void;
  onReschedule: () => void;
}) {
  const meta = ESTADO_META[turno.estado];
  const closed = turno.estado === "CANCELADO" || turno.estado === "COMPLETADO";
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-sm transition-shadow ring-1 ring-transparent`}
    >
      {/* Time */}
      <div
        className={`flex sm:flex-col items-center sm:items-start gap-2 sm:gap-0 sm:w-24 sm:border-r sm:border-slate-100 sm:pr-4`}
      >
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
          <span className="font-serif font-bold text-navy-900">
            {turno.horaInicio}
          </span>
        </div>
        <span className="text-slate-400 text-xs">a {turno.horaFin} hs</span>
      </div>

      {/* Info */}
      <button onClick={onView} className="flex-1 text-left min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-navy-900 truncate">{turno.nombre}</p>
          {turno.modalidad && (
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full ${
                turno.modalidad === "Virtual"
                  ? "text-navy-700 bg-navy-50"
                  : "text-slate-500 bg-slate-100"
              }`}
            >
              {turno.modalidad}
              {turno.canal ? ` · ${turno.canal}` : ""}
            </span>
          )}
        </div>
        <p className="text-sm text-slate-600 truncate">
          {turno.servicio || "Consulta inicial"}
        </p>
        {turno.mensaje && (
          <p className="text-xs text-slate-400 truncate mt-0.5">
            “{turno.mensaje}”
          </p>
        )}
      </button>

      {/* Status + actions */}
      <div className="flex items-center gap-2 sm:flex-shrink-0">
        <StatusPill estado={turno.estado} />
        {!closed && turno.estado !== "CONFIRMADO" && (
          <button
            onClick={onConfirm}
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg"
          >
            Confirmar
          </button>
        )}
        {turno.modalidad === "Virtual" && turno.enlace && (
          <a
            href={turno.enlace}
            target="_blank"
            rel="noopener noreferrer"
            title="Ingresar a la videollamada"
            className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1.5 rounded-lg"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="hidden sm:inline">Ingresar</span>
          </a>
        )}
        <a
          href={whatsappLink(turno)}
          target="_blank"
          rel="noopener noreferrer"
          title="Escribir por WhatsApp"
          className="w-8 h-8 grid place-items-center rounded-lg text-emerald-600 hover:bg-emerald-50"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413z" />
          </svg>
        </a>
        <button
          onClick={onView}
          className="text-xs font-semibold text-navy-700 hover:text-navy-900 border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg"
        >
          Gestionar
        </button>
      </div>
    </div>
  );
}

function TurnoDrawer({
  turno,
  settings,
  onClose,
  onChangeEstado,
  onConfirmVirtual,
  onReschedule,
  onSaveNota,
}: {
  turno: Turno;
  settings: LinkSettings;
  onClose: () => void;
  onChangeEstado: (estado: EstadoTurno, msg: string) => void;
  onConfirmVirtual: (enlace: string | null) => void;
  onReschedule: (fecha: string, horaInicio: string, horaFin: string) => void;
  onSaveNota: (nota: string) => void;
}) {
  const [tab, setTab] = useState<"acciones" | "reprogramar">("acciones");
  const [nota, setNota] = useState(turno.notaAdmin ?? "");
  const [newDate, setNewDate] = useState(turnoDateKey(turno));
  const [newHora, setNewHora] = useState(turno.horaInicio);
  const [enlace, setEnlace] = useState(
    turno.enlace || defaultLinkFor(turno.canal, settings)
  );
  const todayKey = toDateKey(new Date());

  const esVirtual = turno.modalidad === "Virtual";
  const esWhatsapp = turno.canal === "WhatsApp (videollamada)";
  const necesitaLink = esVirtual && !esWhatsapp;
  const mensaje = mensajeConfirmacion(turno, enlace);

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div
        className="absolute inset-0 bg-navy-950/40"
        onClick={onClose}
        aria-hidden
      />
      <aside className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-[slideIn_.2s_ease-out]">
        <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>

        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between">
          <div>
            <StatusPill estado={turno.estado} />
            <h2 className="font-serif font-bold text-navy-900 text-xl mt-2">
              {turno.nombre}
            </h2>
            <p className="text-slate-500 text-sm">
              {formatShortDate(turnoDateKey(turno))} · {turno.horaInicio}–
              {turno.horaFin} hs
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 -mt-1"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {/* Contact */}
          <section>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Contactar al cliente
            </p>
            <div className="grid grid-cols-3 gap-2">
              <ContactBtn
                href={whatsappLink(turno)}
                label="WhatsApp"
                className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                icon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413z" />
                  </svg>
                }
              />
              <ContactBtn
                href={telLink(turno)}
                label="Llamar"
                className="text-navy-700 bg-navy-50 hover:bg-navy-100"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                }
              />
              <ContactBtn
                href={mailtoLink(turno)}
                label="Email"
                className="text-amber-700 bg-amber-50 hover:bg-amber-100"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                }
              />
            </div>
            <dl className="mt-3 text-sm text-slate-600 space-y-1">
              <div className="flex gap-2">
                <dt className="text-slate-400 w-16">Tel.</dt>
                <dd>{turno.telefono}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-slate-400 w-16">Email</dt>
                <dd className="truncate">{turno.email}</dd>
              </div>
              {turno.dni && (
                <div className="flex gap-2">
                  <dt className="text-slate-400 w-16">DNI</dt>
                  <dd>{turno.dni}</dd>
                </div>
              )}
            </dl>
          </section>

          {/* Caso */}
          <section>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Detalle del caso
            </p>
            <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-navy-900">
                  {turno.servicio || "Consulta inicial"}
                </p>
                {turno.modalidad && (
                  <span className="text-[11px] text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                    {turno.modalidad}
                    {turno.canal ? ` · ${turno.canal}` : ""}
                  </span>
                )}
              </div>
              {turno.mensaje ? (
                <p className="mt-1 text-slate-600">{turno.mensaje}</p>
              ) : (
                <p className="mt-1 text-slate-400 italic">Sin descripción.</p>
              )}
            </div>
          </section>

          {/* Reunión virtual */}
          {esVirtual && (
            <section className="rounded-lg border border-navy-100 bg-navy-50/60 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-navy-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </span>
                <p className="text-sm font-semibold text-navy-900">
                  Reunión virtual · {turno.canal}
                </p>
              </div>

              {esWhatsapp ? (
                <p className="text-sm text-slate-600">
                  No requiere enlace: la videollamada se realiza por WhatsApp al
                  número del cliente en el horario acordado. Confirmá el turno y
                  avisale por WhatsApp.
                </p>
              ) : (
                <>
                  {/* Acceso rápido a la llamada (cuando el enlace ya quedó guardado) */}
                  {turno.enlace && (
                    <a
                      href={turno.enlace}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mb-3 flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg text-sm"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Ingresar a la videollamada
                    </a>
                  )}

                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Enlace de la reunión
                  </label>
                  <input
                    value={enlace}
                    onChange={(e) => setEnlace(e.target.value)}
                    placeholder={
                      turno.canal === "Zoom"
                        ? "https://zoom.us/j/…"
                        : "https://meet.google.com/…"
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                  />
                  {!enlace && (
                    <p className="text-xs text-amber-700 mt-1.5">
                      No hay enlace por defecto cargado. Podés pegar uno acá o
                      guardarlo en{" "}
                      <span className="font-semibold">Configuración</span> para
                      reutilizarlo.
                    </p>
                  )}
                  <button
                    onClick={() => onConfirmVirtual(enlace || null)}
                    disabled={!enlace}
                    className="mt-3 w-full bg-navy-900 hover:bg-navy-800 disabled:opacity-40 text-white font-semibold py-2.5 rounded-lg text-sm"
                  >
                    {turno.enlace
                      ? "Guardar enlace"
                      : "Confirmar y guardar enlace"}
                  </button>
                </>
              )}

              {/* Enviar al cliente */}
              <p className="text-xs font-medium text-slate-500 mt-4 mb-2">
                Enviar {necesitaLink ? "enlace y confirmación" : "confirmación"}{" "}
                al cliente
              </p>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={waMessageLink(turno, mensaje)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413z" />
                  </svg>
                  WhatsApp
                </a>
                <a
                  href={mailMessageLink(turno, ASUNTO_CONFIRMACION, mensaje)}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </a>
              </div>
              {necesitaLink && !enlace && (
                <p className="text-[11px] text-slate-400 mt-2">
                  El mensaje se envía sin enlace hasta que cargues uno.
                </p>
              )}
            </section>
          )}

          {/* Tabs: acciones / reprogramar */}
          <section>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg mb-4">
              <TabBtn active={tab === "acciones"} onClick={() => setTab("acciones")}>
                Gestión
              </TabBtn>
              <TabBtn
                active={tab === "reprogramar"}
                onClick={() => setTab("reprogramar")}
              >
                Reprogramar
              </TabBtn>
            </div>

            {tab === "acciones" ? (
              <div className="grid grid-cols-2 gap-2">
                <ActionBtn
                  disabled={turno.estado === "CONFIRMADO"}
                  onClick={() => onChangeEstado("CONFIRMADO", "Turno confirmado")}
                  className="text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                >
                  Confirmar
                </ActionBtn>
                <ActionBtn
                  disabled={turno.estado === "CANCELADO"}
                  onClick={() => onChangeEstado("CANCELADO", "Turno rechazado")}
                  className="text-rose-700 border-rose-200 hover:bg-rose-50"
                >
                  Rechazar
                </ActionBtn>
                <ActionBtn
                  disabled={turno.estado === "PENDIENTE"}
                  onClick={() =>
                    onChangeEstado("PENDIENTE", "Marcado como pendiente")
                  }
                  className="text-amber-700 border-amber-200 hover:bg-amber-50"
                >
                  Marcar pendiente
                </ActionBtn>
                <ActionBtn
                  disabled={turno.estado === "COMPLETADO"}
                  onClick={() =>
                    onChangeEstado("COMPLETADO", "Turno completado")
                  }
                  className="text-slate-700 border-slate-200 hover:bg-slate-50"
                >
                  Completar
                </ActionBtn>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Nueva fecha
                    </label>
                    <input
                      type="date"
                      value={newDate}
                      min={todayKey}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Nuevo horario
                    </label>
                    <select
                      value={newHora}
                      onChange={(e) => setNewHora(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy-500"
                    >
                      {HORARIOS.map((h) => (
                        <option key={h} value={h}>
                          {h} hs
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onReschedule(newDate, newHora, addHour(newHora));
                    setTab("acciones");
                  }}
                  className="w-full bg-navy-900 hover:bg-navy-800 text-white font-semibold py-2.5 rounded-lg text-sm"
                >
                  Guardar nueva fecha y confirmar
                </button>
                <p className="text-xs text-slate-400">
                  El cliente recibirá la nueva fecha por email cuando se conecte
                  el envío de notificaciones.
                </p>
              </div>
            )}
          </section>

          {/* Nota interna */}
          <section>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Nota interna
            </p>
            <textarea
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              rows={2}
              placeholder="Notas para el equipo (no se envían al cliente)…"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
            <button
              onClick={() => onSaveNota(nota)}
              className="mt-2 text-sm font-medium text-navy-700 hover:text-navy-900"
            >
              Guardar nota
            </button>
          </section>
        </div>
      </aside>
    </div>
  );
}

function ContactBtn({
  href,
  label,
  icon,
  className,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  className: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex flex-col items-center gap-1 py-3 rounded-lg font-semibold text-xs transition-colors ${className}`}
    >
      {icon}
      {label}
    </a>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${
        active ? "bg-white text-navy-900 shadow-sm" : "text-slate-500"
      }`}
    >
      {children}
    </button>
  );
}

function ActionBtn({
  onClick,
  disabled,
  className,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`py-2.5 px-3 rounded-lg border text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-default ${className}`}
    >
      {children}
    </button>
  );
}

function SettingsModal({
  settings,
  onClose,
  onSave,
}: {
  settings: LinkSettings;
  onClose: () => void;
  onSave: (s: LinkSettings) => void;
}) {
  const [zoom, setZoom] = useState(settings.zoom);
  const [meet, setMeet] = useState(settings.meet);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy-950/40" onClick={onClose} aria-hidden />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-serif font-bold text-navy-900 text-lg">
            Enlaces de reunión
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-5 space-y-4">
          <p className="text-sm text-slate-500">
            Guardá tus salas fijas de Zoom y Google Meet. Se autocompletarán al
            confirmar turnos virtuales para que solo tengas que enviarlas.
          </p>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Sala de Zoom
            </label>
            <input
              value={zoom}
              onChange={(e) => setZoom(e.target.value)}
              placeholder="https://zoom.us/j/tu-sala-personal"
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Sala de Google Meet
            </label>
            <input
              value={meet}
              onChange={(e) => setMeet(e.target.value)}
              placeholder="https://meet.google.com/abc-defg-hij"
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>
          <p className="text-xs text-slate-400">
            Por ahora se guardan en este navegador. Cuando conectemos el backend
            quedarán disponibles desde cualquier dispositivo.
          </p>
        </div>

        <div className="px-5 py-4 border-t border-slate-100 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave({ zoom: zoom.trim(), meet: meet.trim() })}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-navy-900 hover:bg-navy-800 text-white"
          >
            Guardar enlaces
          </button>
        </div>
      </div>
    </div>
  );
}

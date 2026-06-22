export type ModalidadDia = "ambas" | "presencial" | "virtual" | "bloqueado";

export interface BlockedRange {
  id: string;
  from: string;  // YYYY-MM-DD
  to: string;    // YYYY-MM-DD
  motivo?: string;
}

export interface CalendarConfigData {
  weekdayDefaults: Partial<Record<string, ModalidadDia>>; // "0"=Dom … "6"=Sáb
  dayOverrides: Record<string, ModalidadDia>;              // "YYYY-MM-DD"
  blockedRanges: BlockedRange[];
}

export const DEFAULT_CALENDAR: CalendarConfigData = {
  weekdayDefaults: {
    "0": "bloqueado", // Domingo
    "1": "ambas",     // Lunes
    "2": "ambas",     // Martes
    "3": "ambas",     // Miércoles
    "4": "ambas",     // Jueves
    "5": "ambas",     // Viernes
    "6": "bloqueado", // Sábado
  },
  dayOverrides: {},
  blockedRanges: [],
};

/** Devuelve la modalidad efectiva para una fecha YYYY-MM-DD. */
export function getModalidadForDate(
  config: CalendarConfigData,
  dateKey: string
): ModalidadDia {
  // Los rangos bloqueados tienen prioridad máxima
  for (const range of config.blockedRanges) {
    if (dateKey >= range.from && dateKey <= range.to) return "bloqueado";
  }
  // Excepción puntual del día
  const override = config.dayOverrides[dateKey];
  if (override) return override;
  // Regla del día de la semana
  const [y, m, d] = dateKey.split("-").map(Number);
  const wd = String(new Date(y, m - 1, d).getDay());
  return config.weekdayDefaults[wd] ?? "ambas";
}

export const MODALIDAD_LABEL: Record<ModalidadDia, string> = {
  ambas:      "Presencial y Virtual",
  presencial: "Solo presencial",
  virtual:    "Solo virtual",
  bloqueado:  "Sin turnos",
};

// Indexados por getDay() (0 = domingo)
export const WEEKDAY_NAMES: Record<string, string> = {
  "0": "Domingo",
  "1": "Lunes",
  "2": "Martes",
  "3": "Miércoles",
  "4": "Jueves",
  "5": "Viernes",
  "6": "Sábado",
};

// Para cabecera del calendario (lunes primero)
export const CALENDAR_HEADER = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

// Abreviados indexados por getDay()
export const WEEKDAY_ABBR = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

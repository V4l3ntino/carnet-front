export type SeverityLevel = "Leve" | "Grave" | "Muy Grave"

export interface IncidenciaTable {
  id: string
  descripcion: string
  created_at: string
  creador: string
  alumno: string
  tipoIncidencia: string
  severidad?: SeverityLevel
  puntos?: number
}

export const SEVERITY_POINTS: Record<SeverityLevel, number> = {
  Leve: -1,
  Grave: -3,
  "Muy Grave": -10,
}

export const TIPOS_INCIDENCIA = [
  "Mal comportamiento",
  "Interrumpe la clase",
  "No hace los deberes",
  "Falta de respeto",
  "Uso inadecuado del móvil",
]

export const ALUMNOS = [
  { id: "1", nombre: "Juan Pérez García" },
  { id: "2", nombre: "Ana López Martínez" },
  { id: "3", nombre: "Carlos Rodríguez Sánchez" },
  { id: "4", nombre: "María González López" },
  { id: "5", nombre: "David Fernández Ruiz" },
]

export const severityColors: Record<SeverityLevel, string> = {
  "Leve": "bg-yellow-500",
  "Grave": "bg-orange-500",
  "Muy Grave": "bg-red-500",
}


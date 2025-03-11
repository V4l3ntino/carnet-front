"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, BookOpen, Calendar, Clock, Users } from "lucide-react"
import type { CuentaPuntos, TipoIncidencia } from "../../../interfaces"
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Define severity levels and colors
type SeverityLevel = "Leve" | "Grave" | "Muy Grave"

const severityColors: Record<SeverityLevel, string> = {
  Leve: "bg-yellow-100 text-yellow-800",
  Grave: "bg-orange-100 text-orange-800",
  "Muy Grave": "bg-red-100 text-red-800",
}

// These interfaces would typically be imported from your types file
// interface Incidencia {
//   id: string
//   fecha: string
//   tipo: string
//   descripcion: string
//   resuelta: boolean
// }

interface Incidencia {
  id: string
  descripcion: string
  created_at: string
  tipoIncidencia: TipoIncidencia
}

interface Group {
  id: string
  nombre: string
  curso: string
  tutor: string
}

interface AlumnoProfile {
  fullName: string
  edad: number
  repetidor: boolean
  incidencia?: Incidencia[]
  grupo?: Group
  cuentaPuntos: CuentaPuntos
}

// Example data for demonstration
const alumnoExample: AlumnoProfile = {
  fullName: "Antonio",
  edad: 16,
  repetidor: true,
  incidencia: [
    {
      id: "inc1",
      created_at: "2023-10-15",
      tipoIncidencia: {
        id: "1",
        created_at: "",
        descripcion: "Comportamiento",
        grado: {
          cantidadPuntos: 5,
          id: 1,
          nombre: "Grave",
        },
      },
      descripcion: "Interrumpió la clase varias veces",
    },
    {
      id: "inc2",
      created_at: "2023-10-15",
      tipoIncidencia: {
        id: "2",
        created_at: "",
        descripcion: "Comportamiento",
        grado: {
          cantidadPuntos: 5,
          id: 2,
          nombre: "Muy Grave",
        },
      },
      descripcion: "Interrumpió la clase varias veces",
    },
  ],
  grupo: {
    id: "g1",
    nombre: "4º ESO B",
    curso: "2023-2024",
    tutor: "María González",
  },
  cuentaPuntos: {
    id: "1",
    cantidad: 80,
    created_at: "2024-11-13",
  },
}

export default function AlumnoDetailView({ alumno = alumnoExample }: { alumno?: AlumnoProfile }) {
  const [activeTab, setActiveTab] = useState("general")

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">Perfil del Alumno</CardTitle>
            <CardDescription>
              Información detallada del estudiante <strong>{alumno.fullName}</strong>
            </CardDescription>
          </div>
          {alumno.repetidor && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
              Repetidor
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Información General</TabsTrigger>
            <TabsTrigger value="incidencias">
              Incidencias
              {alumno.incidencia && alumno.incidencia.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {alumno.incidencia.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="grupo">Grupo</TabsTrigger>
            <TabsTrigger value="puntos">Cantidad de Puntos</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Edad</p>
                  <p className="text-lg">{alumno.edad} años</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Estado</p>
                  <p className="text-lg">{alumno.repetidor ? "Repetidor" : "Curso normal"}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="incidencias" className="mt-4">
            {alumno.incidencia && alumno.incidencia.length > 0 ? (
              <div className="space-y-4">
                {alumno.incidencia.map((inc) => (
                  <Card key={inc.id}>
                    <CardHeader className="py-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <AlertCircle className={`h-5 w-5 `} />
                          <CardTitle className="text-base">{inc.tipoIncidencia.descripcion}</CardTitle>
                        </div>
                        <Badge className={severityColors[inc.tipoIncidencia?.grado?.nombre as SeverityLevel]}>
                          {inc.tipoIncidencia?.grado?.nombre} -{inc.tipoIncidencia.grado.cantidadPuntos}p
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(inc.created_at)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="py-2">
                      <p className="text-sm">{inc.descripcion}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No hay incidencias registradas</div>
            )}
          </TabsContent>

          <TabsContent value="grupo" className="mt-4">
            {alumno.grupo ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Grupo</p>
                    <p className="text-lg">{alumno.grupo.nombre}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Curso académico</p>
                    <p>{alumno.grupo.curso}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Tutor/a</p>
                    <p>{alumno.grupo.tutor}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No está asignado a ningún grupo</div>
            )}
          </TabsContent>
          <TabsContent value="puntos" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Puntos del Alumno</CardTitle>
                <CardDescription>Visualización de los puntos acumulados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Puntos Actuales</p>
                      <p className="text-2xl font-bold">{alumno.cuentaPuntos.cantidad}</p>
                    </div>
                    <Badge
                      className={
                        alumno.cuentaPuntos.cantidad > 50 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }
                    >
                      {alumno.cuentaPuntos.cantidad > 50 ? "Buen estado" : "En riesgo"}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Progreso de Puntos</span>
                      <span className="text-sm font-medium">{alumno.cuentaPuntos.cantidad}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-6 dark:bg-gray-700">
                      <div
                        className={`h-6 rounded-full ${
                          alumno.cuentaPuntos.cantidad > 75
                            ? "bg-green-600"
                            : alumno.cuentaPuntos.cantidad > 50
                              ? "bg-yellow-500"
                              : alumno.cuentaPuntos.cantidad > 25
                                ? "bg-orange-500"
                                : "bg-red-600"
                        }`}
                        style={{ width: `${alumno.cuentaPuntos.cantidad}%` }}
                      >
                        <span className="flex h-full items-center justify-center text-xs font-medium text-white">
                          {alumno.cuentaPuntos.cantidad}%
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {alumno.cuentaPuntos.cantidad > 75
                        ? "Excelente rendimiento"
                        : alumno.cuentaPuntos.cantidad > 50
                          ? "Buen rendimiento"
                          : alumno.cuentaPuntos.cantidad > 25
                            ? "Necesita mejorar"
                            : "Situación crítica"}
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      Puntos perdidos por incidencias:{" "}
                      {alumno.incidencia?.reduce(
                        (total, inc) => total + (inc.tipoIncidencia.grado.cantidadPuntos || 0),
                        0,
                      ) || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Editar</Button>
        <Button>Ver expediente completo</Button>
      </CardFooter>
    </Card>
  )
}


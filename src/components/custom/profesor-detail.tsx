"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Calendar, Clock, GraduationCap, Users } from "lucide-react"

// These interfaces would typically be imported from your types file
interface Group {
  id: string
  nombre: string
  curso: string
  alumnos?: number
}

interface ProfesorProfile {
  idea: string
  created_at: string
  materia: string
  grupo?: Group[]
}

// Example data for demonstration
const profesorExample: ProfesorProfile = {
  idea: "P2023-045",
  created_at: "2023-09-01T08:00:00Z",
  materia: "Matemáticas",
  grupo: [
    {
      id: "g1",
      nombre: "4º ESO B",
      curso: "2023-2024",
      alumnos: 28,
    },
    {
      id: "g2",
      nombre: "3º ESO A",
      curso: "2023-2024",
      alumnos: 25,
    },
    {
      id: "g3",
      nombre: "2º Bachillerato C",
      curso: "2023-2024",
      alumnos: 22,
    },
  ],
}

export default function ProfesorDetailView({ profesor = profesorExample }: { profesor?: ProfesorProfile }) {
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

  // Calculate time since profile creation
  const getTimeSinceCreation = (dateString: string) => {
    const createdDate = new Date(dateString)
    const now = new Date()
    const diffInMonths =
      (now.getFullYear() - createdDate.getFullYear()) * 12 + (now.getMonth() - createdDate.getMonth())

    if (diffInMonths < 1) return "Menos de un mes"
    if (diffInMonths === 1) return "1 mes"
    if (diffInMonths < 12) return `${diffInMonths} meses`

    const years = Math.floor(diffInMonths / 12)
    const remainingMonths = diffInMonths % 12

    if (remainingMonths === 0) {
      return years === 1 ? "1 año" : `${years} años`
    }

    return years === 1
      ? `1 año y ${remainingMonths} ${remainingMonths === 1 ? "mes" : "meses"}`
      : `${years} años y ${remainingMonths} ${remainingMonths === 1 ? "mes" : "meses"}`
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">Perfil del Profesor</CardTitle>
            <CardDescription>Información detallada del docente</CardDescription>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            {profesor.materia}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">Información General</TabsTrigger>
            <TabsTrigger value="grupos">
              Grupos
              {profesor.grupo && profesor.grupo.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {profesor.grupo.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Identificador</p>
                  <p className="text-lg">{profesor.idea}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Materia</p>
                  <p className="text-lg">{profesor.materia}</p>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Fecha de incorporación</p>
                <p>{formatDate(profesor.created_at)}</p>
                <p className="text-sm text-muted-foreground">
                  {getTimeSinceCreation(profesor.created_at)} en el centro
                </p>
              </div>
            </div>

            {profesor.grupo && (
              <div className="flex items-center gap-2 mt-4">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Carga docente</p>
                  <p>{profesor.grupo.length} grupos asignados</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="grupos" className="mt-4">
            {profesor.grupo && profesor.grupo.length > 0 ? (
              <div className="space-y-4">
                {profesor.grupo.map((grupo) => (
                  <Card key={grupo.id}>
                    <CardHeader className="py-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">{grupo.nombre}</CardTitle>
                        <Badge variant="outline">{grupo.alumnos} alumnos</Badge>
                      </div>
                      <CardDescription className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Curso {grupo.curso}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="py-2 flex justify-end">
                      <Button variant="ghost" size="sm">
                        Ver detalles
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No hay grupos asignados</div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Editar</Button>
        <Button>Ver horario</Button>
      </CardFooter>
    </Card>
  )
}


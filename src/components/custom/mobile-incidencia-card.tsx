import { Calendar, MoreHorizontal, User, Users, Tag, Edit, Trash } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { severityColors } from "../../../types/incidencias"
import type { IncidenciaTable } from "../../../types/incidencias"
import { useItemContext } from "@/context/itemsContext/ItemContext"

interface MobileIncidenciaCardProps {
  incidencia: IncidenciaTable
  onEdit: (incidencia: IncidenciaTable) => void
  onDelete: (id: string) => void
}

export function MobileIncidenciaCard({ incidencia, onEdit, onDelete }: MobileIncidenciaCardProps) {
  const { alumnos } = useItemContext()
  const alumno = alumnos.find((a) => a.idea === incidencia.alumno)
  const date = new Date(incidencia.created_at)

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-4 w-full">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {date.toLocaleDateString()}
            </div>
            <p className="text-sm">{incidencia.descripcion}</p>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              {incidencia.creador}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" />
              {alumno?.user?.profile?.fullName}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Tag className="h-4 w-4" />
              {incidencia.tipoIncidencia}
            </div>
            <div className="flex items-center justify-between w-full">
              <Badge className={severityColors[incidencia.severidad]}>{incidencia.severidad}</Badge>
              <span className="font-medium text-red-500">{incidencia.puntos} puntos</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(incidencia)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={() => onDelete(incidencia.id)}>
                <Trash className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}


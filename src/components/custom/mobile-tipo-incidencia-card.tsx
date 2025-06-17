import { Calendar, MoreHorizontal, User, Users, Tag, Edit, Trash } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { severityColors } from "../../../types/incidencias"
import type { IncidenciaTable, SeverityLevel } from "../../../types/incidencias"
import { useItemContext } from "@/context/itemsContext/ItemContext"
import { useAuthContext } from "@/context/AuthContext"
import { TipoIncidencia } from "../../../interfaces"

interface MobileTipoIncidenciaCardProps {
  tipoincidencia: TipoIncidencia
  onEdit: (incidencia: TipoIncidencia) => void
  onDelete: (id: string) => void
}

export function MobileTipoIncidenciaCard({ tipoincidencia, onEdit, onDelete }: MobileTipoIncidenciaCardProps) {
  const date = new Date(tipoincidencia.created_at!)
  const { userInfo } = useAuthContext()


  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-4 w-full">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {date.toLocaleDateString()}
            </div>
            <p className="text-sm">{tipoincidencia.descripcion}</p>
            <div className="flex items-center justify-between w-full">
              <Badge className={severityColors[tipoincidencia.grado.nombre as SeverityLevel]}>{tipoincidencia.grado.nombre}</Badge>
              <span className="font-medium text-red-500">{tipoincidencia.grado.cantidadPuntos} puntos</span>
            </div>
          </div>
          <DropdownMenu>
            {userInfo && userInfo?.permisos.find((item) => item.tipo == "w")?.incidencia ? (
              <>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(tipoincidencia)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  {userInfo && userInfo?.permisos.find((item) => item.tipo == "d")?.incidencia ? (
                    <DropdownMenuItem className="text-red-600" onClick={() => onDelete(tipoincidencia.id)}>
                      <Trash className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  ) : ("")}
                </DropdownMenuContent>
              </>
            ) : ("")}

          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}


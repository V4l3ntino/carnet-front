"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GradoDialog, type Grado } from "./grado-dialog"
import { useItemContext } from "@/context/itemsContext/ItemContext"
import { useEffect, useState } from "react"
import { useAuthContext } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { updateGrado } from "@/api/gradosCrud"
import { toast } from "sonner"
import { BreadcrumbWithCustomSeparator } from "@/components/custom/breadcumps"


export default function GradosManager() {
  const { grados } = useItemContext()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [data, setData] = useState<Grado[]>(grados.sort((a,b) => a.id - b.id))
  const [editingGrado, setEditingGrado] = useState<Grado | undefined>()

  const router = useRouter()

  useEffect(() => { setData(grados) }, [grados])
  const { userInfo } = useAuthContext()

  useEffect(() => {
    if (userInfo && !userInfo?.permisos.find((item) => item.tipo == "r")?.grado) {
      router.push("/")
    }
  }, [userInfo])

  

  const handleSubmit = async (object: Grado) => {
    try {
      await updateGrado(object, userInfo!.sub)
      const list = data.map((item) => item.id === object.id ? object : item)
      setData(list)
      setEditingGrado(undefined)  
      toast.success("¡Éxito!", {
        description: "Grado actualizado correctamente."
      })  
    } catch (error) {
      console.error("Error al actualizar:", error);

      toast.error("Error", { description: `No se pudo actualizar el grado: ${error}` });

      return;
    }
  }

  const handleEdit = (grado: Grado) => {
    setEditingGrado(grado)
    setDialogOpen(true)
  }

  const breadCumbs = [
    {
      name: "Home",
      url: "/"
    },
    {
      name: "Grados",
      url: "/grados"
    }
  ]


  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Grados</h1>
      </div>
      <BreadcrumbWithCustomSeparator items={breadCumbs} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.map((grado) => (
          <Card key={grado.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{grado.nombre}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-2xl font-bold text-primary">{grado.cantidadPuntos} puntos</div>
              <Button variant="outline" size="sm" onClick={() => handleEdit(grado)} className="w-full">
                Editar Puntos
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <GradoDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} grado={editingGrado} />
    </div>
  )
}

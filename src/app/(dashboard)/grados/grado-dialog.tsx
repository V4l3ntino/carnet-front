"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export interface Grado {
  id: number
  nombre: string
  cantidadPuntos: number
}

const formSchema = z.object({
  cantidadPuntos: z
    .number()
    .min(1, "La cantidad de puntos debe ser mayor a 0")
    .max(100, "La cantidad de puntos no puede ser mayor a 100"),
})

interface GradoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (grado: Grado) => void
  grado?: Grado
}

export function GradoDialog({ open, onOpenChange, onSubmit, grado }: GradoDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cantidadPuntos: grado?.cantidadPuntos || 1,
    },
  })

  useEffect(() => {
    if (grado) {
      form.reset({
        cantidadPuntos: grado.cantidadPuntos,
      })
    }
  }, [grado, form])

  function handleSubmit(values: z.infer<typeof formSchema>) {
    if (!grado) return

    const updatedGrado: Grado = {
      ...grado,
      cantidadPuntos: values.cantidadPuntos,
    }

    onSubmit(updatedGrado)
    onOpenChange(false)
  }

  if (!grado) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Editar Grado: {grado.nombre}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="cantidadPuntos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad de Puntos</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                      placeholder="Ingresa la cantidad de puntos"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

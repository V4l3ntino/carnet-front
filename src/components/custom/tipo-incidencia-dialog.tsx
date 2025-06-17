"use client"

import { useContext, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { ALUMNOS, TIPOS_INCIDENCIA } from "../../../types/incidencias"
import type { IncidenciaTable } from "../../../types/incidencias"
import { useItemContext } from "@/context/itemsContext/ItemContext"
import { TipoIncidencia } from "../../../interfaces"

const formSchema = z.object({
  descripcion: z.string().min(1, "La descripción es requerida"),
  // alumno: z.string().min(1, "El alumno es requerido"),
  // tipoIncidencia: z.string().min(1, "El tipo de incidencia es requerido"),
  severidad: z.enum(["Leve", "Grave", "Muy Grave"]),
})

interface TipoIncidenciaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Omit<TipoIncidencia, "id">) => void
  defaultValues?: Partial<TipoIncidencia>
}

export function TipoIncidenciaDialog({ open, onOpenChange, onSubmit, defaultValues }: TipoIncidenciaDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      descripcion: "",
      severidad: "Leve",
    },
  })
  const { alumnos, tipoIncidencias, grados } = useItemContext()

  const gradosDict = Object.fromEntries(
    grados.map((item) => [item.nombre, item])
  )

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues)
    }
  }, [defaultValues, form])

  function handleSubmit(values: z.infer<typeof formSchema>) {
    const data = {
      descripcion: values.descripcion,
      created_at: defaultValues?.created_at || new Date().toISOString(),
      grado: values.severidad === "Leve" ? gradosDict["Leve"] : values.severidad === "Grave" ? gradosDict["Grave"] : gradosDict["Muy Grave"],
    }
    onSubmit(data)
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{defaultValues ? "Editar Tipo de Incidencia" : "Nuevo Tipo de Incidencia"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="creador"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Creador</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly className="bg-muted" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            {/* <FormField
              control={form.control}
              name="alumno"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alumno</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                        >
                          {field.value
                            ? alumnos.find((alumno) => alumno.idea === field.value)?.user?.profile?.fullName
                            : "Seleccionar alumno"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[500px] bg-orange-400 p-0">
                      <Command>
                        <CommandInput placeholder="Buscar alumno..." />
                        <CommandList>
                          <CommandEmpty>No se encontraron alumnos.</CommandEmpty>
                          <CommandGroup>
                            {alumnos.map((alumno) => (
                              <CommandItem
                                value={alumno.user?.profile?.fullName}
                                key={alumno.idea}
                                onSelect={() => {
                                  form.setValue("alumno", alumno.idea)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    alumno.idea === field.value ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {alumno.user?.profile?.fullName}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tipoIncidencia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Incidencia</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tipoIncidencias.map((tipo) => (
                        <SelectItem key={tipo.descripcion} value={tipo.descripcion}>
                          {tipo.descripcion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="severidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Severidad</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la severidad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Leve">Leve ({`${gradosDict["Leve"].cantidadPuntos}`})</SelectItem>
                      <SelectItem value="Grave">Grave ({`${gradosDict["Grave"].cantidadPuntos}`})</SelectItem>
                      <SelectItem value="Muy Grave">Muy Grave ({`${gradosDict["Muy Grave"].cantidadPuntos}`})</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                className="w-full"
              >
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}


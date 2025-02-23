"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  ChevronDown,
  Edit,
  EyeOff,
  Plus,
  SortAsc,
  SortDesc,
  Trash,
  MoreHorizontal,
  Check,
  ChevronsUpDown,
  Calendar,
  User,
  Users,
  Tag,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Types
type SeverityLevel = "Leve" | "Grave" | "Muy Grave"

interface Incidencia {
  id: string
  descripcion: string
  created_at: string
  creador: string
  alumno: string
  tipoIncidencia: string
  severidad: SeverityLevel
  puntos: number
}

const SEVERITY_POINTS: Record<SeverityLevel, number> = {
  Leve: -1,
  Grave: -3,
  "Muy Grave": -10,
}

const TIPOS_INCIDENCIA = [
  "Mal comportamiento",
  "Interrumpe la clase",
  "No hace los deberes",
  "Falta de respeto",
  "Uso inadecuado del móvil",
  "Uso inadecuado del móvil",
  "Uso inadecuado del móvil",
]

const ALUMNOS = [
  { id: "1", nombre: "Juan Pérez García" },
  { id: "2", nombre: "Ana López Martínez" },
  { id: "3", nombre: "Carlos Rodríguez Sánchez" },
  { id: "4", nombre: "María González López" },
  { id: "5", nombre: "David Fernández Ruiz" },
]

const formSchema = z.object({
  descripcion: z.string().min(1, "La descripción es requerida"),
  creador: z.string().min(1, "El creador es requerido"),
  alumno: z.string().min(1, "El alumno es requerido"),
  tipoIncidencia: z.string().min(1, "El tipo de incidencia es requerido"),
  severidad: z.enum(["Leve", "Grave", "Muy Grave"]),
})

const severityColors: Record<SeverityLevel, string> = {
  Leve: "bg-yellow-500",
  Grave: "bg-orange-500",
  "Muy Grave": "bg-red-500",
}

function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: {
  column: any
  title: string
  className?: string
}) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <SortDesc className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <SortAsc className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <SortAsc className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Ascendente
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <SortDesc className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Descendente
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Ocultar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function MobileIncidenciaCard({
  incidencia,
  onEdit,
  onDelete,
}: {
  incidencia: Incidencia
  onEdit: (incidencia: Incidencia) => void
  onDelete: (id: string) => void
}) {
  const alumno = ALUMNOS.find((a) => a.id === incidencia.alumno)
  const date = new Date(incidencia.created_at)

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-4">
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
              {alumno?.nombre}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Tag className="h-4 w-4" />
              {incidencia.tipoIncidencia}
            </div>
            <div className="flex items-center justify-between">
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

function IncidenciaDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Omit<Incidencia, "id">) => void
  defaultValues?: Partial<Incidencia>
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      descripcion: "",
      creador: "",
      alumno: "",
      tipoIncidencia: "",
      severidad: "Leve",
    },
  })

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues)
    }
  }, [defaultValues, form])

  function handleSubmit(values: z.infer<typeof formSchema>) {
    const data = {
      ...values,
      created_at: defaultValues?.created_at || new Date().toISOString(),
      puntos: SEVERITY_POINTS[values.severidad],
    }
    onSubmit(data)
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{defaultValues ? "Editar Incidencia" : "Nueva Incidencia"}</DialogTitle>
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
            <FormField
              control={form.control}
              name="creador"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Creador</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
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
                            ? ALUMNOS.find((alumno) => alumno.id === field.value)?.nombre
                            : "Seleccionar alumno"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Buscar alumno..." />
                        <CommandList>
                          <CommandEmpty>No se encontraron alumnos.</CommandEmpty>
                          <CommandGroup>
                            {ALUMNOS.map((alumno) => (
                              <CommandItem
                                value={alumno.nombre}
                                key={alumno.id}
                                onSelect={() => {
                                  form.setValue("alumno", alumno.id)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    alumno.id === field.value ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {alumno.nombre}
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
                      {TIPOS_INCIDENCIA.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      <SelectItem value="Leve">Leve (-1p)</SelectItem>
                      <SelectItem value="Grave">Grave (-3p)</SelectItem>
                      <SelectItem value="Muy Grave">Muy Grave (-10p)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="w-full">
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default function IncidenciasPage() {
  const [data, setData] = useState<Incidencia[]>([
    {
      id: "1",
      descripcion: "No prestó atención durante la clase",
      created_at: "2024-02-23T10:00:00Z",
      creador: "Prof. García",
      alumno: "1",
      tipoIncidencia: "Mal comportamiento",
      severidad: "Leve",
      puntos: -1,
    },
    {
      id: "2",
      descripcion: "Interrumpió constantemente la explicación",
      created_at: "2024-02-23T11:30:00Z",
      creador: "Prof. Martínez",
      alumno: "2",
      tipoIncidencia: "Interrumpe la clase",
      severidad: "Grave",
      puntos: -3,
    },
  ])

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingIncidencia, setEditingIncidencia] = useState<Incidencia | null>(null)

  const columns: ColumnDef<Incidencia>[] = [
    {
      accessorKey: "created_at",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha" />,
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"))
        return <div>{date.toLocaleDateString()}</div>
      },
    },
    {
      accessorKey: "descripcion",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Descripción" />,
    },
    {
      accessorKey: "creador",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Creador" />,
    },
    {
      accessorKey: "alumno",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Alumno" />,
      cell: ({ row }) => {
        const alumnoId = row.getValue("alumno") as string
        const alumno = ALUMNOS.find((a) => a.id === alumnoId)
        return <div>{alumno?.nombre || "Unknown"}</div>
      },
    },
    {
      accessorKey: "tipoIncidencia",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tipo" />,
    },
    {
      accessorKey: "severidad",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Severidad" />,
      cell: ({ row }) => {
        const severidad = row.getValue("severidad") as SeverityLevel
        return <Badge className={severityColors[severidad]}>{severidad}</Badge>
      },
    },
    {
      accessorKey: "puntos",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Puntos" />,
      cell: ({ row }) => {
        const puntos = row.getValue("puntos") as number
        return <div className="font-medium text-red-500">{puntos}</div>
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const handleCreate = (newIncidencia: Omit<Incidencia, "id">) => {
    const incidencia = {
      ...newIncidencia,
      id: Math.random().toString(36).substr(2, 9),
    }
    setData((prev) => [incidencia, ...prev])
  }

  const handleUpdate = (updatedData: Omit<Incidencia, "id">) => {
    if (!editingIncidencia) return

    const updatedIncidencia = {
      ...updatedData,
      id: editingIncidencia.id,
    }

    setData((prev) => prev.map((item) => (item.id === editingIncidencia.id ? updatedIncidencia : item)))
    setEditingIncidencia(null)
  }

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id))
  }

  const handleEdit = (incidencia: Incidencia) => {
    setEditingIncidencia(incidencia)
    setIsDialogOpen(true)
  }

  return (
    <div className="h-full w-full space-y-4 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            placeholder="Filtrar por descripción..."
            value={(table.getColumn("descripcion")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("descripcion")?.setFilterValue(event.target.value)}
            className="w-full sm:max-w-xs"
          />
          <div className="flex flex-1 gap-2 sm:justify-end">
            <Button
              onClick={() => {
                setEditingIncidencia(null)
                setIsDialogOpen(true)
              }}
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nueva Incidencia
            </Button>

            <div className="hidden lg:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Columnas <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) => column.toggleVisibility(!!value)}
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      )
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Mobile View */}
          <div className="block lg:hidden space-y-4">
            {table.getRowModel().rows.map((row) => (
              <MobileIncidenciaCard
                key={row.original.id}
                incidencia={row.original}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Desktop View */}
          <div className="hidden lg:block rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                    <TableHead className="w-[50px]">Acciones</TableHead>
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(row.original.id)}>
                              <Trash className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                      No hay resultados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <IncidenciaDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) setEditingIncidencia(null)
        }}
        onSubmit={editingIncidencia ? handleUpdate : handleCreate}
        defaultValues={editingIncidencia || undefined}
      />
    </div>
  )
}


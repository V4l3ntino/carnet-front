"use client"

import { useEffect, useState } from "react"
import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table"
import { Plus, ChevronDown, MoreHorizontal, Edit, Trash } from "lucide-react"
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "@/components/custom/data-table-column-header"
import { MobileIncidenciaCard } from "@/components/custom/mobile-incidencia-card"
import { IncidenciaDialog } from "@/components/custom/incidencia-dialog"
import type { IncidenciaTable } from "../../../../types/incidencias"
import { DataTablePagination } from "@/components/custom/data-table-pagination"
import { MobilePagination } from "@/components/custom/mobile-pagination"
import { useItemContext } from "@/context/itemsContext/ItemContext"
import { useAuthContext } from "@/context/AuthContext"
import { v4 as uuidv4 } from "uuid"
import { deleteIncidencia, saveIncidencia } from "../../../api/incidenciasCrud"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { BreadcrumbWithCustomSeparator } from "@/components/custom/breadcumps"


export default function IncidenciasPage() {
  const { incidenciasTable, alumnos, tipoIncidencias, newIncidenciaTable, deleteIncidenciaId } = useItemContext()
  const { userInfo } = useAuthContext()
  const [data, setData] = useState<IncidenciaTable[]>(incidenciasTable)

  const router = useRouter()
  useEffect(() => { setData(incidenciasTable) }, [incidenciasTable])
  useEffect(() => { console.log(data) }, [data])

  useEffect(() => {
    if (userInfo && !userInfo?.permisos.find((item) => item.tipo == "r")?.incidencia) {
      router.push("/")
    }
  }, [userInfo])


  useEffect(() => {
    if (newIncidenciaTable) {
      const dataInc = [...data]
      let isNew = true
      data.forEach((item) => {
        if (item.id == newIncidenciaTable.id) {
          Object.assign(item, newIncidenciaTable)
          isNew = false
        }
      })

      if (isNew) {
        dataInc.push(newIncidenciaTable)
      }

      setData(dataInc)
    }
  }, [newIncidenciaTable])

  useEffect(() => {
    if (deleteIncidenciaId != "") {
      setData((prev) => prev.filter((item) => item.id !== deleteIncidenciaId))
    }
  }, [deleteIncidenciaId])



  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingIncidencia, setEditingIncidencia] = useState<IncidenciaTable | null>(null)

  const columns: ColumnDef<IncidenciaTable>[] = [
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
        const alumno = alumnos.find((a) => a.idea === alumnoId)
        return <div>{alumno?.user?.profile?.fullName || "Unknown"}</div>
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
        const severidad = row.getValue("severidad") as IncidenciaTable["severidad"]
        return <Badge
          className={
            severidad === "Leve"
              ? "bg-yellow-500 text-orange-900"
              : severidad === "Grave"
                ? "bg-orange-500 text-white"
                : severidad === "Muy Grave"
                  ? "bg-red-500 text-white"
                  : ""
          }
        >
          {severidad}
        </Badge>
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

  const handleCreate = async (newIncidencia: Omit<IncidenciaTable, "id" | "creador">) => {
    const incidencia = {
      ...newIncidencia,
      id: uuidv4(),
      creador: userInfo?.fullName ?? ""
    }
    try {
      await saveIncidencia(incidencia, userInfo!.sub, tipoIncidencias);
    } catch (error) {
      console.error("Error al crear incidencia:", error);

      toast.error("Error", { description: `No se pudo guardar la incidencia: ${error}` });

      return;
    }

    // setData((prev) => [incidencia, ...prev])

    toast.success("¡Éxito!", {
      description: "Incidencia registrada correctamente."
    })
  }

  const handleUpdate = async (updatedData: Omit<IncidenciaTable, "id">) => {
    if (!editingIncidencia) return

    const updatedIncidencia = {
      ...updatedData,
      id: editingIncidencia.id,
    }
    try {
      await saveIncidencia(updatedIncidencia, userInfo!.sub, tipoIncidencias);
    } catch (error) {
      console.error("Error al crear incidencia:", error);

      toast.error("Error", { description: `No se pudo guardar la incidencia: ${error}` });

      return;
    }

    setData((prev) => prev.map((item) => (item.id === editingIncidencia.id ? updatedIncidencia : item)))
    toast.success("¡Éxito!", {
      description: "Incidencia registrada correctamente."
    })
    setEditingIncidencia(null)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteIncidencia(id)
    } catch (error) {
      console.error("Error al borrar incidencia:", error);
      toast.error("Error", { description: `No se pudo eliminar la incidencia: ${error}` })
      return
    }

    setData((prev) => prev.filter((item) => item.id !== id))
    toast.success("Éxit", {
      description: "Incidenica borrada correctamente."
    })
  }

  const handleEdit = (incidencia: IncidenciaTable) => {
    setEditingIncidencia(incidencia)
    setIsDialogOpen(true)
  }

  const breadCumbs = [
    {
      name: "Home",
      url: "/"
    },
    {
      name: "Incidencias",
      url: "/incidencias"
    }
  ]


  return (
    <>
      <BreadcrumbWithCustomSeparator items={breadCumbs} />
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
              <div className="hidden md:block">
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
            <div className="block md:hidden space-y-4">
              {table.getRowModel().rows.map((row) => (
                <MobileIncidenciaCard
                  key={row.original.id}
                  incidencia={row.original}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
              <MobilePagination table={table} />
            </div>
            {/* Desktop View */}
            <div className="hidden md:block rounded-md border">
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
                        {
                          userInfo && userInfo?.permisos.find((item) => item.tipo == "w")?.incidencia ? (
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
                                  {
                                    userInfo && userInfo?.permisos.find((item) => item.tipo == "d")?.incidencia ? (
                                      <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(row.original.id)}>
                                        <Trash className="mr-2 h-4 w-4" />
                                        Eliminar
                                      </DropdownMenuItem>
                                    ) : (``)
                                  }
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          ) : (``)
                        }
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
              <div className="border-t p-4">
                <DataTablePagination table={table} />
              </div>
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
    </>
  )
}


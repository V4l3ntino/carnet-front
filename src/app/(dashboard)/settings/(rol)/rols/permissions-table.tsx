"use client"

import { useEffect, useState } from "react"
import { Check, Plus, X } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import type { Permission, Role } from "./types"
import { useItemContext } from "@/context/itemsContext/ItemContext"
import { savePerm, saveRol } from "@/api/permisosCrud"
import { v4 as uuidv4 } from "uuid"


const COLUMNS = [
  "admin_profile",
  "profile",
  "user",
  "alumno_profile",
  "profesor_profile",
  "incidencia",
  "grado",
  "tipo_incidencia",
  "permisos",
  "tablas",
  "cuenta_puntos",
  "retrasos",
  "grupo",
] as const

const PERMISSION_TYPES = {
  r: "Read",
  w: "Write",
  i: "Insert",
  d: "Delete",
}

export default function PermissionsTable({ initialRoles }: { initialRoles: Role[] }) {
  const { rolList, aplyRoles } = useItemContext()

  const [roles, setRoles] = useState<Role[]>(initialRoles)
  const [selectedRole, setSelectedRole] = useState<string>(roles[0]?.id || "")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newRoleName, setNewRoleName] = useState("")
  const [newRoleDescription, setNewRoleDescription] = useState("")
  const [selectedColumns, setSelectedColumns] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (rolList) {
      setRoles(rolList)
    }
  }, [rolList])

  useEffect(() => {
    const rolUpdate: Role | undefined = roles.find((item) => item.id == selectedRole)
    if (rolUpdate) {
      try {

        savePerm(rolUpdate)
      } catch (error) {
        console.log(error)
      }
    }
  }, [roles])

  const currentRole = roles.find((role) => role.id === selectedRole)

  const filteredColumns = COLUMNS.filter((column) => column.toLowerCase().includes(searchTerm.toLowerCase()))

  const toggleColumn = (column: string) => {
    setSelectedColumns((current) =>
      current.includes(column) ? current.filter((c) => c !== column) : [...current, column],
    )
  }

  const createNewRole = async() => {
    if (!newRoleName.trim()) return

    const newRoleId = uuidv4()

    // Create permissions for each type (r,w,i,d)
    const newPermissions: Permission[] = ["r", "w", "i", "d"].map((tipo, index) => ({
      id: uuidv4(),
      tipo: tipo as "r" | "w" | "i" | "d",
      admin_profile: selectedColumns.includes("admin_profile"),
      profile: selectedColumns.includes("profile"),
      user: selectedColumns.includes("user"),
      alumno_profile: selectedColumns.includes("alumno_profile"),
      profesor_profile: selectedColumns.includes("profesor_profile"),
      incidencia: selectedColumns.includes("incidencia"),
      grado: selectedColumns.includes("grado"),
      tipo_incidencia: selectedColumns.includes("tipo_incidencia"),
      permisos: selectedColumns.includes("permisos"),
      tablas: selectedColumns.includes("tablas"),
      cuenta_puntos: selectedColumns.includes("cuenta_puntos"),
      retrasos: selectedColumns.includes("retrasos"),
      grupo: selectedColumns.includes("grupo"),
      permiso_id: newRoleId
    }))

    const newRole: Role = {
      id: newRoleId,
      nombre: newRoleName,
      descripcion: newRoleDescription,
      tabla: newPermissions,
    }
    
    await saveRol(newRole)

    setRoles((current) => [...current, newRole])
    setSelectedRole(newRoleId)
    setIsDialogOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setNewRoleName("")
    setNewRoleDescription("")
    setSelectedColumns([])
    setSearchTerm("")
  }

  const togglePermission = (permissionId: string, column: keyof Permission) => {
    setRoles((currentRoles) =>
      currentRoles.map((role) => ({
        ...role,
        tabla: role.tabla.map((permission) =>
          permission.id === permissionId
            ? {
              ...permission,
              [column]: !permission[column],
            }
            : permission,
        ),
      })),
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="border-b p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <CardTitle className="text-xl sm:text-2xl font-bold">Permissions Management</CardTitle>
            {currentRole && <p className="text-sm text-muted-foreground">{currentRole.descripcion}</p>}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="outline" className="flex-shrink-0" onClick={() => (aplyRoles())}>
              Apply
            </Button>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-[180px] sm:w-[200px]">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="flex-shrink-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Role</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Role Name</Label>
                    <Input
                      id="name"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      placeholder="Enter role name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newRoleDescription}
                      onChange={(e) => setNewRoleDescription(e.target.value)}
                      placeholder="Enter role description"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Select Columns with Permissions</Label>
                    <Command className="border rounded-md">
                      <CommandInput placeholder="Search columns..." value={searchTerm} onValueChange={setSearchTerm} />
                      <CommandList>
                        <CommandEmpty>No columns found.</CommandEmpty>
                        <CommandGroup className="max-h-[200px] overflow-auto">
                          {filteredColumns.map((column) => (
                            <CommandItem
                              key={column}
                              onSelect={() => toggleColumn(column)}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <div
                                className={`flex h-4 w-4 items-center justify-center rounded border ${selectedColumns.includes(column) ? "bg-primary border-primary" : "border-input"
                                  }`}
                              >
                                {selectedColumns.includes(column) && (
                                  <Check className="h-3 w-3 text-primary-foreground" />
                                )}
                              </div>
                              <span>{column.replace(/_/g, " ")}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </div>
                  <Button onClick={createNewRole} disabled={!newRoleName.trim()}>
                    Create Role
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 sm:p-1">
        {currentRole && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[100px] font-bold">Type</TableHead>
                  {COLUMNS.map((column) => (
                    <TableHead key={column} className="text-center font-bold whitespace-nowrap">
                      {column.replace(/_/g, " ")}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRole.tabla.map((permission) => (
                  <TableRow key={permission.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium bg-muted/20">{PERMISSION_TYPES[permission.tipo]}</TableCell>
                    {COLUMNS.map((column) => (
                      <TableCell key={column} className="text-center p-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-12 w-full rounded-none transition-colors ${permission[column] ? "hover:bg-green-50" : "hover:bg-red-50"
                            }`}
                          onClick={() => togglePermission(permission.id, column)}
                        >
                          {permission[column] ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <X className="h-4 w-4 text-red-600" />
                          )}
                        </Button>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


"use client"

import { useEffect, useState } from "react"
import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table"
import { ChevronDown, MoreHorizontal, Edit, Trash, ArrowUpDown, Eye } from "lucide-react"
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MobileUserCard } from "./mobile-user-card"
import { useRouter } from "next/navigation"
import { EditRoleDialog } from "./edit-role-dialog"
import { useItemContext } from "@/context/itemsContext/ItemContext"

interface UserPermission {
  id: string
  nombre: string
}

interface UserProfile {
  fullName: string
}

interface User {
  id: string
  username: string
  email: string
  profile: UserProfile
  permiso: UserPermission
}

interface UserGQL {
  id: string
  username: string
  email: string
  profile: UserProfile
  permiso: UserPermission
}

// Sample data
const sampleUsers: User[] = [
  {
    id: "1",
    username: "john_doe",
    email: "john@example.com",
    profile: {
      fullName: "John Doe",
    },
    permiso: {
      id: "1",
      nombre: "Admin",
    },
  },
  {
    id: "2",
    username: "jane_smith",
    email: "jane@example.com",
    profile: {
      fullName: "Jane Smith",
    },
    permiso: {
      id: "2",
      nombre: "User",
    },
  },
  {
    id: "3",
    username: "bob_wilson",
    email: "bob@example.com",
    profile: {
      fullName: "Bob Wilson",
    },
    permiso: {
      id: "2",
      nombre: "User",
    },
  },
  {
    id: "4",
    username: "alice_johnson",
    email: "alice@example.com",
    profile: {
      fullName: "Alice Johnson",
    },
    permiso: {
      id: "3",
      nombre: "Editor",
    },
  },
]

export default function UsersTable() {
  const {users} = useItemContext()
  const [data, setData] = useState<User[]>(users)

  useEffect(() => {
    if(users.length > 0){
      setData(users)
      console.log(users)
    }
  },[users])

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const router = useRouter()

  const [editingUser, setEditingUser] = useState<UserGQL | null>(null)
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false)

  const handleEditRole = (user: UserGQL) => {
    setEditingUser(user)
    setIsEditRoleOpen(true)
  }

  const handleRoleChange = async (newRole: string, rolName: string) => {
    if (!editingUser) return

    try {
      // Here you would typically make an API call to update the user's role
      console.log(`Updating user ${editingUser.id} role to ${newRole}`)

      // Update the local state
      setData((prev) =>
        prev.map((user) =>
          user.id === editingUser.id
            ? {
                ...user,
                permiso: {
                  ...user.permiso,
                  nombre: rolName,
                },
              }
            : user,
        ),
      )

      try {
        const data = {
          rolId: newRole
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${editingUser.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
  
        const dataJson = await response.json()
        if (!response.ok) {
          console.log(dataJson.message)
          return
        }
        console.log("petición de update",dataJson)
        // toast.info("Se han aplicado nuevos cambios en los permisos")
  
      } catch (error) {
        console.error("Error al decodificar el token ", error)
      }
  
      
      // Close the dialog
      setEditingUser(null)
      setIsEditRoleOpen(false)
    } catch (error) {
      console.error("Failed to update role:", error)
    }
  }

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 font-medium"
          >
            ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "username",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 font-medium"
          >
            Username
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 font-medium"
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "profile.fullName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 font-medium"
          >
            Full Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => row.original.profile.fullName,
    },
    {
      accessorKey: "permiso.nombre",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 font-medium"
          >
            Permission
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => row.original.permiso.nombre,
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

  const handleEdit = (user: User) => {
    console.log("Edit user:", user)
  }

  const handleDelete = (id: string) => {
    console.log("Delete user:", id)
  }

  return (
    <div className="h-full w-full space-y-4 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Input
            placeholder="Filter by username..."
            value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("username")?.setFilterValue(event.target.value)}
            className="max-w-xs"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
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

        {/* Mobile View */}
        <div className="block md:hidden space-y-4">
          {table.getRowModel().rows.map((row) => (
            <MobileUserCard
              key={row.original.id}
              user={row.original}
              onEditRole={handleEditRole}
              onDelete={handleDelete}
            />
          ))}
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
                  <TableHead className="w-[80px]">Actions</TableHead>
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
                          <DropdownMenuItem onClick={() => handleEditRole(row.original)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Role
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/users/${row.original.id}`)
                            }
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(row.original.id)} className="text-red-600">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="border-t p-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
                selected.
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Rows per page</span>
                  <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                      table.setPageSize(Number(e.target.value))
                    }}
                    className="h-8 w-[70px] rounded-md border border-input bg-background px-2 py-1 text-sm"
                  >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <option key={pageSize} value={pageSize}>
                        {pageSize}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    {"<"}
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    {">"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <EditRoleDialog
        open={isEditRoleOpen}
        onOpenChange={setIsEditRoleOpen}
        currentRole={editingUser?.permiso.nombre || ""}
        onSubmit={handleRoleChange}
      />
    </div>
  )
}


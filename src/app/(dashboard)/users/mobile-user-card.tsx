"use client"

import { MoreHorizontal, Edit, Trash, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"

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

interface MobileUserCardProps {
  user: User
  onEditRole: (user: User) => void
  onDelete: (id: string) => void
}

export function MobileUserCard({ user, onEditRole }: MobileUserCardProps) {
  const router = useRouter()
  const { userInfo } = useAuthContext()


  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">ID: {user.id}</p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                {userInfo && userInfo?.permisos?.find((item) => item.tipo == "w")?.user ? (
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditRole(user)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Role
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/users/${user.id}`)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Detail
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem onClick={() => onDelete(user.id)} className="text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem> */}
                  </DropdownMenuContent>
                ) : ("")}

              </DropdownMenu>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Username</p>
              <p>{user.username}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{user.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Full Name</p>
              <p>{user.profile.fullName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Permission</p>
              <Badge variant="outline">{user.permiso.nombre}</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


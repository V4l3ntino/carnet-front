"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, GraduationCap, User, Users, BookOpen, AlertCircle, Loader2 } from "lucide-react"

interface Group {
  id: string
  nombre: string
}

interface Incidencia {
  id: string
  descripcion: string
  created_at: string
}

interface AlumnoProfile {
  edad: number
  repetidor: boolean
  incidencia?: Incidencia[]
  grupo?: Group
}

interface ProfesorProfile {
  idea: string
  created_at: string
  materia: string
  grupo?: Group
}

interface UserPermission {
  id: string
  nombre: string
  descripcion: string
}

interface UserProfile {
  fullName: string
}

interface UserDetail {
  id: string
  username: string
  email: string
  profile: UserProfile
  profesorProfile?: ProfesorProfile
  alumnoProfile?: AlumnoProfile
  permiso: UserPermission
}

interface UserDetailPageProps {
  user?: UserDetail
  isLoading?: boolean
  error?: string
}

function BasicInfoCard({ user }: { user: UserDetail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <p className="text-sm font-medium text-muted-foreground">Username</p>
          <p>{user.username}</p>
        </div>
        <div className="grid gap-2">
          <p className="text-sm font-medium text-muted-foreground">Email</p>
          <p>{user.email}</p>
        </div>
        <div className="grid gap-2">
          <p className="text-sm font-medium text-muted-foreground">Full Name</p>
          <p>{user.profile.fullName}</p>
        </div>
        <div className="grid gap-2">
          <p className="text-sm font-medium text-muted-foreground">Role</p>
          <Badge variant="outline" className="w-fit">
            {user.permiso.nombre}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

function ProfesorDetail({ user }: { user: UserDetail }) {
  if (!user.profesorProfile) return null

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Professor Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <p className="text-sm font-medium text-muted-foreground">IDEA</p>
            <p>{user.profesorProfile.idea}</p>
          </div>
          <div className="grid gap-2">
            <p className="text-sm font-medium text-muted-foreground">Subject</p>
            <p>{user.profesorProfile.materia}</p>
          </div>
          <div className="grid gap-2">
            <p className="text-sm font-medium text-muted-foreground">Start Date</p>
            <p>{new Date(user.profesorProfile.created_at).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>
      {user.profesorProfile.grupo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Group Assignment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="text-base">
              {user.profesorProfile.grupo.nombre}
            </Badge>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function AlumnoDetail({ user }: { user: UserDetail }) {
  if (!user.alumnoProfile) return null

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Student Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <p className="text-sm font-medium text-muted-foreground">Age</p>
            <p>{user.alumnoProfile.edad}</p>
          </div>
          <div className="grid gap-2">
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <Badge variant={user.alumnoProfile.repetidor ? "destructive" : "default"}>
              {user.alumnoProfile.repetidor ? "Repeating" : "Regular"}
            </Badge>
          </div>
          {user.alumnoProfile.grupo && (
            <div className="grid gap-2">
              <p className="text-sm font-medium text-muted-foreground">Group</p>
              <Badge variant="secondary" className="text-base">
                {user.alumnoProfile.grupo.nombre}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
      {user.alumnoProfile.incidencia && user.alumnoProfile.incidencia.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Incidents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.alumnoProfile.incidencia.map((incident) => (
              <div key={incident.id} className="space-y-2 rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{new Date(incident.created_at).toLocaleDateString()}</p>
                </div>
                <p>{incident.descripcion}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function UserDetailPage({ user, isLoading, error }: UserDetailPageProps) {
  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Loading user details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>User not found or data is unavailable.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{user.profile.fullName}</h1>
          <Badge className="text-base">{user.permiso.nombre}</Badge>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <BasicInfoCard user={user} />
          {user.permiso.nombre === "Profesor" && <ProfesorDetail user={user} />}
          {user.permiso.nombre === "Alumno" && <AlumnoDetail user={user} />}
          {user.permiso.nombre === "Admin" && (
            <Card>
              <CardHeader>
                <CardTitle>Administrator Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{user.permiso.descripcion}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}


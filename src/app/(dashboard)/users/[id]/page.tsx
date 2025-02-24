"use client"
import { fetchOneUserGQL } from "@/api/userCrud";

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
export default async function Page() {
    const user: UserDetail = await fetchOneUserGQL()
    console.log(user)
    return (
        <div></div>
    );
}
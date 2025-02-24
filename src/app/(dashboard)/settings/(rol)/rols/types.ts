export interface Permission {
    id: string
    tipo: "i" | "w" | "r" | "d"
    admin_profile: boolean
    profile: boolean
    user: boolean
    alumno_profile: boolean
    profesor_profile: boolean
    incidencia: boolean
    grado: boolean
    tipo_incidencia: boolean
    permisos: boolean
    tablas: boolean
    cuenta_puntos: boolean
    retrasos: boolean
    grupo: boolean
    permiso_id?: string
  }
  
  export interface Role {
    id: string
    nombre: string
    descripcion: string
    tabla: Permission[]
  }
  
  
import PermissionsTable from "./permissions-table"
import { Role } from "./types"

// Datos de ejemplo incluyendo el rol de Administrador
const roles: Role[] = [
  {
    id: "0",
    nombre: "Sin rol",
    descripcion: "Rol por defecto cuando un usuario se registra",
    tabla: [
      {
        id: "0",
        tipo: "i",
        admin_profile: false,
        profile: false,
        user: false,
        alumno_profile: false,
        profesor_profile: false,
        incidencia: false,
        grado: false,
        tipo_incidencia: false,
        permisos: false,
        tablas: false,
        cuenta_puntos: false,
        retrasos: false,
        grupo: false,
      },
      {
        id: "1",
        tipo: "w",
        admin_profile: false,
        profile: false,
        user: false,
        alumno_profile: false,
        profesor_profile: false,
        incidencia: false,
        grado: false,
        tipo_incidencia: false,
        permisos: false,
        tablas: false,
        cuenta_puntos: false,
        retrasos: false,
        grupo: false,
      },
      {
        id: "2",
        tipo: "r",
        admin_profile: false,
        profile: false,
        user: false,
        alumno_profile: false,
        profesor_profile: false,
        incidencia: false,
        grado: false,
        tipo_incidencia: false,
        permisos: false,
        tablas: false,
        cuenta_puntos: false,
        retrasos: false,
        grupo: false,
      },
      {
        id: "3",
        tipo: "d",
        admin_profile: false,
        profile: false,
        user: false,
        alumno_profile: false,
        profesor_profile: false,
        incidencia: false,
        grado: false,
        tipo_incidencia: false,
        permisos: false,
        tablas: false,
        cuenta_puntos: false,
        retrasos: false,
        grupo: false,
      },
    ],
  },
  {
    id: "1",
    nombre: "Administrador",
    descripcion: "Administrador del sistema",
    tabla: [
      {
        id: "4",
        tipo: "r",
        admin_profile: true,
        profile: true,
        user: true,
        alumno_profile: true,
        profesor_profile: true,
        incidencia: true,
        grado: true,
        tipo_incidencia: true,
        permisos: true,
        tablas: true,
        cuenta_puntos: true,
        retrasos: true,
        grupo: true,
      },
      {
        id: "5",
        tipo: "w",
        admin_profile: true,
        profile: true,
        user: true,
        alumno_profile: true,
        profesor_profile: true,
        incidencia: true,
        grado: true,
        tipo_incidencia: true,
        permisos: true,
        tablas: true,
        cuenta_puntos: true,
        retrasos: true,
        grupo: true,
      },
      {
        id: "6",
        tipo: "i",
        admin_profile: true,
        profile: true,
        user: true,
        alumno_profile: true,
        profesor_profile: true,
        incidencia: true,
        grado: true,
        tipo_incidencia: true,
        permisos: true,
        tablas: true,
        cuenta_puntos: true,
        retrasos: true,
        grupo: true,
      },
      {
        id: "7",
        tipo: "d",
        admin_profile: true,
        profile: true,
        user: true,
        alumno_profile: true,
        profesor_profile: true,
        incidencia: true,
        grado: true,
        tipo_incidencia: true,
        permisos: true,
        tablas: true,
        cuenta_puntos: true,
        retrasos: true,
        grupo: true,
      },
    ],
  },
]

export default function Page() {
  return (
    <div className="container mx-auto py-10">
      <PermissionsTable initialRoles={roles} />
    </div>
  )
}


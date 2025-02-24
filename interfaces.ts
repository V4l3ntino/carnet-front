export interface Tabla {
  id: number;
  tipo: string;
  admin_profile: boolean;
  profile: boolean;
  user: boolean;
  alumno_profile: boolean;
  profesor_profile: boolean;
  incidencia: boolean;
  grado: boolean;
  tipo_incidencia: boolean;
  permisos: boolean;
  tablas: boolean;
  cuenta_puntos: boolean;
  retrasos: boolean;
  grupo: boolean;
}

export interface Permiso {
  id: string;
  tabla: Tabla[];
}

export interface Profile {
  ida: string;
  fullName: string;
  avatar: string;
  email: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  created_at: string;
  profile: Profile;
}


export interface CuentaPuntos {
  id: string;
  cantidad: number;
  created_at: string;
}

export interface Grado {
  id: number;
  nombre: string;
  cantidadPuntos: number;
}

export interface Grupo {
  id: number;
  nombre: string;
  created_at: string;
}

export interface Incidencia {
  id: number;
  descripcion: string;
  created_at: string;
  user: User;
  alumnoProfile: Alumno;
  tipoIncidencia: TipoIncidencia;
}

export interface IncidenciaEmmit {
  user_id: string,
  id: string,
  alumno_id: string,
  descripcion: string,
  tipoIncidencia: string,
}


// export interface IncidenciaTable {
//   id: string;
//   descripcion: string;
//   created_at: string;
//   creador: string;
//   alumno: string;
//   tipoIncidencia: string;
//   severidad: string;
//   puntos: number;
// }

export interface Alumno {
  idea: string;
  created_at: string;
  edad: number;
  repetidor: boolean;
  user: User;
  permiso: Permiso;
  grupo: Grupo;
  incidencia: Incidencia[];
  cuentaPuntos: CuentaPuntos;
}



export interface TipoIncidencia {
  id: string;
  descripcion: string;
  created_at: string;
  grado: Grado;
}

export interface TipoIncidenciaTable {
  id: string;
  descripcion: string;
  created_at: string;
  grado: string;
}




export interface Profesor {
  idea: string;
  created_at: string;
  materia: string;
  user: User;
  permiso: Permiso;
  grupo: Grupo;
}


export interface decodeJWT {
  sub: string,
  username: string,
  fullName: string,
  email: string,
  avatar: string,
  rolname: string,
  permisos: permisoTablas[]
}

interface permisoTablas {
  id: number;
  tipo: string;
  admin_profile: boolean;
  profile: boolean;
  user: boolean;
  alumno_profile: boolean;
  profesor_profile: boolean;
  incidencia: boolean;
  grado: boolean;
  tipo_incidencia: boolean;
  permisos: boolean;
  tablas: boolean;
  cuenta_puntos: boolean;
  retrasos: boolean;
  grupo: boolean;
}
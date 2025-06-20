'use client'
import { createContext, useContext } from 'react';
import { Alumno, Grado, Incidencia, TipoIncidencia, UserGQL } from '../../../interfaces';
import { IncidenciaTable } from '../../../types/incidencias';
import { Role } from '@/app/(dashboard)/settings/(rol)/rols/types';


// Define el tipo del contexto
interface ContextType {
  incidencias: Incidencia[]
  tipoIncidencias: TipoIncidencia[]
  grados: Grado[]
  alumnos: Alumno[]
  rolList: Role[]
  aplyRoles: () => void

  incidenciasTable: IncidenciaTable[]
  newIncidenciaTable: IncidenciaTable | undefined
  newTipoIncidencia: TipoIncidencia | undefined
  deleteIncidenciaId: string
  deleteTipoIncidenciaId: string

  users: UserGQL[]
}

export const ItemContext = createContext<ContextType | undefined>(undefined);

export const useItemContext = () => {
    const context = useContext(ItemContext);
    if (!context) {
      throw new Error("ItemContext debe usarse dentro de ItemProvider");
    }
    return context;
  };
  
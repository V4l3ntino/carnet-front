"use client"
import React, { createContext, useContext } from 'react';
import { Alumno, decodeJWT, Grado, Incidencia, IncidenciaTable, TipoIncidencia } from '../../../interfaces';

// Define el tipo del contexto
interface ContextType {
  incidencias: Incidencia[]
  tipoIncidencias: TipoIncidencia[]
  grados: Grado[]
  alumnos: Alumno[]

  incidenciasTable: IncidenciaTable[]
}

export const ItemContext = createContext<ContextType | undefined>(undefined);

export const useItemContext = () => {
    const context = useContext(ItemContext);
    if (!context) {
      throw new Error("useAuthContext debe usarse dentro de AuthProvider");
    }
    return context;
  };
  
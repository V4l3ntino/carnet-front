"use client"
import React, { createContext, useContext } from 'react';
import { decodeJWT } from '../../interfaces';

// Define el tipo del contexto
interface ContextType {
  accessToken: string,
  setAccessToken: (token: string) => void,
  userInfo: decodeJWT | null
}

export const AuthContext = createContext<ContextType | undefined>(undefined);

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuthContext debe usarse dentro de AuthProvider");
    }
    return context;
  };
  
'use client'

import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";
import { decodeJWT } from "../../interfaces";




export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string>("");
    const [userInfo, setUserinfo] = useState<decodeJWT | null>(null);
    const router = useRouter()

    // const newIncidencia = (data: IncidenciaEmmit) => {
    //     if (socket) {
    //       socket.emit("newIncidencia", data); // Usa la instancia de `socket` controlada por el estado
    //     } else {
    //       console.error("Socket no está conectado. No se puede emitir la incidencia.");
    //     }
    //   };

    // const deleteIncidencia = (id: string) => {
    //   if(socket){
    //     socket.emit("deleteIncidencia", id);
    //   } else {
    //     console.error("Socket no está conectado. No se puede emitir la incidencia.");
    //   }
    // }
  
    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (token) {
            setAccessToken(token)
            try {
                const decoded: decodeJWT = jwtDecode(token);
                setUserinfo(decoded)
            } catch (error) {
                console.error("Error al decodificar el token ", error)
                Cookies.remove('accessToken')
            }
            return
        }
        router.push("/login")
    }, []);
    return (
        <AuthContext.Provider value={{
          accessToken,
          userInfo
        }}>
            { children }
        </AuthContext.Provider>
    )
}
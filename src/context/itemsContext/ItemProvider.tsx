'use client'

import { useEffect, useState } from "react";
import { ItemContext } from "./ItemContext";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { Alumno, decodeJWT, Grado, Incidencia, IncidenciaTable, TipoIncidencia } from "../../../interfaces";
import { getAllIncidencia } from "../../../api/incidenciasCrud";
import { getAllTipoIncidencias } from "../../../api/tipoIncidenciasCrud";
import { getAllGrados } from "../../../api/gradosCrud";
import { getAllAlumnos } from "../../../api/alumnosCrud";




export const ItemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [incidencias, setIncidencias] = useState<Incidencia[]>([])
    const [incidenciasTable, setIncidenciasTable] = useState<IncidenciaTable[]>([])
    const [tipoIncidencias, setTipoIncidencias] = useState<TipoIncidencia[]>([])
    const [grados, setGrados] = useState<Grado[]>([])
    const [alumnos, setAlumnos] = useState<Alumno[]>([])
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

    async function fetchIncidencias() {
        const incidenciasReq = await getAllIncidencia()
        if (incidenciasReq){
            setIncidencias(incidenciasReq)
        }
    }
    async function fetchTipoIncidencias() {
        const incidenciasReq = await getAllTipoIncidencias()
        if (incidenciasReq){
            setTipoIncidencias(incidenciasReq)
        }
    }
    async function fetchGrados() {
        const gradosReq = await getAllGrados()
        if (gradosReq){
            setGrados(gradosReq)
        }
    }
    async function fetchAlumnos() {
        const alumnosReq = await getAllAlumnos()
        if (alumnosReq){
            setAlumnos(alumnosReq)
        }
    }
    


    useEffect(() => {
        fetchIncidencias()
        fetchTipoIncidencias()
        fetchGrados()
        fetchAlumnos()

        const incidenciasTable:IncidenciaTable[] = incidencias.map((item) => {
            const incidenciaTable:IncidenciaTable = {
                id: `${item.id}`,
                descripcion: item.descripcion,
                created_at: item.created_at,
                creador: item.user.profile?.fullName,
                alumno: item.alumnoProfile.user?.profile?.fullName,
                tipoIncidencia: item.tipoIncidencia?.descripcion,
                severidad: item.tipoIncidencia?.grado?.nombre,
                puntos: item.tipoIncidencia?.grado?.cantidadPuntos
            }
            return incidenciaTable
        })
        setIncidenciasTable(incidenciasTable)
    },[])

    return (
        <ItemContext.Provider value={{
            incidencias,
            grados,
            tipoIncidencias,
            alumnos,
            incidenciasTable
        }}>
            {children}
        </ItemContext.Provider>
    )
}
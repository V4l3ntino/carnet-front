'use client'

import { useEffect, useState } from "react";
import { ItemContext } from "./ItemContext";
import { Alumno, Grado, Incidencia, TipoIncidencia, UserGQL } from "../../../interfaces";
import { getAllIncidencia } from "../../api/incidenciasCrud";
import { getAllTipoIncidencias } from "../../api/tipoIncidenciasCrud";
import { getAllGrados } from "../../api/gradosCrud";
import { getAllAlumnos } from "../../api/alumnosCrud";
import { IncidenciaTable, SeverityLevel } from "../../../types/incidencias";
import { io, Socket } from "socket.io-client";
import { Role } from "@/app/(dashboard)/settings/(rol)/rols/types";
import { getAllRols } from "@/api/permisosCrud";
import { toast } from "sonner"




export const ItemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [incidencias, setIncidencias] = useState<Incidencia[]>([])
    const [incidenciasTable, setIncidenciasTable] = useState<IncidenciaTable[]>([])
    const [newIncidenciaTable, setNewIncidenciaTable] = useState<IncidenciaTable>()
    const [newTipoIncidencia, setNewTipoIncidencia] = useState<TipoIncidencia>()
    const [deleteIncidenciaId, setDeleteincidenciaId] = useState<string>("")
    const [deleteTipoIncidenciaId, setDeleteTipoIncidenciaId] = useState<string>("")
    const [roles, setRoles] = useState<Role[]>([])

    const [tipoIncidencias, setTipoIncidencias] = useState<TipoIncidencia[]>([])
    const [grados, setGrados] = useState<Grado[]>([])
    const [alumnos, setAlumnos] = useState<Alumno[]>([])

    const [users, setUsers] = useState<UserGQL[]>([])


    const [socket, setSocket] = useState<Socket | null>(null);
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
        if (incidenciasReq) {
            setIncidencias(incidenciasReq)

            const incidenciasTable: IncidenciaTable[] = incidenciasReq.map((item) => {
                const incidenciaTable: IncidenciaTable = {
                    id: `${item.id}`,
                    descripcion: item.descripcion,
                    created_at: item.created_at,
                    creador: item.user.profile?.fullName,
                    alumno: item.alumnoProfile.idea,
                    tipoIncidencia: item.tipoIncidencia?.descripcion,
                    severidad: item.tipoIncidencia?.grado?.nombre as SeverityLevel,
                    puntos: item.tipoIncidencia?.grado?.cantidadPuntos
                }
                return incidenciaTable
            })
            setIncidenciasTable(incidenciasTable)
        }
    }
    async function fetchTipoIncidencias() {
        const incidenciasReq = await getAllTipoIncidencias()
        if (incidenciasReq) {
            setTipoIncidencias(incidenciasReq)
        }
    }
    async function fetchGrados() {
        const gradosReq = await getAllGrados()
        if (gradosReq) {
            setGrados(gradosReq)
        }
    }
    async function fetchAlumnos() {
        const alumnosReq = await getAllAlumnos()
        if (alumnosReq) {
            setAlumnos(alumnosReq)
        }
    }
    async function fetchRols() {
        const rolReq = await getAllRols()
        if (rolReq) {
            setRoles(rolReq)
        }
    }

    async function fetchUserGQL() {
        const request = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `
                query GetUsers {
                    getUsers {
                    id
                    username
                    email
                    profile {
                        fullName
                    }
                    permiso {
                        nombre
                        id
                    }
                    }
                }
            `
            })
        })
        const data = await request.json()
        setUsers(data.data.getUsers)
    }

    const aplyRoles = async () => {
        if (socket) {
            socket.emit("aplicarRoles")
            toast.success("Cambios aplicados con éxito!")
        }
    }



    useEffect(() => {
        fetchIncidencias()
        fetchTipoIncidencias()
        fetchGrados()
        fetchAlumnos()
        fetchRols()
        fetchUserGQL()
        // Conecta al servidor WebSocket
        const socketInstance = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);

        setSocket(socketInstance);

        socketInstance.on("incidencia", (data: Incidencia) => {
            console.log("websockets", data)

            const incidenciaTable: IncidenciaTable = {
                id: `${data.id}`,
                descripcion: data.descripcion,
                created_at: data.created_at,
                creador: data.user.profile?.fullName,
                alumno: data.alumnoProfile.idea,
                tipoIncidencia: data.tipoIncidencia?.descripcion,
                severidad: data.tipoIncidencia?.grado?.nombre as SeverityLevel,
                puntos: data.tipoIncidencia?.grado?.cantidadPuntos
            }
            setNewIncidenciaTable(incidenciaTable)
        })

        socketInstance.on("incidenciaDelete", (id: string) => {
            setDeleteincidenciaId(id)
        })
        
        socketInstance.on("tipoincidencia", (data: TipoIncidencia) => {
            setNewTipoIncidencia(data)
        })
        
        socketInstance.on("tipoincidenciaDelete", (id: string) => {
            setDeleteTipoIncidenciaId(id)
        })

    }, [])

    return (
        <ItemContext.Provider value={{
            incidencias,
            grados,
            tipoIncidencias,
            alumnos,
            incidenciasTable,
            newIncidenciaTable,
            newTipoIncidencia,
            deleteIncidenciaId,
            deleteTipoIncidenciaId,
            rolList: roles,
            aplyRoles,
            users
        }}>
            {children}
        </ItemContext.Provider>
    )
}
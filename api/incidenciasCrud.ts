import { Alumno, Incidencia, IncidenciaEmmit, IncidenciaTable, Profesor, TipoIncidencia, User } from "../interfaces"
export const saveIncidencia = async(incidencia: IncidenciaTable, creadores: Profesor[], alumnos: Alumno[], tipoIncidencias: TipoIncidencia[]):Promise<void> => {
    try {
        const CREADOR: Profesor | undefined = creadores.find((item) => item.user.profile.fullName == incidencia.creador)
        const ALUMNO: Alumno | undefined = alumnos.find((item) => item.user.profile.fullName == incidencia.alumno)
        const TIPO_INCIDENCIA: TipoIncidencia | undefined = tipoIncidencias.find((item) => item.descripcion == incidencia.tipoIncidencia)

        const INCIDENCIA: IncidenciaEmmit = {
            user_id: CREADOR!.user.id,
            id: incidencia.id,
            alumno_id: ALUMNO!.idea,
            descripcion: incidencia.descripcion,
            tipoIncidencia: TIPO_INCIDENCIA!.id.toString(),
        }
        console.log(INCIDENCIA)
        const result = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/incidencia`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(INCIDENCIA)
        })

        if(!result.ok){
            const response = await result.json()
        alert(`${response.message}`)
        }

    
    } catch (error) {
        
    }
}

export const deleteIncidencia = async(id: string):Promise<void> => {
    try {
        


        const result = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/incidencia/${id}`, {
            method: 'DELETE',
        })

        if(!result.ok){
            const response = await result.json()
        alert(`${response.message}`)
        }

    
    } catch (error) {
        
    }

}

export const getAllIncidencia = async(): Promise<Incidencia[] | undefined> => {

    try {
        const result = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/incidencia`)

        if(result.ok != true){
            throw new Error()
        }

        return result.json()
    
    } catch (error) {
        throw error        
    }

}

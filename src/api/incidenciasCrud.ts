import { Incidencia, IncidenciaEmmit, TipoIncidencia } from "../../interfaces"
import { IncidenciaTable } from "../../types/incidencias"

export const saveIncidencia = async (incidencia: IncidenciaTable, creador: string, tipoIncidencias: TipoIncidencia[]): Promise<void> => {
    try {
        const TIPO_INCIDENCIA: TipoIncidencia | undefined = tipoIncidencias.find((item) => item.descripcion == incidencia.tipoIncidencia)

        const INCIDENCIA: IncidenciaEmmit = {
            user_id: creador,
            id: incidencia.id,
            alumno_id: incidencia.alumno,
            descripcion: incidencia.descripcion,
            tipoIncidencia: TIPO_INCIDENCIA!.id.toString(),
        }
        console.log(INCIDENCIA)
        const result = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/incidencia`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(INCIDENCIA)
        })

        if (!result.ok) {
            const response = await result.json().catch(() => ({})); 
            throw new Error(response.message || `Error al guardar la incidencia`);
        }

    } catch (error) {
        console.error("Error en saveIncidencia:", error);
        throw error;
    }
}

export const deleteIncidencia = async (id: string): Promise<void> => {
    try {



        const result = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/incidencia/${id}`, {
            method: 'DELETE',
        })

        if (!result.ok) {
            const response = await result.json()
            throw new Error(response.message || `Error al borrar la incidencia`);
        }


    } catch (error) {
        console.error("Error en borarr incidencia:", error);
        throw error;
    }

}

export const getAllIncidencia = async (): Promise<Incidencia[] | undefined> => {

    try {
        const result = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/incidencia`)

        if (result.ok != true) {
            throw new Error()
        }

        return result.json()

    } catch (error) {
        throw error
    }

}

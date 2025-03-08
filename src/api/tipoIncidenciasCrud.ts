import { Grado, TipoIncidencia, TipoIncidenciaTable } from "../interfaces"

export const getAllTipoIncidencias = async(): Promise<TipoIncidencia[] | undefined> => {

    try {
        const result = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tipo-incidencia`)

        if(result.ok != true){
            throw new Error()
        }

        return result.json()
    
    } catch (error) {
        throw error        
    }

}

export const saveTipoIncidencia = async(tipoIncidencia: TipoIncidenciaTable, grados: Grado[]):Promise<void> => {
    try {

       const GRADO = grados.find((item) => item.nombre === tipoIncidencia.grado)
       const TIPO_INCIDENCIA = {
        user_id: "4ec0c4d1-bd90-4f55-94b6-79c3b55cb761",
        descripcion: tipoIncidencia.descripcion,
        grado: GRADO!.id,
        id: tipoIncidencia.id,
       }

       console.log(TIPO_INCIDENCIA)
        const result = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tipo-incidencia`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(TIPO_INCIDENCIA)
        })

        if(!result.ok){
            const response = await result.json()
        alert(`${response.message}`)
        }

    
    } catch (error) {
        console.log(error)
    }
}

export const deleteTipoIncidencia = async(id: string):Promise<void> => {
    try {
        


        const result = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tipo-incidencia/${id}`, {
            method: 'DELETE',
        })

        if(!result.ok){
            const response = await result.json()
        alert(`${response.message}`)
        }

    
    } catch (error) {
     console.log(error)   
    }

}
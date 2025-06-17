import { Grado } from "../../interfaces"

export const getAllGrados = async(): Promise<Grado[] | undefined> => {

    try {
        const result = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/grado`)
        return result.json()
    
    } catch (error) {
        throw error        
    }

}
export const updateGrado = async(grado: Grado, creator_id: string): Promise<void> => {

    try {
        const object = {
            user_id: creator_id,
            id: grado.id,
            nombre: grado.nombre,
            cantidadPuntos: `${grado.cantidadPuntos}`        
        }
        const result = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/grado`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(object)
        })

        if (!result.ok) {
            const response = await result.json().catch(() => ({})); 
            throw new Error(response.message || `Error al guardar la incidencia`);
        }

    
    } catch (error) {
        throw error        
    }

}
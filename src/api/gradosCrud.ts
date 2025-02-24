import { Grado, TipoIncidencia } from "../../interfaces"

export const getAllGrados = async(): Promise<Grado[] | undefined> => {

    try {
        const result = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/grado`)
        return result.json()
    
    } catch (error) {
        throw error        
    }

}
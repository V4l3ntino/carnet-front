import { Profesor } from "../../interfaces"

export const getAllProfesores = async(): Promise<Profesor[] | undefined> => {

    try {
        const result = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profesor-profile`)

        return result.json()
    
    } catch (error) {
        throw error        
    }

}
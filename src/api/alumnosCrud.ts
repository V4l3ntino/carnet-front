import { Alumno } from "../../interfaces"

export const getAllAlumnos = async(): Promise<Alumno[] | undefined> => {

    try {
        const result = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/alumno-profile`)

        return result.json()
    
    } catch (error) {
        throw error        
    }

}
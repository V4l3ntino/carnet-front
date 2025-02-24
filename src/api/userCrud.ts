import { User } from "../interfaces"

export const getAllUser = async(): Promise<User[] | undefined> => {

    try {
        const result = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`)

        if(result.ok != true){
            throw new Error()
        }

        return result.json()
    
    } catch (error) {
        throw error        
    }

}

export const get0neUser = async(id: string): Promise<User | undefined> => {

    try {
        const result = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${id}`)

        if(result.ok != true){
            throw new Error()
        }

        return result.json()
    
    } catch (error) {
        throw error        
    }

}


export async function fetchOneUserGQL() {
    const request = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
            query GetUsersbyId {
            getUsersbyId(id: "349d792d-1f62-41c5-8192-75f705d32d19") {
                id
                username
                email
                profile {
                    fullName
                }
                profesorProfile {
                    idea
                    created_at
                    materia
                    grupo {
                        id
                        nombre
                    }
                }
                alumnoProfile {
                    edad
                    repetidor
                    incidencia {
                        id
                        descripcion
                        created_at
                    }
                    grupo {
                        id
                        nombre
                    }
                }
                permiso {
                    id
                    nombre
                    descripcion
                }
            }
        }
            `
        })
    })
    const data = await request.json()
    
    return await data.data.getUsers
}
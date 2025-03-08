import { Permission, Role } from "@/app/(dashboard)/settings/(rol)/rols/types"

export const savePerm = async (rol:Role): Promise<void> => {
    try {
        const tabla: Permission[] = rol.tabla;
        
        // Crear array de promesas para ejecutar en paralelo
        const requests = tabla.map(async (item) => {
            const data = {
                ...item,
                permiso_id: rol.id
            }
            console.log("req",data)
          const result = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tablas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data) // Envía cada elemento individual
          });
      
          return result.json();
        });
      
        
      } catch (error) {
        console.error("Error en saveIncidencia:", error);
        throw new Error(`Fallaron ${error}`);
      }
}

export const saveRol = async (rol:Role): Promise<void> => {
    try {
        console.log("INSERTANDO",rol)
        // Crear array de promesas para ejecutar en paralelo
        const result = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/permisos/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rol)
        })
      
        const resultData = await result.json()
        console.log(resultData)
      } catch (error) {
        console.error("Error en saveIncidencia:", error);
        throw new Error(`Fallaron ${error}`);
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

export const getAllRols = async (): Promise<Role[] | undefined> => {

    try {
        const result = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/permisos/`)

        if (result.ok != true) {
            throw new Error()
        }

        return result.json()

    } catch (error) {
        throw error
    }

}

"use client"
import { fetchOneUserGQL } from "@/api/userCrud";
import AlumnoDetailView from "@/components/custom/alumno-detail";
import ProfesorDetailView from "@/components/custom/profesor-detail";
import UserDetailView from "@/components/custom/user-detail";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CuentaPuntos } from "../../../../../interfaces";
import { useAuthContext } from "@/context/AuthContext";
import { BreadcrumbWithCustomSeparator } from "@/components/custom/breadcumps"


interface Group {
  id: string
  nombre: string
}

interface Incidencia {
  id: string
  descripcion: string
  created_at: string
  tipoIncidencia: tipoIncidencia
}

interface Grado {
  id: string
  nombre: string
  cantidadPuntos: number
}


interface tipoIncidencia {
  id: string
  descripcion: string
  created_at: string
  grado: Grado
}

interface AlumnoProfile {
  edad: number
  repetidor: boolean
  incidencia?: Incidencia[]
  grupo?: Group
  cuentaPuntos: CuentaPuntos
}

interface ProfesorProfile {
  idea: string
  created_at: string
  materia: string
  grupo?: Group
}

interface UserPermission {
  id: string
  nombre: string
  descripcion: string
}

interface UserProfile {
  fullName: string
}
interface UserDetail {
  id: string
  username: string
  email: string
  profile: UserProfile
  profesorProfile?: ProfesorProfile
  alumnoProfile?: AlumnoProfile
  permiso: UserPermission
}
const Page = () => {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useAuthContext()
  const router = useRouter()
  const { id } = useParams()


  useEffect(() => {
    if (userInfo && !userInfo?.permisos.find((item) => item.tipo == "r")?.user) {
      router.push("/")
    }
  }, [userInfo])

  const breadCumbs = [
    {
      name: "Home",
      url: "/"
    },
    {
      name: "Usuarios",
      url: "/users"
    },
    {
      name: `${user?.profile.fullName}`,
      url: `/users/${id}`
    }
  ]



  useEffect(() => {
    const fetchUser = async () => {
      try {
        const request = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: `
                query GetUsersbyId {
                  getUsersbyId(id: "${id}") {
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
                              tipoIncidencia {
                                  id
                                  descripcion
                                  created_at
                                  grado {
                                      id
                                      nombre
                                      cantidadPuntos
                                  }
                              }
                          }
                          grupo {
                              id
                              nombre
                          }
                          cuentaPuntos {
                              id
                              cantidad
                              created_at
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

        setUser(data.data.getUsersbyId);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Error loading user</div>;

  return <div>
    <BreadcrumbWithCustomSeparator items={breadCumbs} />
    {
      user.alumnoProfile ? (
        <AlumnoDetailView
          alumno={{
            fullName: user.profile.fullName,
            edad: user.alumnoProfile.edad,
            repetidor: user.alumnoProfile.repetidor,
            incidencia: user.alumnoProfile.incidencia?.map((inc) => ({
              id: inc.id,
              created_at: inc.created_at,
              tipoIncidencia: {
                id: inc.tipoIncidencia.id,
                created_at: inc.tipoIncidencia.created_at,
                descripcion: inc.tipoIncidencia.descripcion,
                grado: {
                  cantidadPuntos: inc.tipoIncidencia.grado.cantidadPuntos,
                  id: Number(inc.tipoIncidencia.grado.id),
                  nombre: inc.tipoIncidencia.grado.nombre,
                },
              },
              descripcion: inc.descripcion,
            })) || [],
            grupo: {
              id: "g1",
              nombre: "4º ESO B",
              curso: "2023-2024",
              tutor: "María González",
            },
            cuentaPuntos: {
              id: user.alumnoProfile.cuentaPuntos.id,
              cantidad: user.alumnoProfile.cuentaPuntos.cantidad,
              created_at: user.alumnoProfile.cuentaPuntos.created_at
            }
          }}
        />


      ) : (
        <>
          {
            user.profesorProfile ? (
              <ProfesorDetailView />
            ) : (
              <UserDetailView />
            )
          }
        </>
      )
    }
  </div>;
};

export default Page;
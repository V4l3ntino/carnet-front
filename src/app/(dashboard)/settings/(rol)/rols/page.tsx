'use client'
import { useItemContext } from "@/context/itemsContext/ItemContext"
import PermissionsTable from "./permissions-table"
import { Role } from "./types"
import { useAuthContext } from "@/context/AuthContext"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { BreadcrumbWithCustomSeparator } from "@/components/custom/breadcumps"

// Datos de ejemplo incluyendo el rol de Administrador

export default function Page() {
  const {rolList} = useItemContext()
  const {userInfo} = useAuthContext()
  const router = useRouter()
    useEffect(() => {
      if(userInfo && !userInfo?.permisos.find((item) => item.tipo == "r")?.permisos){
        router.push("/")
      }
    },[userInfo])
    const breadCumbs = [
      {
        name: "Home",
        url: "/"
      },
      {
        name: "Permisos",
        url: "/settings/rols"
      }
    ]
  
  return (
    <>
      <BreadcrumbWithCustomSeparator items={breadCumbs}/>
      <div className="container mx-auto py-10">
        {rolList.length > 0 ? (
          <PermissionsTable initialRoles={rolList} />
        ) : (`Cargando...`)}
      </div>
    </>
  )
}


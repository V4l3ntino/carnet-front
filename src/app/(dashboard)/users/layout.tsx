'use client'
import { useAuthContext } from "@/context/AuthContext";
import { ItemProvider } from "@/context/itemsContext/ItemProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {

     const {userInfo} = useAuthContext()
     const router = useRouter()

    useEffect(() => {
        if(userInfo && !userInfo?.permisos.find((item) => item.tipo == "r")?.user){
          router.push("/")
        }
      },[userInfo])
    

    return (
        <section>
            <ItemProvider>
                {children}
            </ItemProvider>
        </section>
    );
}
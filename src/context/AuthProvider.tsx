'use client'

import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { decodeJWT } from "../../interfaces";
import { io } from "socket.io-client";

import { toast } from "sonner"



export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string>("");
    const [userInfo, setUserinfo] = useState<decodeJWT | null>(null);
    const router = useRouter()

    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (token) {
            try {
                setAccessToken(token)
                const decoded: decodeJWT = jwtDecode(token);
                console.log(decoded)
                setUserinfo(decoded)
            } catch (error) {
                console.error("Error al decodificar el token ", error)
                Cookies.remove('accessToken')
            }
            return
        }
        router.push("/login")
    }, []);

    useEffect(() => {
        const socketInstance = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);

        socketInstance.on("updateToken", async () => {

            const token = Cookies.get('accessToken');
            if (token) {
                try {
                    const decoded: decodeJWT = jwtDecode(token);
                    const data = {
                        username: decoded?.username,
                        fullName: decoded?.fullName,
                        email: decoded?.email,
                    }

                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${decoded?.sub}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data),
                    })

                    const dataJson = await response.json()
                    if (!response.ok) {
                        console.log(dataJson.message)
                        return
                    }
                    setAccessToken(dataJson.accessToken)
                    toast.info("Se han aplicado nuevos cambios en los permisos")

                } catch (error) {
                    console.error("Error al decodificar el token ", error)
                    Cookies.remove('accessToken')
                }
            }

        })
    }, [])

    useEffect(() => {
        try {
            if (accessToken != "") {
                const decoded: decodeJWT = jwtDecode(accessToken);
                setUserinfo(decoded)
                Cookies.set('accessToken', accessToken, {
                    expires: 1, // Expira en 1 día
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict'
                });
            }
        } catch (error) {
            console.log("Error al decodificar el token ", error)
            Cookies.remove('accessToken')
        }
        return
    }, [accessToken])

    return (
        <AuthContext.Provider value={{
            accessToken,
            setAccessToken,
            userInfo
        }}>
            {children}
        </AuthContext.Provider>
    )
}
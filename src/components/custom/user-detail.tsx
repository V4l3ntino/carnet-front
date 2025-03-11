"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AtSign, Copy, Edit, Key, Lock, LogOut, Mail, Shield, UserIcon, UserCog } from "lucide-react"
import { toast } from "sonner"

// These interfaces would typically be imported from your types file
interface UserProfile {
    fullName: string
}

interface UserDetail {
    id: string
    username: string
    email: string
    profile: UserProfile
}

// Example data for demonstration
const userExample: UserDetail = {
    id: "usr_12345abcde",
    username: "johndoe",
    email: "john.doe@example.com",
    profile: {
        fullName: "John Doe",
    },
}

export default function UserDetailView({ user = userExample }: { user?: UserDetail }) {
    const [activeTab, setActiveTab] = useState("profile")

    // Function to copy text to clipboard
    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Copiado al portapapeles", {
            description: `${label} ha sido copiado.`,
        })
    }

    // Function to get initials from full name
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .substring(0, 2)
    }

    // Generate a consistent color based on username
    const getAvatarColor = (username: string) => {
        const colors = [
            "bg-red-500",
            "bg-blue-500",
            "bg-green-500",
            "bg-yellow-500",
            "bg-purple-500",
            "bg-pink-500",
            "bg-indigo-500",
            "bg-teal-500",
        ]

        // Simple hash function to get a consistent index
        const hash = username.split("").reduce((acc, char) => {
            return acc + char.charCodeAt(0)
        }, 0)

        return colors[hash % colors.length]
    }

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <Avatar className="h-20 w-20 border-2 border-muted">
                        <AvatarImage
                            src={`/placeholder.svg?height=80&width=80&text=${getInitials(user.profile.fullName)}`}
                            alt={user.profile.fullName}
                        />
                        <AvatarFallback className={getAvatarColor(user.username)}>
                            {getInitials(user.profile.fullName)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1">
                        <CardTitle className="text-2xl">{user.profile.fullName}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                            <AtSign className="h-3 w-3" />
                            {user.username}
                        </CardDescription>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {user.email}
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="profile">Perfil</TabsTrigger>
                        <TabsTrigger value="security">Seguridad</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="mt-4 space-y-6">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium">Información de usuario</h3>
                                <Separator />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-muted-foreground">ID de usuario</label>
                                    <div className="flex items-center justify-between rounded-md border p-2">
                                        <code className="text-sm">{user.id}</code>
                                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(user.id, "ID de usuario")}>
                                            <Copy className="h-4 w-4" />
                                            <span className="sr-only">Copiar ID</span>
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-muted-foreground">Nombre de usuario</label>
                                    <div className="flex items-center gap-2 rounded-md border p-2">
                                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                                        <span>{user.username}</span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-muted-foreground">Correo electrónico</label>
                                    <div className="flex items-center gap-2 rounded-md border p-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span>{user.email}</span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-muted-foreground">Nombre completo</label>
                                    <div className="flex items-center gap-2 rounded-md border p-2">
                                        <UserCog className="h-4 w-4 text-muted-foreground" />
                                        <span>{user.profile.fullName}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button variant="outline" className="gap-2">
                                    <Edit className="h-4 w-4" />
                                    Editar perfil
                                </Button>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="security" className="mt-4 space-y-6">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium">Seguridad de la cuenta</h3>
                                <Separator />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-2 rounded-md border">
                                    <div className="flex items-center gap-3">
                                        <Shield className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">Autenticación de dos factores</p>
                                            <p className="text-sm text-muted-foreground">Añade una capa extra de seguridad a tu cuenta</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                                        Desactivado
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between p-2 rounded-md border">
                                    <div className="flex items-center gap-3">
                                        <Key className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">Contraseña</p>
                                            <p className="text-sm text-muted-foreground">Actualiza tu contraseña regularmente</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" className="gap-1">
                                        <Lock className="h-3 w-3" />
                                        Cambiar
                                    </Button>
                                </div>

                                <div className="flex items-center justify-between p-2 rounded-md border">
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">Verificación de correo</p>
                                            <p className="text-sm text-muted-foreground">Estado de verificación de tu correo electrónico</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                        Verificado
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>

            <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                </Button>

                <Button className="gap-2">
                    <UserCog className="h-4 w-4" />
                    Gestionar cuenta
                </Button>
            </CardFooter>
        </Card>
    )
}


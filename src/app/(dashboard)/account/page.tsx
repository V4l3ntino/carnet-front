"use client"

import { useState } from "react"
import Image from "next/image"
import { Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useAuthContext } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"


export default function AccountPage() {
  const [imageUrl, setImageUrl] = useState("/placeholder.svg")
  const [progress] = useState(85)
  const { userInfo, setAccessToken, accessToken } = useAuthContext()
  const [error, setError] = useState<string>("")

  const router = useRouter()

  const handleImageClick = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const url = URL.createObjectURL(file)
        setImageUrl(url)
      }
    }
    input.click()
  }
  interface Data {
    username: string
    fullName: string
    email: string
  }


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {

    event.preventDefault()
    setError("")

    const formData = new FormData(event.currentTarget)

    const data: Data = {
      username: formData.get("username") as string,
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${userInfo?.sub}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const dataJson = await response.json()
      if (!response.ok) {
        setError(dataJson.message || "Failed to update account")
        console.log(dataJson.message)
        return
      }
      setAccessToken(dataJson.accessToken)

    } catch (err) {
      setError("An error occurred. Please try again.")
    }
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-2">Mi Perfil</h1>
      <p className="text-muted-foreground text-center mb-8">Miembro desde Enero 2024</p>

      <div className="grid gap-8 md:grid-cols-[300px_1fr] max-w-4xl mx-auto">
        <div className="space-y-6">
          <div className="relative mx-auto flex justify-center">
            <div
              className="w-[200px] h-[200px] rounded-full bg-muted relative cursor-pointer overflow-hidden"
              onClick={handleImageClick}
            >
              <Image src={imageUrl || "https://github.com/shadcn.png"} alt="Profile picture" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-semibold">{userInfo?.fullName}</h2>
            <p className="text-sm text-muted-foreground">{userInfo?.rolname}</p>
          </div>

          <div className="flex justify-between text-center">
            <div>
              <div className="text-xl font-semibold">128</div>
              <div className="text-sm text-muted-foreground">Posts</div>
            </div>
            <div>
              <div className="text-xl font-semibold">1234</div>
              <div className="text-sm text-muted-foreground">Seguidores</div>
            </div>
            <div>
              <div className="text-xl font-semibold">567</div>
              <div className="text-sm text-muted-foreground">Siguiendo</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Perfil completado</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Información Personal</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Actualiza tu información personal y personaliza tu perfil
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username">Nombre de usuario</Label>
              <Input id="username" name="username" defaultValue={userInfo?.username} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullname">Nombre completo</Label>
              <Input id="fullname" name="fullName" defaultValue={userInfo?.fullName}
                pattern="^(?=.{1,30}$)(?!.*_)([A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÖØ-öø-ÿ]*) ([A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÖØ-öø-ÿ]*)$"
                title="Escribe el nombre y apellido separados por un espacio, sin guiones bajos, con el primer carácter en mayúscula y máximo 30 caracteres."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" name="email" type="email" defaultValue={userInfo?.email} />
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline">Cancelar</Button>
              <Button type="submit">Guardar cambios</Button>
            </div>
          </form>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}


"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AtSignIcon, LockIcon, UserIcon, MailIcon } from "lucide-react"
import { v4 as uuidv4 } from "uuid"


interface SignUpData {
  uuid?: string
  username: string
  password: string
  permiso: string
  fullName: string
  email: string
}

export default function SignUpPage() {
  const [error, setError] = useState<string>("")
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    const formData = new FormData(event.currentTarget)

    // Combine firstName and surname to create fullName
    const firstName = (formData.get("firstName") as string).trim()
    const surname = (formData.get("surname") as string).trim()
    const fullName = `${firstName} ${surname}`.trim()

    const signUpData: SignUpData = {
      uuid: uuidv4(),
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      permiso: "0",
      fullName,
      email: formData.get("email") as string,
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/sign-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signUpData),
      })

      if (response.ok) {
        router.push("/login")
      } else {
        const data = await response.json()
        setError(data.message || "Failed to create account")
        console.log(data.message)
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Create an account</h1>
          <p className="mt-2 text-sm text-gray-600">Fill in your information to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input id="username" name="username" type="text" required className="pl-10" placeholder="johndoe" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AtSignIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input id="firstName" name="firstName" type="text" required className="pl-10" placeholder="John" />
                </div>
              </div>
              <div>
                <Label htmlFor="surname">Surname</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AtSignIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input id="surname" name="surname" type="text" required className="pl-10" placeholder="Doe" />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input id="email" name="email" type="email" required className="pl-10" placeholder="john@example.com" />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">
              Create Account
            </Button>

            <Button type="button" variant="outline" onClick={() => router.push("/")} className="w-full">
              Back to Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}


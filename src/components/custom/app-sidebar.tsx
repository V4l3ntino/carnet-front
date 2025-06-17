"use client"

import * as React from "react"
import {
  AlertCircle,
  ChevronDown,
  ChevronRight,
  CreditCard,
  FileWarning,
  LayoutDashboard,
  LogOut,
  Moon,
  Settings,
  Sparkles,
  Sun,
  User,
  User2Icon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useAuthContext } from "@/context/AuthContext"
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation"
import Link from "next/link"


export function AppSidebar() {
  const [isDark, setIsDark] = React.useState(false)

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  const { userInfo } = useAuthContext()
  const router = useRouter()
  return (
    <Sidebar variant="floating" collapsible="icon" className="hidden md:flex">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <div className="flex aspect-square h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    A
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">Acme Corp.</span>
                    <span className="text-xs text-muted-foreground">Startup</span>
                  </div>
                  <ChevronDown className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px]">
                <DropdownMenuItem>Organization Settings</DropdownMenuItem>
                <DropdownMenuItem>Create Organization</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Theme Toggle */}
              <SidebarMenuItem>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleDarkMode}
                  className="w-full justify-start gap-2 group-data-[collapsible=icon]:justify-center"
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  <span className="group-data-[collapsible=icon]:hidden">
                    {isDark ? "Light Mode" : "Dark Mode"}
                  </span>
                </Button>
              </SidebarMenuItem>

              <Separator className="my-2" />

              {/* Dashboard */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Dashboard"
                  className="group-data-[collapsible=icon]:justify-center"
                >
                  <Link href={"/"}>
                    <LayoutDashboard className="mr-2 h-4 w-4 group-data-[collapsible=icon]:mr-0" />
                    <span className="group-data-[collapsible=icon]:hidden">Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Incidencias */}
              {
                userInfo?.permisos?.find((item) => item.tipo == "r")?.incidencia ? (
                  <Collapsible>
                    <SidebarMenuItem className="flex flex-col">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className="w-full group group-data-[collapsible=icon]:justify-center"
                          tooltip="Incidencias"
                        >
                          <AlertCircle className="mr-2 h-4 w-4 group-data-[collapsible=icon]:mr-0" />
                          <span className="group-data-[collapsible=icon]:hidden">Incidencias</span>
                          <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90 group-data-[collapsible=icon]:hidden" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link href={"/incidencias"}>Incidencias CRUD</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          {
                            userInfo.permisos?.find((item) => item.tipo == "r")?.tipo_incidencia ? (
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild>
                                  <Link href={"/tipo-incidencias"}>Tipo incidencias</Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ) : (``)
                          }
                          {
                            userInfo.permisos?.find((item) => item.tipo == "r")?.grado ? (
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild>
                                  <Link href={"/grados"}>Settings Grados</Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ) : (``)
                          }
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (``)
              }

              {
                userInfo && userInfo?.permisos?.find((item) => item.tipo == "r")?.user ? (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip="Dashboard"
                      className="group-data-[collapsible=icon]:justify-center"
                    >
                      <Link href={"/users"}>
                        <User2Icon className="mr-2 h-4 w-4 group-data-[collapsible=icon]:mr-0" />
                        <span className="group-data-[collapsible=icon]:hidden">Usuarios</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : (``)
              }

              {/* Faltas 
              {userInfo?.permisos?.find((item) => item.tipo == "r")?.incidencia ? (
                <Collapsible>
                  <SidebarMenuItem className="flex flex-col">
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        className="w-full group group-data-[collapsible=icon]:justify-center"
                        tooltip="Faltas"
                      >
                        <FileWarning className="mr-2 h-4 w-4 group-data-[collapsible=icon]:mr-0" />
                        <span className="group-data-[collapsible=icon]:hidden">Faltas</span>
                        <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90 group-data-[collapsible=icon]:hidden" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <a href="#ver-faltas">Ver</a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <a href="#crear-faltas">Crear/Actualizar</a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (``)}
              */}

              {/* Settings */}
              {userInfo?.permisos?.find((item) => item.tipo == "r")?.permisos ? (
                <Collapsible>
                  <SidebarMenuItem className="flex flex-col">
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        className="w-full group group-data-[collapsible=icon]:justify-center"
                        tooltip="Settings"
                      >
                        <Settings className="mr-2 h-4 w-4 group-data-[collapsible=icon]:mr-0" />
                        <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                        <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90 group-data-[collapsible=icon]:hidden" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>

                        {
                          userInfo.permisos.find((item) => item.tipo == "r")?.permisos && userInfo.permisos.find((item) => item.tipo == "w")?.permisos ? (
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <Link href={'/settings/rols'}>Configurar Roles</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ) : (``)
                        }

                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (``)}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t group-data-[collapsible=icon]:p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2"
            >
              <Avatar>
                <AvatarImage src={`${userInfo?.avatar}`} />
                <AvatarFallback>{userInfo?.fullName.split(' ')[0].substring(0, 1)}{userInfo?.fullName.split(' ')[1].substring(0, 1)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
                <span className="font-medium"> {userInfo?.fullName}</span>
                <span className="text-xs text-muted-foreground">
                  {userInfo?.username}
                </span>
              </div>
              <ChevronDown className="ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem>
              <Sparkles className="mr-2 h-4 w-4" />
              Upgrade to Pro
            </DropdownMenuItem>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <Link href={"/account"}>Account</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Notifications
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={() => { Cookies.remove('accessToken'); router.push("/login") }}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
      <SidebarRail />
      <SidebarTrigger className="absolute right-[-12px] top-3 h-6 w-6 rounded-full border bg-background" />
    </Sidebar>
  )
}


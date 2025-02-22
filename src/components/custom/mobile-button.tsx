"use client"
import { Menu } from "lucide-react"
import { Button } from "../ui/button"
import { useSidebar } from "../ui/sidebar"

// Mobile menu button component
export function MobileMenuButton() {
    const { toggleSidebar } = useSidebar()
  
    return (
      <Button variant="ghost" size="icon" className="md:hidden fixed z-50" onClick={toggleSidebar}>
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
    )
  }
  
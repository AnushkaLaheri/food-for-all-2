"use client"

import { Bell, Moon, Search, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "next-themes"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const { isMobile } = useSidebar()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        {isMobile && <SidebarTrigger />}
        <a href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-700 bg-clip-text text-transparent">
            FoodShare
          </span>
        </a>
      </div>
      <div className={cn("ml-auto flex items-center gap-4", !mounted && "opacity-0")}>
        <form className="relative hidden md:flex">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-64 rounded-full bg-background pl-8 md:w-80 lg:w-96"
          />
        </form>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <Badge
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0"
            variant="destructive"
          >
            3
          </Badge>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle Theme"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {mounted && theme === "dark" ? (
            <Sun className="h-5 w-5 transition-all" />
          ) : (
            <Moon className="h-5 w-5 transition-all" />
          )}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="User menu">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}


"use client"

import {
  Award,
  Gift,
  Home,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  User,
  Utensils,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsAuthenticated(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsAuthenticated(false)
    router.push("/login")
  }

  const menuItems = [
    { title: "Home", href: "/", icon: Home },
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Donate", href: "/donate", icon: Gift },
    { title: "Explore", href: "/explore", icon: Search },
    { title: "Leaderboard", href: "/leaderboard", icon: Award },
    { title: "Profile", href: "/profile", icon: User },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center py-4">
        <Link href="/" className="flex items-center gap-2 px-4">
          <Utensils className="h-6 w-6 text-emerald-500" />
          <span className="text-xl font-bold">FoodForAll</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <Link href="/settings">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* ✅ Show Logout only if authenticated */}
          {isAuthenticated && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Logout">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted rounded-md"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

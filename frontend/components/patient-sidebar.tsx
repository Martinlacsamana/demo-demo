"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Users, Calendar, FileText, Settings, Bell, HelpCircle, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function PatientSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <Sidebar className="border-r border-gray-200 bg-primary-blue text-white shrink-0">
      <SidebarHeader className="py-4">
        <div className="flex flex-col items-center justify-center px-4">
          <img
            src="https://cdn.prod.website-files.com/66f22558f0bee9421463707b/66f22558f0bee94214637098_ataraxis-logo-white.svg"
            alt="Ataraxis AI"
            className="h-8"
          />
          <div className="text-xs text-white/70 mt-2">Your Oncology Assistant</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="mt-6 space-y-3">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/")}
              className="hover:bg-primary-blue/30 hover:text-primary-yellow data-[active=true]:bg-primary-blue/30 data-[active=true]:text-primary-yellow data-[active=true]:border-l-4 data-[active=true]:border-primary-yellow pl-4"
            >
              <Link href="/" className="flex items-center">
                <Home className="mr-3 h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/patients")}
              className="hover:bg-primary-blue/30 hover:text-primary-yellow data-[active=true]:bg-primary-blue/30 data-[active=true]:text-primary-yellow data-[active=true]:border-l-4 data-[active=true]:border-primary-yellow pl-4"
            >
              <Link href="/patients" className="flex items-center">
                <Users className="mr-3 h-5 w-5" />
                <span>Patients</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
        
          
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="hover:bg-primary-blue/30 hover:text-primary-yellow data-[active=true]:bg-primary-blue/30 data-[active=true]:text-primary-yellow data-[active=true]:border-l-4 data-[active=true]:border-primary-yellow pl-4"
            >
              <Link href="#" className="flex items-center">
                <HelpCircle className="mr-3 h-5 w-5" />
                <span>Help</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-primary-blue/30 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/compassionate-doctor-consultation.png" alt="Dr. Smith" />
              <AvatarFallback className="bg-primary-yellow text-white">DS</AvatarFallback>
            </Avatar>
            <div className="ml-2">
              <p className="text-sm font-medium text-white">Dr. Smith</p>
              <p className="text-xs text-white/70">Oncologist</p>
            </div>
          </div>
          <LogOut className="h-5 w-5 text-white/70 cursor-pointer hover:text-primary-yellow" />
        </div>
      </SidebarFooter>
      <SidebarRail className="after:bg-primary-blue/30 hover:after:bg-primary-yellow" />
      <SidebarTrigger className="absolute top-4 right-4 md:hidden text-white" />
    </Sidebar>
  )
}

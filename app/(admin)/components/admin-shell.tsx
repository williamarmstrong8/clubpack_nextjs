"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { AdminSidebar } from "./admin-sidebar"
import { AdminUserMenu } from "./admin-user-menu"

function getAdminTitle(pathname: string) {
  if (pathname.startsWith("/home")) return "Dashboard"
  if (pathname.startsWith("/events")) return "Events"
  if (pathname.startsWith("/members")) return "Members"
  if (pathname.startsWith("/website")) return "Website & App"
  if (pathname.startsWith("/messages")) return "Messages"
  if (pathname.startsWith("/event-ideas")) return "Event Ideas"
  if (pathname.startsWith("/analytics")) return "Analytics"
  if (pathname.startsWith("/billing")) return "Billing"
  if (pathname.startsWith("/waivers")) return "Waivers"
  if (pathname.startsWith("/account")) return "Account"
  if (pathname.startsWith("/settings")) return "Settings"
  return "Admin"
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const title = getAdminTitle(pathname)

  return (
    <SidebarProvider defaultOpen>
      <Sidebar variant="inset" collapsible="icon">
        <AdminSidebar />
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 flex h-14 items-center gap-2 border-b px-4 backdrop-blur">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <h1 className="truncate text-sm font-semibold">{title}</h1>
          </div>
          <AdminUserMenu />
        </header>
        <div className="flex flex-1 flex-col p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}


"use client"

import * as React from "react"
import Link from "next/link"
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
import { AdminSidebarActiveProvider } from "./admin-sidebar-context"
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

const FREE_PLAN_MEMBER_LIMIT = 50

export function AdminShell({
  children,
  user,
  memberCount = 0,
  titleOverride,
  sidebarActivePath,
  hideMemberLimitBanner = false,
}: {
  children: React.ReactNode
  user?: { name: string; role: string }
  memberCount?: number
  /** When set (e.g. in tour/demo), use this instead of pathname-derived title */
  titleOverride?: string
  /** When set (e.g. in tour), sidebar highlights this path instead of pathname */
  sidebarActivePath?: string | null
  /** When true (e.g. in tour), do not show the over-limit upgrade banner */
  hideMemberLimitBanner?: boolean
}) {
  const pathname = usePathname()
  const title = titleOverride ?? getAdminTitle(pathname)
  const overLimit = !hideMemberLimitBanner && memberCount > FREE_PLAN_MEMBER_LIMIT

  return (
    <AdminSidebarActiveProvider activePath={sidebarActivePath ?? null}>
      <SidebarProvider defaultOpen>
      <Sidebar variant="inset" collapsible="icon">
        <AdminSidebar />
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        {overLimit && (
          <div className="bg-destructive flex items-center justify-center gap-2 rounded-t-lg px-4 py-2 text-center text-sm font-medium text-white">
            <span>
              You have exceeded the club member limit. Upgrade to the Growth plan to keep using Clubpack.
            </span>
            <Link
              href="/billing"
              className="text-white underline underline-offset-2 hover:no-underline"
            >
              Upgrade
            </Link>
          </div>
        )}
        <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 flex h-14 items-center gap-2 border-b px-4 backdrop-blur">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <h1 className="truncate text-sm font-semibold">{title}</h1>
          </div>
          <AdminUserMenu user={user} />
        </header>
        <div className="flex flex-1 flex-col p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
    </AdminSidebarActiveProvider>
  )
}


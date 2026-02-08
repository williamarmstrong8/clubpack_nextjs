"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  BookOpen,
  Calendar,
  CreditCard,
  Globe,
  Home,
  MessageSquare,
  Settings,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react"

import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

type NavItem = {
  label: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  match?: (pathname: string) => boolean
}

function isRouteActive(pathname: string, href: string) {
  if (href === "/home") return pathname === "/home"
  return pathname === href || pathname.startsWith(`${href}/`)
}

const core: NavItem[] = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Website & App", href: "/website", icon: Globe },
  { label: "Members", href: "/members", icon: Users },
  { label: "Events", href: "/events", icon: Calendar },
  { label: "Messages", href: "/messages", icon: MessageSquare },
]

const growth: NavItem[] = [
  { label: "Event Ideas", href: "/event-ideas", icon: BookOpen },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
]

const admin: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Billing", href: "/billing", icon: CreditCard },
  { label: "Waivers", href: "/waivers", icon: ShieldCheck },
  { label: "Account", href: "/account", icon: UserRound },
]

function NavGroup({ label, items }: { label: string; items: NavItem[] }) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const active = item.match
              ? item.match(pathname)
              : isRouteActive(pathname, item.href)
            const Icon = item.icon

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <Icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export function AdminSidebar() {
  return (
    <>
      <SidebarHeader className="py-3">
        <Link
          href="/home"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            CP
          </div>
          <span className="truncate group-data-[collapsible=icon]:hidden">
            ClubPack Admin
          </span>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <NavGroup label="Core" items={core} />
        <NavGroup label="Growth" items={growth} />
        <NavGroup label="Admin" items={admin} />
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Community">
              <a href="#" onClick={(e) => e.preventDefault()}>
                <Users />
                <span>Community</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  )
}


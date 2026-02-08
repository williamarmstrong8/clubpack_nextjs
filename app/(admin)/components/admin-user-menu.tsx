"use client"

import * as React from "react"
import { LogOut, Settings, UserRound } from "lucide-react"
import { useRouter } from "next/navigation"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"

export function AdminUserMenu({
  user,
}: {
  user?: { name: string; role: string }
}) {
  const router = useRouter()
  const name = user?.name ?? "Admin"
  const role = user?.role ?? "Admin"

  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0]?.toUpperCase())
    .slice(0, 2)
    .join("")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 gap-2 px-2">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-xs">{initials || "A"}</AvatarFallback>
          </Avatar>
          <div className="hidden text-left leading-tight md:block">
            <div className="text-sm font-medium">{name}</div>
            <div className="text-xs text-muted-foreground">{role}</div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => console.log("Open account")}>
          <UserRound className="mr-2 h-4 w-4" />
          Account
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => console.log("Open settings")}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onSelect={async (e) => {
            e.preventDefault()
            const supabase = createClient()
            await supabase.auth.signOut()
            router.push("/auth/login")
            router.refresh()
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


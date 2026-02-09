"use client"

import * as React from "react"
import { Save } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { updateAdminProfile } from "./actions"

export function AccountClient({
  initial,
}: {
  initial: {
    email: string
    first_name: string
    last_name: string
    role: string | null
    club_id: string | null
  }
}) {
  const [isPending, startTransition] = React.useTransition()
  const [form, setForm] = React.useState({
    first_name: initial.first_name,
    last_name: initial.last_name,
  })

  const displayName = `${form.first_name} ${form.last_name}`.trim() || "Admin"

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Account</h2>
        <p className="text-sm text-muted-foreground">
          Manage your admin profile details.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">Profile</CardTitle>
              <p className="text-sm text-muted-foreground">{displayName}</p>
            </div>
            <Button
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  await updateAdminProfile({
                    first_name: form.first_name.trim(),
                    last_name: form.last_name.trim(),
                  })
                })
              }}
            >
              <Save className="mr-2 h-4 w-4" />
              {isPending ? "Saving..." : "Save"}
            </Button>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="first_name">First name</Label>
                <Input
                  id="first_name"
                  value={form.first_name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, first_name: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last_name">Last name</Label>
                <Input
                  id="last_name"
                  value={form.last_name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, last_name: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Email</Label>
              <Input value={initial.email} disabled />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Access</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Role</span>
              <Badge variant="secondary">{initial.role ?? "—"}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Club</span>
              <span className="font-mono text-xs">
                {initial.club_id ? initial.club_id.slice(0, 8) : "—"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


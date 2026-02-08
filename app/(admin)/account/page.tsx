"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function AccountPage() {
  const [form, setForm] = React.useState({
    name: "Club Admin",
    email: "admin@clubpack.dev",
    marketingEmails: false,
    productUpdates: true,
  })

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Account</h2>
        <p className="text-sm text-muted-foreground">
          Personal account settings (mock).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={() => console.log("Save account (mock)", form)}>
              Save
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notifications</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Product updates</div>
              <div className="text-xs text-muted-foreground">
                Release notes, new features, and improvements.
              </div>
            </div>
            <Switch
              checked={form.productUpdates}
              onCheckedChange={(checked) =>
                setForm((f) => ({ ...f, productUpdates: checked }))
              }
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Marketing emails</div>
              <div className="text-xs text-muted-foreground">
                Tips, promos, and community stories.
              </div>
            </div>
            <Switch
              checked={form.marketingEmails}
              onCheckedChange={(checked) =>
                setForm((f) => ({ ...f, marketingEmails: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
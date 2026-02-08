"use client"

import * as React from "react"
import { Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

export default function SettingsPage() {
  const [saving, setSaving] = React.useState(false)
  const [form, setForm] = React.useState({
    clubName: "ClubPack Run Club",
    contactEmail: "hello@clubpack.dev",
    phone: "(555) 555-5555",
    meetingLocation: "City Park Loop",
    meetingTime: "Saturdays at 8:00 AM",
    description:
      "A welcoming community of runners. Weekly long runs, workouts, and socials.",
    isPublic: true,
    allowGuestRsvps: false,
  })

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Update your club profile and admin preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Club profile</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="clubName">Club name</Label>
              <Input
                id="clubName"
                value={form.clubName}
                onChange={(e) => setForm((f) => ({ ...f, clubName: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactEmail">Contact email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={form.contactEmail}
                onChange={(e) =>
                  setForm((f) => ({ ...f, contactEmail: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="meetingLocation">Meeting location</Label>
              <Input
                id="meetingLocation"
                value={form.meetingLocation}
                onChange={(e) =>
                  setForm((f) => ({ ...f, meetingLocation: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="meetingTime">Meeting time</Label>
              <Input
                id="meetingTime"
                value={form.meetingTime}
                onChange={(e) =>
                  setForm((f) => ({ ...f, meetingTime: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={5}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Button
              disabled={saving}
              onClick={async () => {
                setSaving(true)
                await new Promise((r) => setTimeout(r, 600))
                setSaving(false)
              }}
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Public club</div>
              <div className="text-xs text-muted-foreground">
                Allow your club to be discoverable.
              </div>
            </div>
            <Switch
              checked={form.isPublic}
              onCheckedChange={(checked) =>
                setForm((f) => ({ ...f, isPublic: checked }))
              }
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Guest RSVPs</div>
              <div className="text-xs text-muted-foreground">
                Allow non-members to RSVP to events.
              </div>
            </div>
            <Switch
              checked={form.allowGuestRsvps}
              onCheckedChange={(checked) =>
                setForm((f) => ({ ...f, allowGuestRsvps: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
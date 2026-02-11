"use client"

import * as React from "react"
import { Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { updateClubProfile } from "./actions"

export function SettingsClient({
  initial,
}: {
  initial: {
    club: {
      name: string
      email: string
      phone_number: string
      meeting_location: string
      meeting_time: string
      description: string
    }
  }
}) {
  const [isPending, startTransition] = React.useTransition()

  const [club, setClub] = React.useState(initial.club)

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Update core club info.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">Club profile</CardTitle>
            <p className="text-sm text-muted-foreground">
              Basic details used across the app and site.
            </p>
          </div>
          <Button
            disabled={isPending}
            onClick={() => {
              startTransition(async () => {
                await updateClubProfile(club)
              })
            }}
          >
            <Save className="mr-2 h-4 w-4" />
            {isPending ? "Saving..." : "Save profile"}
          </Button>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="clubName">Club name</Label>
              <Input
                id="clubName"
                value={club.name}
                onChange={(e) => setClub((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactEmail">Contact email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={club.email}
                onChange={(e) => setClub((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={club.phone_number}
                onChange={(e) =>
                  setClub((f) => ({ ...f, phone_number: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="meetingLocation">Meeting location</Label>
              <Input
                id="meetingLocation"
                value={club.meeting_location}
                onChange={(e) =>
                  setClub((f) => ({ ...f, meeting_location: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="meetingTime">Meeting time</Label>
              <Input
                id="meetingTime"
                value={club.meeting_time}
                onChange={(e) =>
                  setClub((f) => ({ ...f, meeting_time: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={5}
                value={club.description}
                onChange={(e) =>
                  setClub((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import * as React from "react"
import { CalendarPlus, MapPin, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

import { createEvent, updateEvent } from "./actions"

export type EventRow = {
  id: string
  title: string | null
  description?: string | null
  event_date: string | null
  event_time: string | null
  location_name?: string | null
  status?: string | null
  max_attendees?: number | null
  rsvpCount: number
}

function formatDate(isoDate: string) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function badgeForEvent(e: EventRow) {
  const date = e.event_date ?? ""
  const status = (e.status ?? "").toLowerCase()
  const cancelled = status === "cancelled" || status === "canceled"

  const eventDate = date ? new Date(`${date}T00:00:00`) : null
  const today = new Date()
  const isPast = eventDate ? eventDate < new Date(today.toDateString()) : false

  if (cancelled) return <Badge variant="destructive">Cancelled</Badge>
  if (isPast) return <Badge variant="secondary">Completed</Badge>
  return <Badge>Upcoming</Badge>
}

export function EventsClient({ events }: { events: EventRow[] }) {
  const [tab, setTab] = React.useState<"upcoming" | "past">("upcoming")
  const [createOpen, setCreateOpen] = React.useState(false)
  const [editOpen, setEditOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<EventRow | null>(null)

  const [isPending, startTransition] = React.useTransition()

  const [createForm, setCreateForm] = React.useState({
    title: "",
    event_date: "",
    event_time: "",
    location_name: "",
    description: "",
    hasCapacity: true,
    max_attendees: 50,
  })

  const [editForm, setEditForm] = React.useState({
    title: "",
    event_date: "",
    event_time: "",
    location_name: "",
    description: "",
    status: "active",
    hasCapacity: true,
    max_attendees: 50,
  })

  const today = new Date()
  const filtered = events
    .slice()
    .sort((a, b) => (a.event_date ?? "").localeCompare(b.event_date ?? ""))
    .filter((e) => {
      if (!e.event_date) return tab === "upcoming"
      const d = new Date(`${e.event_date}T00:00:00`)
      const isPast = d < new Date(today.toDateString())
      return tab === "upcoming" ? !isPast : isPast
    })

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Events</h2>
          <p className="text-sm text-muted-foreground">
            Manage events and track attendance.
          </p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <CalendarPlus className="mr-2 h-4 w-4" />
              Create event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create event</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="create-title">Title</Label>
                <Input
                  id="create-title"
                  value={createForm.title}
                  onChange={(e) =>
                    setCreateForm((f) => ({ ...f, title: e.target.value }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="create-date">Date</Label>
                  <Input
                    id="create-date"
                    type="date"
                    value={createForm.event_date}
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, event_date: e.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="create-time">Time</Label>
                  <Input
                    id="create-time"
                    type="time"
                    value={createForm.event_time}
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, event_time: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="create-location">Location</Label>
                <Input
                  id="create-location"
                  value={createForm.location_name}
                  onChange={(e) =>
                    setCreateForm((f) => ({
                      ...f,
                      location_name: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="create-description">Description</Label>
                <Textarea
                  id="create-description"
                  rows={4}
                  value={createForm.description}
                  onChange={(e) =>
                    setCreateForm((f) => ({ ...f, description: e.target.value }))
                  }
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Limit capacity</div>
                  <div className="text-xs text-muted-foreground">
                    Cap RSVP count for this event.
                  </div>
                </div>
                <Switch
                  checked={createForm.hasCapacity}
                  onCheckedChange={(checked) =>
                    setCreateForm((f) => ({ ...f, hasCapacity: checked }))
                  }
                />
              </div>

              {createForm.hasCapacity ? (
                <div className="grid gap-2">
                  <Label htmlFor="create-capacity">Capacity</Label>
                  <Input
                    id="create-capacity"
                    type="number"
                    min={1}
                    value={createForm.max_attendees}
                    onChange={(e) =>
                      setCreateForm((f) => ({
                        ...f,
                        max_attendees: Number(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
              ) : null}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                disabled={
                  isPending ||
                  !createForm.title.trim() ||
                  !createForm.event_date ||
                  !createForm.event_time
                }
                onClick={() => {
                  startTransition(async () => {
                    await createEvent({
                      title: createForm.title.trim(),
                      event_date: createForm.event_date,
                      event_time: createForm.event_time,
                      location_name: createForm.location_name.trim(),
                      description: createForm.description.trim(),
                      max_attendees: createForm.hasCapacity
                        ? createForm.max_attendees
                        : null,
                    })
                    setCreateForm({
                      title: "",
                      event_date: "",
                      event_time: "",
                      location_name: "",
                      description: "",
                      hasCapacity: true,
                      max_attendees: 50,
                    })
                    setCreateOpen(false)
                  })
                }}
              >
                {isPending ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">Event list</CardTitle>
            <p className="text-sm text-muted-foreground">
              {filtered.length} {tab === "upcoming" ? "upcoming" : "past"}{" "}
              {filtered.length === 1 ? "event" : "events"}
            </p>
          </div>
          <Tabs
            value={tab}
            onValueChange={(v) => setTab(v === "past" ? "past" : "upcoming")}
          >
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="hidden md:table-cell">Location</TableHead>
                  <TableHead className="hidden lg:table-cell">Attendance</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((e) => (
                  <TableRow
                    key={e.id}
                    className="cursor-pointer"
                    onClick={() => {
                      setEditing(e)
                      setEditForm({
                        title: e.title ?? "",
                        event_date: e.event_date ?? "",
                        event_time: e.event_time ?? "",
                        location_name: e.location_name ?? "",
                        description: e.description ?? "",
                        status: e.status ?? "active",
                        hasCapacity: typeof e.max_attendees === "number",
                        max_attendees: e.max_attendees ?? 50,
                      })
                      setEditOpen(true)
                    }}
                  >
                    <TableCell className="font-medium">{e.title ?? "Untitled"}</TableCell>
                    <TableCell>
                      {e.event_date ? formatDate(e.event_date) : "—"}
                      {e.event_time ? ` • ${e.event_time}` : ""}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {e.location_name ?? "—"}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="inline-flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {e.rsvpCount}
                        {typeof e.max_attendees === "number" ? `/${e.max_attendees}` : ""}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{badgeForEvent(e)}</TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center">
                      <div className="text-sm text-muted-foreground">
                        No {tab} events yet.
                      </div>
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit event</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editForm.event_date}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, event_date: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-time">Time</Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={editForm.event_time}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, event_time: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={editForm.location_name}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, location_name: e.target.value }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                rows={4}
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Limit capacity</div>
                <div className="text-xs text-muted-foreground">
                  Cap RSVP count for this event.
                </div>
              </div>
              <Switch
                checked={editForm.hasCapacity}
                onCheckedChange={(checked) =>
                  setEditForm((f) => ({ ...f, hasCapacity: checked }))
                }
              />
            </div>

            {editForm.hasCapacity ? (
              <div className="grid gap-2">
                <Label htmlFor="edit-capacity">Capacity</Label>
                <Input
                  id="edit-capacity"
                  type="number"
                  min={1}
                  value={editForm.max_attendees}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      max_attendees: Number(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            ) : null}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Close
            </Button>
            <Button
              disabled={
                isPending ||
                !editing ||
                !editForm.title.trim() ||
                !editForm.event_date ||
                !editForm.event_time
              }
              onClick={() => {
                if (!editing) return
                startTransition(async () => {
                  await updateEvent({
                    id: editing.id,
                    title: editForm.title.trim(),
                    event_date: editForm.event_date,
                    event_time: editForm.event_time,
                    location_name: editForm.location_name.trim(),
                    description: editForm.description.trim(),
                    max_attendees: editForm.hasCapacity ? editForm.max_attendees : null,
                    status: editForm.status,
                  })
                  setEditOpen(false)
                  setEditing(null)
                })
              }}
            >
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


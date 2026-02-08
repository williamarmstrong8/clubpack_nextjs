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

type EventItem = {
  id: string
  title: string
  date: string // ISO yyyy-mm-dd
  time: string
  location: string
  capacity?: number
  rsvps: number
  cancelled?: boolean
}

const initialEvents: EventItem[] = [
  {
    id: "e1",
    title: "Saturday Long Run",
    date: "2026-02-14",
    time: "08:00",
    location: "City Park Loop",
    capacity: 60,
    rsvps: 34,
  },
  {
    id: "e2",
    title: "Track Workout",
    date: "2026-02-11",
    time: "18:30",
    location: "Memorial Track",
    capacity: 40,
    rsvps: 22,
  },
  {
    id: "e3",
    title: "New Member Social",
    date: "2026-01-28",
    time: "19:00",
    location: "Clubhouse",
    rsvps: 18,
  },
]

function formatDate(isoDate: string) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function badgeForEvent(e: EventItem) {
  const eventDate = new Date(`${e.date}T00:00:00`)
  const today = new Date()
  const isPast = eventDate < new Date(today.toDateString())

  if (e.cancelled) return <Badge variant="destructive">Cancelled</Badge>
  if (isPast) return <Badge variant="secondary">Completed</Badge>
  return <Badge>Upcoming</Badge>
}

export default function EventsPage() {
  const [tab, setTab] = React.useState<"upcoming" | "past">("upcoming")
  const [events, setEvents] = React.useState<EventItem[]>(initialEvents)
  const [open, setOpen] = React.useState(false)
  const [form, setForm] = React.useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    hasCapacity: true,
    capacity: 50,
  })

  const today = new Date()
  const filtered = events
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .filter((e) => {
      const d = new Date(`${e.date}T00:00:00`)
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

        <Dialog open={open} onOpenChange={setOpen}>
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
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Saturday Long Run"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, location: e.target.value }))
                  }
                  placeholder="City Park Loop"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="What should attendees expect?"
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
                  checked={form.hasCapacity}
                  onCheckedChange={(checked) =>
                    setForm((f) => ({ ...f, hasCapacity: checked }))
                  }
                />
              </div>

              {form.hasCapacity ? (
                <div className="grid gap-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min={1}
                    value={form.capacity}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, capacity: Number(e.target.value) }))
                    }
                  />
                </div>
              ) : null}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const id = `e_${Math.random().toString(16).slice(2)}`
                  setEvents((prev) => [
                    ...prev,
                    {
                      id,
                      title: form.title || "Untitled event",
                      date: form.date || new Date().toISOString().slice(0, 10),
                      time: form.time || "08:00",
                      location: form.location || "TBD",
                      capacity: form.hasCapacity ? form.capacity : undefined,
                      rsvps: 0,
                    },
                  ])
                  setForm({
                    title: "",
                    date: "",
                    time: "",
                    location: "",
                    description: "",
                    hasCapacity: true,
                    capacity: 50,
                  })
                  setOpen(false)
                }}
              >
                Create
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
            onValueChange={(v) =>
              setTab(v === "past" ? "past" : "upcoming")
            }
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
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.title}</TableCell>
                    <TableCell>
                      {formatDate(e.date)} • {e.time}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {e.location}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="inline-flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {e.rsvps}
                        {typeof e.capacity === "number" ? `/${e.capacity}` : ""}
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
    </div>
  )
}
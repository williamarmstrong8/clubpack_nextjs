"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarPlus, MapPin, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

import { cn } from "@/lib/utils"
import { updateEvent } from "./actions"
import { CreateEventDialog } from "./create-event-dialog"

export type EventRow = {
  id: string
  title: string | null
  description?: string | null
  event_date: string | null
  event_time: string | null
  image_url?: string | null
  location_name?: string | null
  status?: string | null
  max_attendees?: number | null
  rsvpCount: number
}

function safeDateOnly(input: string) {
  // Accept both "YYYY-MM-DD" and full timestamps like "YYYY-MM-DDTHH:mm:ssZ"
  const m = input.match(/^(\d{4}-\d{2}-\d{2})/)
  if (m?.[1]) return new Date(`${m[1]}T00:00:00`)
  const d = new Date(input)
  return Number.isNaN(d.getTime()) ? null : d
}

function formatDate(isoDate: string) {
  const d = safeDateOnly(isoDate)
  if (!d) return isoDate
  return format(d, "MMM d, yyyy")
}

function isoFromDate(d: Date) {
  return format(d, "yyyy-MM-dd")
}

function dateFromIso(iso: string) {
  if (!iso) return undefined
  const [y, m, d] = iso.split("-").map((p) => Number(p))
  if (!y || !m || !d) return undefined
  return new Date(y, m - 1, d)
}

function timeOptions(stepMinutes = 15) {
  const times: Array<{ value: string; label: string }> = []
  for (let mins = 0; mins < 24 * 60; mins += stepMinutes) {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    const value = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
    const label = format(new Date(2000, 0, 1, h, m), "h:mm a")
    times.push({ value, label })
  }
  return times
}

function parseTimeParts(input: string) {
  // Handles "HH:mm", "HH:mm:ss", and "HH:mm:ss+00" safely
  const m = input.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/)
  if (!m) return null
  const hh = Number(m[1])
  const mm = Number(m[2])
  const ss = m[3] ? Number(m[3]) : 0
  if ([hh, mm, ss].some((n) => Number.isNaN(n))) return null
  return { hh, mm, ss }
}

function normalizeTimeForSelect(input: string) {
  const p = parseTimeParts(input)
  if (!p) return input
  return `${String(p.hh).padStart(2, "0")}:${String(p.mm).padStart(2, "0")}`
}

function formatTimeLabel(time: string) {
  const p = parseTimeParts(time)
  if (!p) return time
  const d = new Date(2000, 0, 1, p.hh, p.mm, p.ss)
  if (Number.isNaN(d.getTime())) return time
  return format(d, "h:mm a")
}

function eventDateTime(e: Pick<EventRow, "event_date" | "event_time">) {
  if (!e.event_date) return null
  const dt = safeDateOnly(e.event_date)
  if (!dt) return null
  if (e.event_time) {
    const p = parseTimeParts(e.event_time)
    if (p) dt.setHours(p.hh, p.mm, 0, 0)
  }
  return dt
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
  const [pastVisible, setPastVisible] = React.useState(6)
  const [viewOpen, setViewOpen] = React.useState(false)
  const [viewing, setViewing] = React.useState<EventRow | null>(null)
  const [editOpen, setEditOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<EventRow | null>(null)

  const [isPending, startTransition] = React.useTransition()

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

  const [editCoverFile, setEditCoverFile] = React.useState<File | null>(null)
  const [editCoverPreview, setEditCoverPreview] = React.useState<string | null>(
    null,
  )

  React.useEffect(() => {
    return () => {
      if (editCoverPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(editCoverPreview)
      }
    }
  }, [editCoverPreview])

  const today = new Date()
  const startOfToday = new Date(today.toDateString())

  const filtered = events
    .slice()
    .filter((e) => {
      const dt = eventDateTime(e)
      if (!dt) return tab === "upcoming"
      const isPast = dt < startOfToday
      return tab === "upcoming" ? !isPast : isPast
    })
    .sort((a, b) => {
      const ad = eventDateTime(a)?.getTime() ?? 0
      const bd = eventDateTime(b)?.getTime() ?? 0
      return tab === "upcoming" ? ad - bd : bd - ad
    })

  const times = React.useMemo(() => timeOptions(15), [])

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Events</h2>
          <p className="text-sm text-muted-foreground">
            Manage events and track attendance.
          </p>
        </div>

        <CreateEventDialog
          trigger={
            <Button>
              <CalendarPlus className="mr-2 h-4 w-4" />
              Create event
            </Button>
          }
        />
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
            onValueChange={(v) => {
              setTab(v === "past" ? "past" : "upcoming")
              setPastVisible(6)
            }}
          >
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No {tab} events yet.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(tab === "past" ? filtered.slice(0, pastVisible) : filtered).map((e) => (
                <button
                  key={e.id}
                  type="button"
                  className="group relative flex flex-col overflow-hidden rounded-lg border bg-card text-left shadow-sm transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => {
                    setViewing(e)
                    setViewOpen(true)
                  }}
                >
                  <div className="aspect-video w-full shrink-0 overflow-hidden bg-muted">
                    {e.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={e.image_url}
                        alt=""
                        className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <CalendarPlus className="h-12 w-12 opacity-40" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold leading-tight line-clamp-2">
                        {e.title ?? "Untitled"}
                      </h3>
                      {badgeForEvent(e)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {e.event_date ? formatDate(e.event_date) : "—"}
                      {e.event_time ? ` • ${formatTimeLabel(e.event_time)}` : ""}
                    </p>
                    {e.location_name ? (
                      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="truncate">{e.location_name}</span>
                      </span>
                    ) : null}
                    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Users className="h-4 w-4 shrink-0" />
                      {e.rsvpCount}
                      {typeof e.max_attendees === "number" ? `/${e.max_attendees}` : ""}{" "}
                      attending
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
          {tab === "past" && filtered.length > pastVisible && (
            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                onClick={() => setPastVisible((v) => v + 6)}
              >
                Load more
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={viewOpen}
        onOpenChange={(v) => {
          setViewOpen(v)
          if (!v) setViewing(null)
        }}
      >
        <DialogContent className="sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle>{viewing?.title ?? "Event"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="border-muted-foreground/25 bg-muted/15 aspect-video overflow-hidden rounded-lg border">
              {viewing?.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={viewing.image_url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No cover image
                </div>
              )}
            </div>

            <div className="grid gap-2 text-sm">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground">
                <span>
                  {viewing?.event_date ? formatDate(viewing.event_date) : "—"}
                  {viewing?.event_time
                    ? ` • ${formatTimeLabel(viewing.event_time)}`
                    : ""}
                </span>
                {viewing?.location_name ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="opacity-60">•</span>
                    <MapPin className="h-4 w-4" />
                    <span>{viewing.location_name}</span>
                  </span>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {viewing?.rsvpCount ?? 0}
                  {typeof viewing?.max_attendees === "number"
                    ? `/${viewing.max_attendees}`
                    : ""}{" "}
                  attending
                </span>
              </div>
            </div>

            {viewing?.description ? (
              <div className="text-sm leading-relaxed">{viewing.description}</div>
            ) : (
              <div className="text-sm text-muted-foreground">No description.</div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewOpen(false)}>
              Close
            </Button>
            <Button
              disabled={!viewing}
              onClick={() => {
                if (!viewing) return
                setEditing(viewing)
                setEditForm({
                  title: viewing.title ?? "",
                  event_date: viewing.event_date ?? "",
                  event_time: viewing.event_time
                    ? normalizeTimeForSelect(viewing.event_time)
                    : "",
                  location_name: viewing.location_name ?? "",
                  description: viewing.description ?? "",
                  status: viewing.status ?? "active",
                  hasCapacity: typeof viewing.max_attendees === "number",
                  max_attendees: viewing.max_attendees ?? 50,
                })
                setEditCoverFile(null)
                setEditCoverPreview(viewing.image_url ?? null)
                setViewOpen(false)
                setEditOpen(true)
              }}
            >
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !editForm.event_date && "text-muted-foreground",
                      )}
                    >
                      {editForm.event_date
                        ? formatDate(editForm.event_date)
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFromIso(editForm.event_date)}
                      onSelect={(d) => {
                        if (!d) return
                        setEditForm((f) => ({ ...f, event_date: isoFromDate(d) }))
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label>Time</Label>
                <Select
                  value={editForm.event_time}
                  onValueChange={(v) =>
                    setEditForm((f) => ({ ...f, event_time: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[320px]">
                    {times.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Event image (16:9)</Label>
              <div className="relative">
                <input
                  id="edit-cover"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null
                    if (!file) return
                    if (editCoverPreview?.startsWith("blob:")) {
                      URL.revokeObjectURL(editCoverPreview)
                    }
                    setEditCoverFile(file)
                    setEditCoverPreview(URL.createObjectURL(file))
                  }}
                />
                <button
                  type="button"
                  className={cn(
                    "border-muted-foreground/25 hover:border-muted-foreground/40 bg-muted/20 hover:bg-muted/30 aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed transition-colors",
                    "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden",
                  )}
                  onClick={() =>
                    document.getElementById("edit-cover")?.click()
                  }
                >
                  {editCoverPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={editCoverPreview}
                      alt="Event cover preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                      Upload cover image (16:9)
                    </div>
                  )}
                </button>
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
                  const fd = new FormData()
                  fd.set("id", editing.id)
                  fd.set("title", editForm.title.trim())
                  fd.set("event_date", editForm.event_date)
                  fd.set("event_time", editForm.event_time)
                  fd.set("location_name", editForm.location_name.trim())
                  fd.set("description", editForm.description.trim())
                  fd.set("status", editForm.status)
                  fd.set(
                    "max_attendees",
                    editForm.hasCapacity ? String(editForm.max_attendees) : "",
                  )
                  if (editCoverFile) fd.set("cover_image", editCoverFile)

                  await updateEvent(fd)

                  setEditOpen(false)
                  setEditing(null)
                  setEditCoverFile(null)
                  if (editCoverPreview?.startsWith("blob:")) {
                    URL.revokeObjectURL(editCoverPreview)
                  }
                  setEditCoverPreview(null)
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


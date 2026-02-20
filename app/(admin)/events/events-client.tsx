"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { format, isBefore, startOfDay } from "date-fns"
import { CalendarPlus, MapPin, Trash2, Users } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

import { cn } from "@/lib/utils"
import { getEventRsvps, updateEvent, deleteEvent, deleteRsvp, type EventRsvpForView } from "./actions"
import { CreateEventDialog } from "./create-event-dialog"

function initials(name: string | null): string {
  if (!name || !name.trim()) return "?"
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export type EventRow = {
  id: string
  title: string | null
  description?: string | null
  event_date: string | null
  event_time: string | null
  end_time?: string | null
  image_url?: string | null
  location_name?: string | null
  status?: string | null
  max_attendees?: number | null
  rsvp_open_time?: string | null
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

function timeToMinutes(value: string) {
  const [h, m] = value.split(":").map(Number)
  return h * 60 + (m ?? 0)
}

function filterFutureTimes(
  times: Array<{ value: string; label: string }>,
  eventDateIso: string,
  options?: { afterTimeValue?: string; forEndTime?: boolean }
): Array<{ value: string; label: string }> {
  if (!eventDateIso) return times
  const selected = dateFromIso(eventDateIso)
  if (!selected) return times
  const today = startOfDay(new Date())
  const selectedDay = startOfDay(selected)
  const isToday = selectedDay.getTime() === today.getTime()
  const now = new Date()
  const nowMins = now.getHours() * 60 + now.getMinutes()
  const roundUpMins = Math.ceil(nowMins / 15) * 15
  let minMins = 0
  if (isToday) minMins = roundUpMins
  if (options?.afterTimeValue) {
    const afterMins = timeToMinutes(options.afterTimeValue)
    minMins = Math.max(minMins, options.forEndTime ? afterMins + 15 : afterMins)
  }
  return times.filter((t) => timeToMinutes(t.value) >= minMins)
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

function isEventPast(e: EventRow): boolean {
  const date = e.event_date ?? ""
  const eventDate = date ? new Date(`${date}T00:00:00`) : null
  const today = new Date()
  return eventDate ? eventDate < new Date(today.toDateString()) : false
}

function badgeForEvent(e: EventRow) {
  const status = (e.status ?? "").toLowerCase()
  const cancelled = status === "cancelled" || status === "canceled"
  const isPast = isEventPast(e)

  if (cancelled) return <Badge variant="destructive">Cancelled</Badge>
  if (isPast) return <Badge variant="secondary">Completed</Badge>
  return null
}

export function EventsClient({ events }: { events: EventRow[] }) {
  const router = useRouter()
  const [tab, setTab] = React.useState<"upcoming" | "past">("upcoming")
  const [pastVisible, setPastVisible] = React.useState(6)
  const [viewOpen, setViewOpen] = React.useState(false)
  const [viewing, setViewing] = React.useState<EventRow | null>(null)
  const [viewRsvps, setViewRsvps] = React.useState<EventRsvpForView[] | null>(null)
  const [rsvpsAllOpen, setRsvpsAllOpen] = React.useState(false)
  const [editOpen, setEditOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<EventRow | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null)
  const [deletingRsvpId, setDeletingRsvpId] = React.useState<string | null>(null)

  const RSVP_CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes
  const rsvpCacheRef = React.useRef<
    Map<string, { data: EventRsvpForView[]; timestamp: number }>
  >(new Map())

  const [isPending, startTransition] = React.useTransition()

  const [editForm, setEditForm] = React.useState({
    title: "",
    event_date: "",
    event_time: "",
    end_time: "",
    location_name: "",
    description: "",
    status: "upcoming",
    advancedSettings: false,
    hasCapacity: true,
    max_attendees: 50,
    rsvp_open_time_date: "",
    rsvp_open_time_time: "",
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
  const editStartTimeOptions = React.useMemo(
    () => filterFutureTimes(times, editForm.event_date),
    [times, editForm.event_date],
  )
  const editEndTimeOptions = React.useMemo(
    () =>
      filterFutureTimes(times, editForm.event_date, {
        afterTimeValue: editForm.event_time || undefined,
        forEndTime: true,
      }),
    [times, editForm.event_date, editForm.event_time],
  )

  React.useEffect(() => {
    if (viewOpen && viewing?.id) {
      const cached = rsvpCacheRef.current.get(viewing.id)
      if (
        cached &&
        Date.now() - cached.timestamp < RSVP_CACHE_TTL_MS
      ) {
        setViewRsvps(cached.data)
      } else {
        getEventRsvps(viewing.id).then((data) => {
          rsvpCacheRef.current.set(viewing.id, {
            data,
            timestamp: Date.now(),
          })
          setViewRsvps(data)
        })
      }
    } else {
      setViewRsvps(null)
      setRsvpsAllOpen(false)
    }
  }, [viewOpen, viewing?.id])

  async function handleDeleteRsvp(rsvpId: string) {
    setDeletingRsvpId(rsvpId)
    try {
      const result = await deleteRsvp(rsvpId)
      if (result.ok && viewRsvps && viewing) {
        const next = viewRsvps.filter((r) => r.id !== rsvpId)
        setViewRsvps(next)
        rsvpCacheRef.current.set(viewing.id, { data: next, timestamp: Date.now() })
        router.refresh()
      }
    } finally {
      setDeletingRsvpId(null)
    }
  }

  const displayRsvps = viewRsvps?.slice(0, 8) ?? []

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
                      {e.event_time
                        ? ` • ${formatTimeLabel(e.event_time)}${e.end_time ? ` – ${formatTimeLabel(e.end_time)}` : ""}`
                        : ""}
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
        <DialogContent className="sm:max-w-[720px] h-[85vh] max-h-[85vh] flex flex-col gap-4 !grid-rows-none p-0">
          <DialogHeader className="shrink-0 px-6 pt-6">
            <DialogTitle>{viewing?.title ?? "Event"}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-y-auto px-6">
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
                      ? ` • ${formatTimeLabel(viewing.event_time)}${viewing?.end_time ? ` – ${formatTimeLabel(viewing.end_time)}` : ""}`
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
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    {viewRsvps === null ? (
                      <>
                        <div className="flex -space-x-2">
                          {[1, 2, 3, 4].map((i) => (
                            <Skeleton
                              key={i}
                              className="size-9 shrink-0 rounded-full border-2 border-background"
                            />
                          ))}
                        </div>
                        <Skeleton className="h-4 w-28" />
                      </>
                    ) : (
                      <>
                        <div className="flex -space-x-2 items-center">
                          {displayRsvps.map((rsvp, index) => (
                            <div
                              key={rsvp.id}
                              className="relative group"
                              style={{ zIndex: displayRsvps.length - index }}
                            >
                              <Avatar className="size-9 border-2 border-background">
                                <AvatarImage
                                  src={rsvp.avatar_url ?? undefined}
                                  alt={rsvp.name ?? undefined}
                                />
                                <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
                                  {initials(rsvp.name)}
                                </AvatarFallback>
                              </Avatar>
                              <Button
                                type="button"
                                variant="secondary"
                                size="icon"
                                className="absolute -top-1 -right-1 size-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow"
                                disabled={deletingRsvpId === rsvp.id}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteRsvp(rsvp.id)
                                }}
                                title="Remove RSVP"
                              >
                                <Trash2 className="size-2.5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {viewRsvps.length}{" "}
                          {viewRsvps.length === 1 ? "person" : "people"} going
                          {typeof viewing?.max_attendees === "number"
                            ? ` · ${viewing.max_attendees} spots`
                            : ""}
                        </span>
                        {viewRsvps.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="shrink-0 text-muted-foreground"
                            onClick={() => setRsvpsAllOpen(true)}
                          >
                            View all
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {viewing?.description ? (
                <div className="text-sm leading-relaxed">{viewing.description}</div>
              ) : (
                <div className="text-sm text-muted-foreground">No description.</div>
              )}
            </div>
          </div>

          <DialogFooter className="shrink-0 px-6 pb-6">
            <Button variant="outline" onClick={() => setViewOpen(false)}>
              Close
            </Button>
            <Button
              disabled={!viewing || (viewing ? isEventPast(viewing) : false)}
              title={viewing && isEventPast(viewing) ? "Past events cannot be edited" : undefined}
              onClick={() => {
                if (!viewing) return
                setEditing(viewing)
                setDeleteConfirmId(null)
                setViewRsvps(null)
                setRsvpsAllOpen(false)
                const rsvpOpen = viewing.rsvp_open_time?.trim()
                  const rsvpOpenDate = rsvpOpen && !Number.isNaN(new Date(rsvpOpen).getTime()) ? new Date(rsvpOpen) : null
                  setEditForm({
                  title: viewing.title ?? "",
                  event_date: viewing.event_date ?? "",
                  event_time: viewing.event_time
                    ? normalizeTimeForSelect(viewing.event_time)
                    : "",
                  end_time: viewing.end_time
                    ? normalizeTimeForSelect(viewing.end_time)
                    : "",
                  location_name: viewing.location_name ?? "",
                  description: viewing.description ?? "",
                  status: viewing.status ?? "upcoming",
                  advancedSettings:
                    typeof viewing.max_attendees === "number" || !!rsvpOpenDate,
                  hasCapacity: typeof viewing.max_attendees === "number",
                  max_attendees: viewing.max_attendees ?? 50,
                  rsvp_open_time_date: rsvpOpenDate
                    ? format(rsvpOpenDate, "yyyy-MM-dd")
                    : "",
                  rsvp_open_time_time: rsvpOpenDate
                    ? format(rsvpOpenDate, "HH:mm")
                    : "",
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

      <Dialog open={rsvpsAllOpen} onOpenChange={setRsvpsAllOpen}>
        <DialogContent className="w-[560px] max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Attendees</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto min-h-0 -mx-6 px-6">
            {viewRsvps === null ? (
              <ul className="space-y-2 py-1" aria-busy="true" aria-label="Loading attendees">
                {[1, 2, 3, 4, 5].map((i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 rounded-lg border border-transparent bg-card px-3 py-2"
                  >
                    <Skeleton className="size-9 shrink-0 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </li>
                ))}
              </ul>
            ) : viewRsvps.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">
                No one has RSVPed yet.
              </p>
            ) : (
              <ul className="space-y-2 py-1">
                {viewRsvps.map((rsvp) => (
                  <li
                    key={rsvp.id}
                    className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2"
                  >
                    <Avatar className="size-9 shrink-0">
                      <AvatarImage
                        src={rsvp.avatar_url ?? undefined}
                        alt={rsvp.name ?? undefined}
                      />
                      <AvatarFallback className="bg-muted text-muted-foreground text-sm font-medium">
                        {initials(rsvp.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium truncate min-w-0 flex-1">
                      {rsvp.name?.trim() || "Guest"}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                      disabled={deletingRsvpId === rsvp.id}
                      onClick={() => handleDeleteRsvp(rsvp.id)}
                      title="Remove RSVP"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open)
          if (!open) setDeleteConfirmId(null)
        }}
      >
        <DialogContent className="sm:max-w-[600px] h-[85vh] max-h-[85vh] overflow-hidden grid !grid-rows-[auto_minmax(0,1fr)_auto]">
          <DialogHeader className="shrink-0">
            <DialogTitle>Edit event</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 overflow-y-auto overflow-x-hidden -mx-6 px-6 min-h-0">
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
                      disabled={(date) =>
                        isBefore(startOfDay(date), startOfDay(new Date()))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label>Time</Label>
                <Select
                  value={
                    editStartTimeOptions.some((t) => t.value === editForm.event_time)
                      ? editForm.event_time
                      : ""
                  }
                  onValueChange={(v) =>
                    setEditForm((f) => ({ ...f, event_time: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[320px]">
                    {editStartTimeOptions.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>End time</Label>
              <Select
                value={
                  editForm.end_time &&
                  editEndTimeOptions.some((t) => t.value === editForm.end_time)
                    ? editForm.end_time
                    : "_none"
                }
                onValueChange={(v) =>
                  setEditForm((f) => ({
                    ...f,
                    end_time: v === "_none" ? "" : v,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Optional" />
                </SelectTrigger>
                <SelectContent className="max-h-[320px]">
                  <SelectItem value="_none">No end time</SelectItem>
                  {editEndTimeOptions.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                <div className="text-sm font-medium">Advanced Settings</div>
                <div className="text-xs text-muted-foreground">
                  Capacity limit and RSVP open time.
                </div>
              </div>
              <Switch
                checked={editForm.advancedSettings}
                onCheckedChange={(checked) =>
                  setEditForm((f) => ({ ...f, advancedSettings: checked }))
                }
              />
            </div>

            {editForm.advancedSettings && (
              <div className="space-y-4 rounded-lg border p-4">
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
                {editForm.hasCapacity && (
                  <div className="grid gap-2">
                    <Label htmlFor="edit-capacity">Capacity</Label>
                    <Input
                      id="edit-capacity"
                      type="number"
                      min={1}
                      value={editForm.max_attendees === 0 ? "" : editForm.max_attendees}
                      onChange={(e) => {
                        const raw = e.target.value
                        setEditForm((f) => ({
                          ...f,
                          max_attendees: raw === "" ? 0 : Math.max(0, Number(raw)),
                        }))
                      }}
                    />
                  </div>
                )}

                <div className="grid gap-2">
                  <Label>RSVP Open Time</Label>
                  <p className="text-xs text-muted-foreground">
                    When attendees can start RSVPing. Before this time, RSVPs are disabled.
                  </p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !editForm.rsvp_open_time_date && "text-muted-foreground",
                          )}
                        >
                          {editForm.rsvp_open_time_date
                            ? formatDate(editForm.rsvp_open_time_date)
                            : "Pick date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateFromIso(editForm.rsvp_open_time_date)}
                          onSelect={(d) => {
                            if (!d) return
                            setEditForm((f) => ({
                              ...f,
                              rsvp_open_time_date: isoFromDate(d),
                            }))
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Select
                      value={
                        editForm.rsvp_open_time_time &&
                        times.some((t) => t.value === editForm.rsvp_open_time_time)
                          ? editForm.rsvp_open_time_time
                          : "_none"
                      }
                      onValueChange={(v) =>
                        setEditForm((f) => ({
                          ...f,
                          rsvp_open_time_time: v === "_none" ? "" : v,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pick time" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[320px]">
                        <SelectItem value="_none">No time</SelectItem>
                        {times.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="shrink-0 flex-wrap gap-2">
            <div className="flex flex-1 justify-start">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={isPending || !editing}
                onClick={() => {
                  if (!editing) return
                  if (deleteConfirmId === editing.id) {
                    startTransition(async () => {
                      await deleteEvent(editing.id)
                      setEditOpen(false)
                      setEditing(null)
                      setDeleteConfirmId(null)
                      setEditCoverFile(null)
                      if (editCoverPreview?.startsWith("blob:")) {
                        URL.revokeObjectURL(editCoverPreview)
                      }
                      setEditCoverPreview(null)
                      router.refresh()
                    })
                  } else {
                    setDeleteConfirmId(editing.id)
                    setTimeout(() => setDeleteConfirmId(null), 3000)
                  }
                }}
              >
                {deleteConfirmId === editing?.id ? (
                  "Click again to delete"
                ) : (
                  <>
                    <Trash2 className="size-4 mr-1.5" />
                    Delete event
                  </>
                )}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setEditOpen(false); setDeleteConfirmId(null) }}>
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
                    fd.set("end_time", editForm.end_time.trim())
fd.set("location_name", editForm.location_name.trim())
                  fd.set("description", editForm.description.trim())
                  fd.set("status", editForm.status)
                  fd.set(
                    "max_attendees",
                    editForm.advancedSettings && editForm.hasCapacity
                      ? String(editForm.max_attendees)
                      : "",
                  )
                  if (
                    editForm.advancedSettings &&
                    editForm.rsvp_open_time_date &&
                    editForm.rsvp_open_time_time
                  ) {
                    const openDate = new Date(
                      `${editForm.rsvp_open_time_date}T${editForm.rsvp_open_time_time}:00`,
                    )
                    if (!Number.isNaN(openDate.getTime())) {
                      fd.set("rsvp_open_time", openDate.toISOString())
                    }
                  } else {
                    fd.set("rsvp_open_time", "")
                  }
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
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


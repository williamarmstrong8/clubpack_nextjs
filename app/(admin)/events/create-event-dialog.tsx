"use client"

import * as React from "react"
import { format, isBefore, startOfDay } from "date-fns"
import { Calendar as CalendarIcon, ImagePlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

import { cn } from "@/lib/utils"
import { LocationSearch, type LocationSelection } from "@/components/maps/location-search"
import { createEvent } from "./actions"

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

/** Filter time options to only future times for the selected date; optionally after a start time (for end time). */
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
  const isToday =
    selectedDay.getTime() === today.getTime()
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

export type CreateEventPrefill = {
  title?: string
  description?: string
  location_name?: string
  image_url?: string
}

export function CreateEventDialog({
  trigger,
  prefill,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: {
  trigger?: React.ReactNode
  prefill?: CreateEventPrefill
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = isControlled
    ? (v: boolean) => controlledOnOpenChange?.(v)
    : setInternalOpen

  const [isPending, startTransition] = React.useTransition()

  const [coverFile, setCoverFile] = React.useState<File | null>(null)
  const [coverPreview, setCoverPreview] = React.useState<string | null>(null)

  const defaultForm = React.useMemo(
    () => ({
      title: prefill?.title ?? "",
      event_date: "",
      event_time: "",
      end_time: "",
      location_name: prefill?.location_name ?? "",
      latitude: null as number | null,
      longitude: null as number | null,
      description: prefill?.description ?? "",
      advancedSettings: false,
      hasCapacity: false,
      max_attendees: 50,
      rsvp_open_time_date: "",
      rsvp_open_time_time: "",
    }),
    [prefill],
  )

  const [form, setForm] = React.useState(defaultForm)

  // Reset form when prefill changes or dialog opens
  React.useEffect(() => {
    if (open) {
      setForm({
        title: prefill?.title ?? "",
        event_date: "",
        event_time: "",
        end_time: "",
        location_name: prefill?.location_name ?? "",
        latitude: null,
        longitude: null,
        description: prefill?.description ?? "",
        advancedSettings: false,
        hasCapacity: false,
        max_attendees: 50,
        rsvp_open_time_date: "",
        rsvp_open_time_time: "",
      })
      setCoverFile(null)
      if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview)
      setCoverPreview(prefill?.image_url ?? null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, prefill])

  React.useEffect(() => {
    return () => {
      if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview)
    }
  }, [coverPreview])

  const times = React.useMemo(() => timeOptions(15), [])
  const startTimeOptions = React.useMemo(
    () => filterFutureTimes(times, form.event_date),
    [times, form.event_date],
  )
  const endTimeOptions = React.useMemo(
    () =>
      filterFutureTimes(times, form.event_date, {
        afterTimeValue: form.event_time || undefined,
        forEndTime: true,
      }),
    [times, form.event_date, form.event_time],
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="sm:max-w-[640px] h-[85vh] max-h-[85vh] overflow-hidden grid !grid-rows-[auto_minmax(0,1fr)_auto]">
        <DialogHeader className="shrink-0">
          <DialogTitle>Create event</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 overflow-y-auto overflow-x-hidden -mx-6 px-6 min-h-0">
          <div className="grid gap-2">
            <Label>Event image (16:9)</Label>
            <div className="relative">
              <input
                id="create-cover"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null
                  if (!file) return
                  if (coverPreview) URL.revokeObjectURL(coverPreview)
                  setCoverFile(file)
                  setCoverPreview(URL.createObjectURL(file))
                }}
              />
              <button
                type="button"
                className={cn(
                  "border-muted-foreground/25 hover:border-muted-foreground/40 bg-muted/20 hover:bg-muted/30 aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed transition-colors",
                  "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden",
                )}
                onClick={() => document.getElementById("create-cover")?.click()}
              >
                {coverPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={coverPreview}
                    alt="Event cover preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                    <ImagePlus className="h-5 w-5" />
                    <div className="text-sm font-medium">Upload cover image</div>
                    <div className="text-xs">
                      Recommended: 16:9 (e.g. 1600×900)
                    </div>
                  </div>
                )}
              </button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="create-title">Title</Label>
            <Input
              id="create-title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Sunday Run + Coffee"
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
                      !form.event_date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.event_date
                      ? format(
                          new Date(`${form.event_date}T00:00:00`),
                          "MMM d, yyyy",
                        )
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFromIso(form.event_date)}
                    onSelect={(d) => {
                      if (!d) return
                      setForm((f) => ({ ...f, event_date: isoFromDate(d) }))
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
                  startTimeOptions.some((t) => t.value === form.event_time)
                    ? form.event_time
                    : ""
                }
                onValueChange={(v) => setForm((f) => ({ ...f, event_time: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent className="max-h-[320px]">
                  {startTimeOptions.map((t) => (
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
                form.end_time && endTimeOptions.some((t) => t.value === form.end_time)
                  ? form.end_time
                  : "_none"
              }
              onValueChange={(v) =>
                setForm((f) => ({ ...f, end_time: v === "_none" ? "" : v }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Optional" />
              </SelectTrigger>
              <SelectContent className="max-h-[320px]">
                <SelectItem value="_none">No end time</SelectItem>
                {endTimeOptions.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Location</Label>
            <LocationSearch
              value={form.location_name}
              onSelect={(sel: LocationSelection) =>
                setForm((f) => ({
                  ...f,
                  location_name: sel.location_name,
                  latitude: sel.latitude,
                  longitude: sel.longitude,
                }))
              }
              onChange={(text) =>
                setForm((f) => ({
                  ...f,
                  location_name: text,
                  latitude: null,
                  longitude: null,
                }))
              }
              placeholder="Address or place (optional — type or pick a suggestion)"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="create-description">Description</Label>
            <Textarea
              id="create-description"
              rows={4}
              className="resize-none min-h-[6rem] max-h-[10rem] overflow-y-auto [field-sizing:fixed]"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="What should members know?"
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
              checked={form.advancedSettings}
              onCheckedChange={(checked) =>
                setForm((f) => ({ ...f, advancedSettings: checked }))
              }
            />
          </div>

          {form.advancedSettings && (
            <div className="space-y-4 rounded-lg border p-4">
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
              {form.hasCapacity && (
                <div className="grid gap-2">
                  <Label htmlFor="create-capacity">Capacity</Label>
                  <Input
                    id="create-capacity"
                    type="number"
                    min={1}
                    value={form.max_attendees}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        max_attendees: Number(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
              )}

              <div className="grid gap-2">
                <Label>RSVP Open Time</Label>
                <p className="text-xs text-muted-foreground">
                  Specify a date and time when attendees can start RSVPing. Before this time, RSVPs will be disabled.
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !form.rsvp_open_time_date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.rsvp_open_time_date
                          ? format(
                              new Date(`${form.rsvp_open_time_date}T00:00:00`),
                              "MMM d, yyyy",
                            )
                          : "Pick date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateFromIso(form.rsvp_open_time_date)}
                        onSelect={(d) => {
                          if (!d) return
                          setForm((f) => ({
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
                      times.some((t) => t.value === form.rsvp_open_time_time)
                        ? form.rsvp_open_time_time
                        : "_none"
                    }
                    onValueChange={(v) =>
                      setForm((f) => ({
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

        <DialogFooter className="shrink-0">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={
              isPending ||
              !form.title.trim() ||
              !form.event_date ||
              !form.event_time
            }
            onClick={() => {
              startTransition(async () => {
                const fd = new FormData()
                fd.set("title", form.title.trim())
                fd.set("event_date", form.event_date)
                fd.set("event_time", form.event_time)
                fd.set("end_time", form.end_time.trim())
                fd.set("location_name", form.location_name.trim())
                fd.set("latitude", form.latitude != null ? String(form.latitude) : "")
                fd.set("longitude", form.longitude != null ? String(form.longitude) : "")
                fd.set("description", form.description.trim())
                fd.set(
                  "max_attendees",
                  form.advancedSettings && form.hasCapacity ? String(form.max_attendees) : "",
                )
                if (
                  form.advancedSettings &&
                  form.rsvp_open_time_date &&
                  form.rsvp_open_time_time
                ) {
                  const openDate = new Date(
                    `${form.rsvp_open_time_date}T${form.rsvp_open_time_time}:00`,
                  )
                  if (!Number.isNaN(openDate.getTime())) {
                    fd.set("rsvp_open_time", openDate.toISOString())
                  }
                }
                if (coverFile) fd.set("cover_image", coverFile)

                await createEvent(fd)

                setForm({
                  title: "",
                  event_date: "",
                  event_time: "",
                  end_time: "",
                  location_name: "",
                  latitude: null,
                  longitude: null,
                  description: "",
                  advancedSettings: false,
                  hasCapacity: false,
                  max_attendees: 50,
                  rsvp_open_time_date: "",
                  rsvp_open_time_time: "",
                })
                setCoverFile(null)
                if (coverPreview) URL.revokeObjectURL(coverPreview)
                setCoverPreview(null)
                setOpen(false)
              })
            }}
          >
            {isPending ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


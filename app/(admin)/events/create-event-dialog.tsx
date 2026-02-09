"use client"

import * as React from "react"
import { format } from "date-fns"
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

export function CreateEventDialog({
  trigger,
}: {
  trigger: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  const [coverFile, setCoverFile] = React.useState<File | null>(null)
  const [coverPreview, setCoverPreview] = React.useState<string | null>(null)

  const [form, setForm] = React.useState({
    title: "",
    event_date: "",
    event_time: "",
    location_name: "",
    description: "",
    hasCapacity: true,
    max_attendees: 50,
  })

  React.useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview)
    }
  }, [coverPreview])

  const times = React.useMemo(() => timeOptions(15), [])

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Create event</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
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
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label>Time</Label>
              <Select
                value={form.event_time}
                onValueChange={(v) => setForm((f) => ({ ...f, event_time: v }))}
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
            <Label htmlFor="create-location">Location</Label>
            <Input
              id="create-location"
              value={form.location_name}
              onChange={(e) =>
                setForm((f) => ({ ...f, location_name: e.target.value }))
              }
              placeholder="Central Park"
            />
          </div>

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
            <Label htmlFor="create-description">Description</Label>
            <Textarea
              id="create-description"
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="What should members know?"
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
          ) : null}
        </div>

        <DialogFooter>
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
                fd.set("location_name", form.location_name.trim())
                fd.set("description", form.description.trim())
                fd.set(
                  "max_attendees",
                  form.hasCapacity ? String(form.max_attendees) : "",
                )
                if (coverFile) fd.set("cover_image", coverFile)

                await createEvent(fd)

                setForm({
                  title: "",
                  event_date: "",
                  event_time: "",
                  location_name: "",
                  description: "",
                  hasCapacity: true,
                  max_attendees: 50,
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


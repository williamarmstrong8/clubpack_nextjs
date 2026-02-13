"use client"

import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AddToGoogleCalendarProps {
  title: string
  description?: string | null
  eventDate: string       // ISO date, e.g. "2025-06-15"
  eventTime?: string | null   // "HH:MM" 24h format
  endTime?: string | null     // "HH:MM" 24h format
  locationName?: string | null
  className?: string
}

function parseTimeToMinutes(timeStr: string | null | undefined): number {
  if (!timeStr || typeof timeStr !== "string") return 0
  const parts = timeStr.trim().split(":")
  const hours = parseInt(parts[0], 10)
  const minutes = parseInt(parts[1], 10)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return 0
  return hours * 60 + minutes
}

function buildGoogleCalendarUrl({
  title,
  description,
  eventDate,
  eventTime,
  endTime,
  locationName,
}: AddToGoogleCalendarProps): string | null {
  const dateStr = (eventDate ?? "").trim()
  if (!dateStr) return null

  const date = new Date(`${dateStr}T00:00:00`)
  if (Number.isNaN(date.getTime())) return null

  const startMins = parseTimeToMinutes(eventTime)
  date.setHours(Math.floor(startMins / 60), startMins % 60, 0, 0)

  let startIso: string
  try {
    startIso = date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  } catch {
    return null
  }

  let endDate: Date
  if (endTime && endTime.trim()) {
    const endMins = parseTimeToMinutes(endTime)
    endDate = new Date(date)
    endDate.setHours(Math.floor(endMins / 60), endMins % 60, 0, 0)
    if (Number.isNaN(endDate.getTime())) endDate = new Date(date.getTime() + 60 * 60 * 1000)
  } else {
    endDate = new Date(date.getTime() + 60 * 60 * 1000)
  }

  let endIso: string
  try {
    endIso = endDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  } catch {
    endIso = startIso
  }

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    details: description || "",
    location: locationName || "",
    dates: `${startIso}/${endIso}`,
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function AddToGoogleCalendar({
  title,
  description,
  eventDate,
  eventTime,
  endTime,
  locationName,
  className,
}: AddToGoogleCalendarProps) {
  const handleClick = () => {
    const url = buildGoogleCalendarUrl({
      title,
      description,
      eventDate,
      eventTime,
      endTime,
      locationName,
    })
    if (url) window.open(url, "_blank")
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={className}
      onClick={handleClick}
    >
      <Calendar className="size-4 mr-1.5" />
      Add to Google Calendar
    </Button>
  )
}

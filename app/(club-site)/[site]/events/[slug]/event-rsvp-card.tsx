"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, Clock, MapPin } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AddToGoogleCalendar } from "@/components/events/add-to-google-calendar"

import type { EventRsvpRow } from "@/lib/data/club-site"
import { rsvpForEvent, removeRsvpForEvent, type RsvpResult } from "./actions"

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

function formatRsvpOpenDate(iso: string | null) {
  if (!iso?.trim()) return ""
  const d = new Date(iso.trim())
  if (Number.isNaN(d.getTime())) return ""
  return d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })
}

function formatRsvpOpenTime(iso: string | null) {
  if (!iso?.trim()) return ""
  const d = new Date(iso.trim())
  if (Number.isNaN(d.getTime())) return ""
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
}

type Props = {
  eventId: string
  clubId: string
  site: string
  rsvps: EventRsvpRow[]
  maxAttendees: number | null
  /** When set and current time is before this, RSVPs are disabled */
  rsvpOpenTime: string | null
  requireLoginToRsvp: boolean
  isLoggedIn: boolean
  alreadyRsvped: boolean
  /** When set, the RSVP-success modal can show event details and Add to Google Calendar */
  eventDetails?: {
    title: string | null
    description: string | null
    eventDate: string | null
    eventTime: string | null
    endTime: string | null
    locationName: string | null
  } | null
}

function formatDate(isoDate: string | null) {
  if (!isoDate?.trim()) return "TBD"
  const d = new Date(`${isoDate.trim().slice(0, 10)}T00:00:00`)
  if (Number.isNaN(d.getTime())) return "TBD"
  return d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })
}

function formatTime(t: string | null) {
  if (!t?.trim()) return ""
  if (/[ap]m$/i.test(t)) return t
  const parts = t.trim().split(":")
  const h = parseInt(parts[0], 10)
  const m = parts[1] ? parseInt(parts[1], 10) : 0
  if (Number.isNaN(h)) return t
  if (h === 0) return `12:${m.toString().padStart(2, "0")} AM`
  if (h < 12) return `${h}:${m.toString().padStart(2, "0")} AM`
  if (h === 12) return `12:${m.toString().padStart(2, "0")} PM`
  return `${h - 12}:${m.toString().padStart(2, "0")} PM`
}

export function EventRsvpCard({
  eventId,
  clubId,
  site,
  rsvps,
  maxAttendees,
  rsvpOpenTime,
  requireLoginToRsvp,
  isLoggedIn,
  alreadyRsvped,
  eventDetails,
}: Props) {
  const router = useRouter()
  const [pending, startTransition] = React.useTransition()
  const [message, setMessage] = React.useState<string | null>(null)
  const [showRsvpSuccessModal, setShowRsvpSuccessModal] = React.useState(false)

  const rsvpNotYetOpen =
    !!rsvpOpenTime &&
    !Number.isNaN(new Date(rsvpOpenTime).getTime()) &&
    new Date() < new Date(rsvpOpenTime)

  const atCapacity = typeof maxAttendees === "number" && rsvps.length >= maxAttendees
  const canRsvp = isLoggedIn && !alreadyRsvped && !atCapacity && !rsvpNotYetOpen

  function handleRsvp() {
    if (!isLoggedIn || alreadyRsvped || atCapacity || rsvpNotYetOpen) return
    setMessage(null)
    startTransition(async () => {
      const result: RsvpResult = await rsvpForEvent(eventId, clubId, site)
      if (result.ok) {
        setShowRsvpSuccessModal(true)
        router.refresh()
      } else {
        setMessage(result.error)
      }
    })
  }

  function handleRemoveRsvp() {
    if (!isLoggedIn || !alreadyRsvped) return
    setMessage(null)
    startTransition(async () => {
      const result: RsvpResult = await removeRsvpForEvent(eventId, clubId, site)
      if (result.ok) {
        router.refresh()
      } else {
        setMessage(result.error)
      }
    })
  }

  const displayRsvps = rsvps.slice(0, 8)

  return (
    <div className="border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 lg:p-8">
      <h2 className="mb-4 text-lg font-bold tracking-tight text-gray-900">RSVPs</h2>
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {displayRsvps.map((rsvp, index) => (
              <Avatar
                key={rsvp.id}
                className="size-10 border-2 border-white"
                style={{ zIndex: displayRsvps.length - index }}
              >
                <AvatarImage src={rsvp.avatar_url ?? undefined} alt={rsvp.name ?? undefined} />
                <AvatarFallback className="bg-gray-200 text-gray-700 text-xs font-medium">
                  {initials(rsvp.name)}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="ml-3 text-sm text-gray-600">
            {rsvps.length} {rsvps.length === 1 ? "person" : "people"} going
            {typeof maxAttendees === "number" ? ` · ${maxAttendees} spots` : ""}
          </span>
        </div>

        {message && (
          <p className="text-sm text-red-600">{message}</p>
        )}

        {rsvpNotYetOpen && (
          <p className="text-sm text-gray-600">
            RSVPs open on {formatRsvpOpenDate(rsvpOpenTime)} at {formatRsvpOpenTime(rsvpOpenTime)}.
          </p>
        )}

        {alreadyRsvped && (
          <Button
            className="w-full rounded-none bg-green-600 text-white hover:bg-green-700"
            size="lg"
            disabled={pending}
            onClick={handleRemoveRsvp}
          >
            {pending ? "Removing…" : "Going"}
          </Button>
        )}

        {!alreadyRsvped && atCapacity && (
          <p className="text-sm text-gray-600">This event is full.</p>
        )}

        {!alreadyRsvped && !atCapacity && !rsvpNotYetOpen && (
          <>
            {requireLoginToRsvp && !isLoggedIn ? (
              <Button asChild className="w-full rounded-none bg-primary hover:bg-primary/90" size="lg">
                <Link href={`/login?next=/events/${eventId}`}>
                  Sign in to RSVP
                </Link>
              </Button>
            ) : isLoggedIn ? (
              <Button
                className="w-full rounded-none bg-primary hover:bg-primary/90"
                size="lg"
                disabled={pending}
                onClick={handleRsvp}
              >
                {pending ? "Adding…" : "RSVP for this event"}
              </Button>
            ) : (
              <Button asChild className="w-full rounded-none bg-primary hover:bg-primary/90" size="lg">
                <Link href={`/signup?next=/events/${eventId}`}>
                  RSVP for this event
                </Link>
              </Button>
            )}
          </>
        )}
      </div>

      <Dialog open={showRsvpSuccessModal} onOpenChange={setShowRsvpSuccessModal}>
        <DialogContent className="sm:max-w-xl border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              You&apos;re going!
            </DialogTitle>
          </DialogHeader>
          {eventDetails && (
            <div className="space-y-4">
              <p className="font-semibold text-gray-900">
                {eventDetails.title ?? "Event"}
              </p>
              {eventDetails.eventDate && (
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="size-4 shrink-0 text-gray-500" />
                  {formatDate(eventDetails.eventDate)}
                </p>
              )}
              {(eventDetails.eventTime || eventDetails.endTime) && (
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="size-4 shrink-0 text-gray-500" />
                  {formatTime(eventDetails.eventTime)}
                  {eventDetails.endTime && ` – ${formatTime(eventDetails.endTime)}`}
                </p>
              )}
              {eventDetails.locationName && (
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="size-4 shrink-0 text-gray-500" />
                  {eventDetails.locationName}
                </p>
              )}
              {eventDetails.description && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {eventDetails.description}
                </p>
              )}
              {eventDetails.eventDate && (
                <AddToGoogleCalendar
                  title={eventDetails.title ?? "Event"}
                  description={eventDetails.description}
                  eventDate={eventDetails.eventDate}
                  eventTime={eventDetails.eventTime}
                  endTime={eventDetails.endTime}
                  locationName={eventDetails.locationName}
                  className="w-full rounded-none"
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

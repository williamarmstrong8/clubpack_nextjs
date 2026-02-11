"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import type { EventRsvpRow } from "@/lib/data/club-site"
import { rsvpForEvent, type RsvpResult } from "./actions"

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

type Props = {
  eventId: string
  clubId: string
  site: string
  rsvps: EventRsvpRow[]
  maxAttendees: number | null
  requireLoginToRsvp: boolean
  isLoggedIn: boolean
  alreadyRsvped: boolean
}

export function EventRsvpCard({
  eventId,
  clubId,
  site,
  rsvps,
  maxAttendees,
  requireLoginToRsvp,
  isLoggedIn,
  alreadyRsvped,
}: Props) {
  const router = useRouter()
  const [pending, startTransition] = React.useTransition()
  const [message, setMessage] = React.useState<string | null>(null)

  const atCapacity = typeof maxAttendees === "number" && rsvps.length >= maxAttendees
  const canRsvp = isLoggedIn && !alreadyRsvped && !atCapacity

  function handleRsvp() {
    if (!canRsvp) return
    setMessage(null)
    startTransition(async () => {
      const result: RsvpResult = await rsvpForEvent(eventId, clubId, site)
      if (result.ok) {
        router.refresh()
      } else {
        setMessage(result.error)
      }
    })
  }

  const displayRsvps = rsvps.slice(0, 8)

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-base">RSVPs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {displayRsvps.map((rsvp, index) => (
              <Avatar
                key={rsvp.id}
                className="size-10 border-2 border-background"
                style={{ zIndex: displayRsvps.length - index }}
              >
                <AvatarImage src={rsvp.avatar_url ?? undefined} alt={rsvp.name ?? undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                  {initials(rsvp.name)}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="ml-3 text-sm text-muted-foreground">
            {rsvps.length} {rsvps.length === 1 ? "person" : "people"} going
            {typeof maxAttendees === "number" ? ` · ${maxAttendees} spots` : ""}
          </span>
        </div>

        {message && (
          <p className="text-sm text-destructive">{message}</p>
        )}

        {alreadyRsvped && (
          <p className="text-sm text-muted-foreground">You&apos;re on the list!</p>
        )}

        {!alreadyRsvped && atCapacity && (
          <p className="text-sm text-muted-foreground">This event is full.</p>
        )}

        {!alreadyRsvped && !atCapacity && (
          <>
            {requireLoginToRsvp && !isLoggedIn ? (
              <Button asChild className="w-full bg-primary hover:bg-primary/90" size="lg">
                <Link href={`/${site}/login?next=/${site}/events/${eventId}`}>
                  Sign in to RSVP
                </Link>
              </Button>
            ) : isLoggedIn ? (
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
                disabled={pending}
                onClick={handleRsvp}
              >
                {pending ? "Adding…" : "RSVP for this event"}
              </Button>
            ) : (
              <Button asChild className="w-full bg-primary hover:bg-primary/90" size="lg">
                <Link href={`/${site}/signup?next=/${site}/events/${eventId}`}>
                  RSVP for this event
                </Link>
              </Button>
            )}
          </>
        )}

        <p className="text-center text-xs text-muted-foreground">
          RSVP helps us plan. You can always show up!
        </p>
      </CardContent>
    </Card>
  )
}

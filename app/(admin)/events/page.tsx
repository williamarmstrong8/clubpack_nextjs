import { getAdminContext } from "@/lib/admin/get-admin-context"
import { createClient } from "@/lib/supabase/server"
import { EventsClient, type EventRow } from "./events-client"

export const dynamic = "force-dynamic"

type DbEventRow = {
  id: string
  title: string | null
  description?: string | null
  event_date: string | null
  event_time: string | null
  image_url?: string | null
  location_name?: string | null
  status?: string | null
  max_attendees?: number | null
}

type DbRsvpRow = {
  id: string
  event_id: string | null
}

export default async function EventsPage() {
  const { profile } = await getAdminContext()
  if (!profile.club_id) {
    return (
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Events</h2>
        <p className="text-sm text-muted-foreground">
          Your admin account is not connected to a club yet.
        </p>
      </div>
    )
  }

  const supabase = await createClient()
  const clubId = profile.club_id

  const [eventsRes, rsvpsRes] = await Promise.all([
    supabase
      .from("events")
      .select(
        "id, title, description, event_date, event_time, image_url, location_name, status, max_attendees",
      )
      .eq("club_id", clubId)
      .order("event_date", { ascending: true }),
    supabase.from("rsvps").select("id, event_id").eq("club_id", clubId),
  ])

  if (eventsRes.error) {
    return (
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Events</h2>
        <p className="text-sm text-destructive">{eventsRes.error.message}</p>
      </div>
    )
  }

  const rsvpCounts = new Map<string, number>()
  if (!rsvpsRes.error) {
    ;((rsvpsRes.data ?? []) as DbRsvpRow[]).forEach((r) => {
      if (!r.event_id) return
      rsvpCounts.set(r.event_id, (rsvpCounts.get(r.event_id) ?? 0) + 1)
    })
  }

  const events = ((eventsRes.data ?? []) as DbEventRow[]).map(
    (e): EventRow => ({
      ...e,
      rsvpCount: rsvpCounts.get(e.id) ?? 0,
    }),
  )

  return <EventsClient events={events} />
}
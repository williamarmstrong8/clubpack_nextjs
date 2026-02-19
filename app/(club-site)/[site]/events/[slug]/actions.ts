"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export type RsvpResult = { ok: true } | { ok: false; error: string }

export async function rsvpForEvent(eventId: string, clubId: string, site: string): Promise<RsvpResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { ok: false, error: "Sign in to RSVP." }
  }

  const eId = (eventId ?? "").trim()
  const cId = (clubId ?? "").trim()
  if (!eId || !cId) return { ok: false, error: "Invalid event or club." }

  // Get membership for this club
  const { data: membership, error: memError } = await supabase
    .from("memberships")
    .select("id, name, avatar_url, waiver_url")
    .eq("club_id", cId)
    .eq("auth_user_id", user.id)
    .maybeSingle()

  if (memError) return { ok: false, error: "Could not load membership." }
  if (!membership) return { ok: false, error: "You're not a member of this club. Join first to RSVP." }

  // If club requires waiver to RSVP, block until member has uploaded waiver (and photo if required)
  const { data: waiverSettings } = await supabase
    .from("waiver_settings")
    .select("is_enabled, require_rsvp, require_photo")
    .eq("club_id", cId)
    .maybeSingle()
  const ws = waiverSettings as { is_enabled?: boolean; require_rsvp?: boolean; require_photo?: boolean } | null
  const requireWaiverToRsvp = !!(ws?.is_enabled && ws?.require_rsvp)

  if (requireWaiverToRsvp) {
    let hasWaiver = !!(membership as { waiver_url?: string | null }).waiver_url?.trim()
    if (!hasWaiver) {
      const { data: sub } = await supabase
        .from("waiver_submissions")
        .select("id")
        .eq("membership_id", membership.id)
        .not("submitted_waiver_url", "is", null)
        .limit(1)
        .maybeSingle()
      hasWaiver = !!sub
    }
    if (!hasWaiver) {
      return { ok: false, error: "Please upload your signed waiver in Account Settings before RSVPing." }
    }

    if (ws?.require_photo) {
      const { data: photoSub } = await supabase
        .from("waiver_submissions")
        .select("id")
        .eq("membership_id", membership.id)
        .not("photo_url", "is", null)
        .limit(1)
        .maybeSingle()
      if (!photoSub) {
        return { ok: false, error: "Please upload your photo in Account Settings before RSVPing." }
      }
    }
  }

  // Already RSVPed?
  const { data: existing } = await supabase
    .from("rsvps")
    .select("id")
    .eq("event_id", eId)
    .eq("membership_id", membership.id)
    .maybeSingle()

  if (existing) return { ok: false, error: "You're already on the list." }

  // Capacity check
  const { data: event } = await supabase
    .from("events")
    .select("max_attendees")
    .eq("id", eId)
    .single()

  const maxAttendees = (event as { max_attendees?: number | null } | null)?.max_attendees
  if (typeof maxAttendees === "number") {
    const { count } = await supabase
      .from("rsvps")
      .select("id", { count: "exact", head: true })
      .eq("event_id", eId)
    if ((count ?? 0) >= maxAttendees) {
      return { ok: false, error: "This event is full." }
    }
  }

  const { error: insertError } = await supabase.from("rsvps").insert({
    event_id: eId,
    club_id: cId,
    membership_id: membership.id,
    name: membership.name ?? null,
    avatar_url: membership.avatar_url ?? null,
  })

  if (insertError) return { ok: false, error: insertError.message }

  revalidatePath(`/${site}/events/${eventId}`)
  revalidatePath(`/${site}/events`)
  return { ok: true }
}

export async function removeRsvpForEvent(eventId: string, clubId: string, site: string): Promise<RsvpResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { ok: false, error: "Sign in to manage your RSVP." }
  }

  const eId = (eventId ?? "").trim()
  const cId = (clubId ?? "").trim()
  if (!eId || !cId) return { ok: false, error: "Invalid event or club." }

  const { data: membership, error: memError } = await supabase
    .from("memberships")
    .select("id")
    .eq("club_id", cId)
    .eq("auth_user_id", user.id)
    .maybeSingle()

  if (memError) return { ok: false, error: "Could not load membership." }
  if (!membership) return { ok: false, error: "Membership not found." }

  const { error: deleteError } = await supabase
    .from("rsvps")
    .delete()
    .eq("event_id", eId)
    .eq("membership_id", membership.id)

  if (deleteError) return { ok: false, error: deleteError.message }

  revalidatePath(`/${site}/events/${eventId}`)
  revalidatePath(`/${site}/events`)
  return { ok: true }
}

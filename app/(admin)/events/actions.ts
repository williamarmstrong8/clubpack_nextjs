"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { getAdminContext } from "@/lib/admin/get-admin-context"
import { getRsvpsForEvent } from "@/lib/data/club-site"

function fileExt(name: string) {
  const ext = name.split(".").pop()
  if (!ext) return "png"
  return ext.toLowerCase()
}

async function uploadEventCoverImage(params: {
  supabase: Awaited<ReturnType<typeof createClient>>
  clubId: string
  eventId: string
  file: File
}) {
  const path = `${params.clubId}/events/${params.eventId}/cover.${fileExt(params.file.name)}`
  const uploadRes = await params.supabase.storage
    .from("club-assets")
    .upload(path, params.file, { upsert: true, contentType: params.file.type })

  if (uploadRes.error) throw new Error(uploadRes.error.message)

  const signed = await params.supabase.storage
    .from("club-assets")
    .createSignedUrl(path, 60 * 60 * 24 * 365)

  if (signed.error || !signed.data?.signedUrl) {
    throw new Error(signed.error?.message ?? "Failed to create signed URL.")
  }
  return signed.data.signedUrl
}

export async function createEvent(formData: FormData) {
  const { profile, userId } = await getAdminContext()
  if (!profile.club_id) return

  const title = String(formData.get("title") ?? "").trim()
  const event_date = String(formData.get("event_date") ?? "")
  const event_time = String(formData.get("event_time") ?? "")
  const end_time = String(formData.get("end_time") ?? "").trim() || null
  const location_name = String(formData.get("location_name") ?? "")
  const description = String(formData.get("description") ?? "")
  const maxAttendeesRaw = String(formData.get("max_attendees") ?? "")
  const cover = formData.get("cover_image")

  const latRaw = String(formData.get("latitude") ?? "")
  const lngRaw = String(formData.get("longitude") ?? "")
  const latitude = latRaw && !Number.isNaN(Number(latRaw)) ? Number(latRaw) : null
  const longitude = lngRaw && !Number.isNaN(Number(lngRaw)) ? Number(lngRaw) : null

  const max_attendees =
    maxAttendeesRaw && !Number.isNaN(Number(maxAttendeesRaw))
      ? Number(maxAttendeesRaw)
      : null

  const rsvpOpenTimeRaw = String(formData.get("rsvp_open_time") ?? "").trim()
  const rsvp_open_time =
    rsvpOpenTimeRaw && !Number.isNaN(new Date(rsvpOpenTimeRaw).getTime())
      ? rsvpOpenTimeRaw
      : null

  const supabase = await createClient()
  const insertRes = await supabase
    .from("events")
    .insert({
      club_id: profile.club_id,
      title,
      description,
      event_date,
      event_time,
      end_time,
      location_name,
      latitude,
      longitude,
      max_attendees,
      rsvp_open_time,
      created_by: userId,
      status: "upcoming",
    })
    .select("id")
    .single()

  if (insertRes.error) throw new Error(insertRes.error.message)

  const eventId = insertRes.data?.id as string | undefined
  if (eventId && cover instanceof File && cover.size > 0) {
    const image_url = await uploadEventCoverImage({
      supabase,
      clubId: profile.club_id,
      eventId,
      file: cover,
    })
    const upd = await supabase
      .from("events")
      .update({ image_url })
      .eq("id", eventId)
      .eq("club_id", profile.club_id)
    if (upd.error) throw new Error(upd.error.message)
  }

  revalidatePath("/events")
}

export async function updateEvent(formData: FormData) {
  const { profile } = await getAdminContext()
  if (!profile.club_id) return

  const id = String(formData.get("id") ?? "")
  const title = String(formData.get("title") ?? "").trim()
  const event_date = String(formData.get("event_date") ?? "")
  const event_time = String(formData.get("event_time") ?? "")
  const end_time = String(formData.get("end_time") ?? "").trim() || null
  const location_name = String(formData.get("location_name") ?? "")
  const description = String(formData.get("description") ?? "")
  const statusRaw = String(formData.get("status") ?? "upcoming").toLowerCase()
  const allowedStatuses = ["upcoming", "completed", "cancelled"] as const
  const status = allowedStatuses.includes(statusRaw as (typeof allowedStatuses)[number])
    ? statusRaw
    : "upcoming"
  const maxAttendeesRaw = String(formData.get("max_attendees") ?? "")
  const cover = formData.get("cover_image")

  const latRaw = String(formData.get("latitude") ?? "")
  const lngRaw = String(formData.get("longitude") ?? "")
  const latitude = latRaw && !Number.isNaN(Number(latRaw)) ? Number(latRaw) : null
  const longitude = lngRaw && !Number.isNaN(Number(lngRaw)) ? Number(lngRaw) : null

  const max_attendees =
    maxAttendeesRaw && !Number.isNaN(Number(maxAttendeesRaw))
      ? Number(maxAttendeesRaw)
      : null

  const rsvpOpenTimeRaw = String(formData.get("rsvp_open_time") ?? "").trim()
  const rsvp_open_time =
    rsvpOpenTimeRaw && !Number.isNaN(new Date(rsvpOpenTimeRaw).getTime())
      ? rsvpOpenTimeRaw
      : null

  const supabase = await createClient()
  const updatePayload: Record<string, unknown> = {
    title,
    description,
    event_date,
    event_time,
    end_time,
    location_name,
    latitude,
    longitude,
    max_attendees,
    status,
    rsvp_open_time,
  }

  if (id && cover instanceof File && cover.size > 0) {
    const image_url = await uploadEventCoverImage({
      supabase,
      clubId: profile.club_id,
      eventId: id,
      file: cover,
    })
    updatePayload.image_url = image_url
  }

  const { error } = await supabase
    .from("events")
    .update(updatePayload)
    .eq("id", id)
    .eq("club_id", profile.club_id)

  if (error) throw new Error(error.message)
  revalidatePath("/events")
}

export async function deleteEvent(eventId: string) {
  const { profile } = await getAdminContext()
  if (!profile.club_id) return

  const supabase = await createClient()
  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", eventId)
    .eq("club_id", profile.club_id)

  if (error) throw new Error(error.message)
  revalidatePath("/events")
}

export type EventRsvpForView = {
  id: string
  name: string | null
  avatar_url: string | null
}

export async function getEventRsvps(eventId: string): Promise<EventRsvpForView[]> {
  const { profile } = await getAdminContext()
  if (!profile.club_id) return []
  return getRsvpsForEvent(profile.club_id, eventId)
}


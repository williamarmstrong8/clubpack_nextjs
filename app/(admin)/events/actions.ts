"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { getAdminContext } from "@/lib/admin/get-admin-context"

export async function createEvent(input: {
  title: string
  event_date: string
  event_time: string
  location_name: string
  description: string
  max_attendees: number | null
}) {
  const { profile, userId } = await getAdminContext()
  if (!profile.club_id) return

  const supabase = await createClient()
  const { error } = await supabase.from("events").insert({
    club_id: profile.club_id,
    title: input.title,
    description: input.description,
    event_date: input.event_date,
    event_time: input.event_time,
    location_name: input.location_name,
    max_attendees: input.max_attendees,
    created_by: userId,
    status: "active",
  })

  if (error) throw new Error(error.message)
  revalidatePath("/events")
}

export async function updateEvent(input: {
  id: string
  title: string
  event_date: string
  event_time: string
  location_name: string
  description: string
  max_attendees: number | null
  status: string
}) {
  const { profile } = await getAdminContext()
  if (!profile.club_id) return

  const supabase = await createClient()
  const { error } = await supabase
    .from("events")
    .update({
      title: input.title,
      description: input.description,
      event_date: input.event_date,
      event_time: input.event_time,
      location_name: input.location_name,
      max_attendees: input.max_attendees,
      status: input.status,
    })
    .eq("id", input.id)
    .eq("club_id", profile.club_id)

  if (error) throw new Error(error.message)
  revalidatePath("/events")
}


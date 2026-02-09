"use server"

import { revalidatePath } from "next/cache"

import { getAdminContext } from "@/lib/admin/get-admin-context"
import { createClient } from "@/lib/supabase/server"

export async function updateClubProfile(input: {
  name: string
  email: string
  phone_number: string
  meeting_location: string
  meeting_time: string
  description: string
}) {
  const { profile } = await getAdminContext()
  if (!profile.club_id) return

  const supabase = await createClient()
  const { error } = await supabase
    .from("clubs")
    .update({
      name: input.name,
      email: input.email,
      phone_number: input.phone_number,
      meeting_location: input.meeting_location,
      meeting_time: input.meeting_time,
      description: input.description,
    })
    .eq("id", profile.club_id)

  if (error) throw new Error(error.message)
  revalidatePath("/settings")
}

export async function updateSettingsPreferences(input: {
  show_event_calendar: boolean
  show_contact_page: boolean
  show_explore_page: boolean
  require_login_to_rsvp: boolean
}) {
  const { profile } = await getAdminContext()
  if (!profile.club_id) return

  const supabase = await createClient()
  const { error } = await supabase
    .from("club_settings")
    .upsert(
      {
        club_id: profile.club_id,
        show_event_calendar: input.show_event_calendar,
        show_contact_page: input.show_contact_page,
        show_explore_page: input.show_explore_page,
        require_login_to_rsvp: input.require_login_to_rsvp,
      },
      { onConflict: "club_id" },
    )

  if (error) throw new Error(error.message)
  revalidatePath("/settings")
}


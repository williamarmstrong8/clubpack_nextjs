"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { getAdminContext } from "@/lib/admin/get-admin-context"

export async function updateClubWebsiteContent(input: {
  hero_headline: string
  hero_subtext: string
  tagline: string
  instagram: string
}) {
  const { profile } = await getAdminContext()
  if (!profile.club_id) return

  const supabase = await createClient()
  const { error } = await supabase
    .from("clubs")
    .update({
      hero_headline: input.hero_headline,
      hero_subtext: input.hero_subtext,
      tagline: input.tagline,
      instagram: input.instagram,
    })
    .eq("id", profile.club_id)

  if (error) throw new Error(error.message)

  revalidatePath("/website")
}

export async function updateClubSettings(input: {
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

  revalidatePath("/website")
}

export async function createFaq(input: {
  question: string
  answer: string
  order_index: number
}) {
  const { profile } = await getAdminContext()
  if (!profile.club_id) return

  const supabase = await createClient()
  const { error } = await supabase.from("faqs").insert({
    club_id: profile.club_id,
    question: input.question,
    answer: input.answer,
    order_index: input.order_index,
  })

  if (error) throw new Error(error.message)
  revalidatePath("/website")
}

export async function updateFaq(input: {
  id: string
  question: string
  answer: string
  order_index: number
}) {
  const { profile } = await getAdminContext()
  if (!profile.club_id) return

  const supabase = await createClient()
  const { error } = await supabase
    .from("faqs")
    .update({
      question: input.question,
      answer: input.answer,
      order_index: input.order_index,
    })
    .eq("id", input.id)
    .eq("club_id", profile.club_id)

  if (error) throw new Error(error.message)
  revalidatePath("/website")
}

export async function deleteFaq(id: string) {
  const { profile } = await getAdminContext()
  if (!profile.club_id) return

  const supabase = await createClient()
  const { error } = await supabase.from("faqs").delete().eq("id", id).eq("club_id", profile.club_id)
  if (error) throw new Error(error.message)
  revalidatePath("/website")
}


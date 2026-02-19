"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { getAdminContext } from "@/lib/admin/get-admin-context"

export async function updateClubBranding(input: {
  name: string
  primary_color?: string
}) {
  const { profile } = await getAdminContext()
  if (!profile.club_id) return

  const supabase = await createClient()
  const { error } = await supabase
    .from("clubs")
    .update({
      name: input.name,
      primary_color: input.primary_color,
    })
    .eq("id", profile.club_id)

  if (error) throw new Error(error.message)

  revalidatePath("/website")
  revalidatePath("/settings/website")
}

export async function updateClubWebsiteContent(input: {
  hero_headline: string
  hero_subtext: string
  tagline: string
  instagram: string
  about_blurb?: string
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
      about_blurb: input.about_blurb,
    })
    .eq("id", profile.club_id)

  if (error) throw new Error(error.message)

  revalidatePath("/website")
  revalidatePath("/settings/website")
}

function fileExt(name: string) {
  const ext = name.split(".").pop()
  if (!ext) return "png"
  return ext.toLowerCase()
}

async function uploadClubAsset(params: {
  supabase: Awaited<ReturnType<typeof createClient>>
  clubId: string
  folder: "logo" | "hero"
  file: File
}) {
  const path = `${params.clubId}/${params.folder}/${params.folder}.${fileExt(params.file.name)}`
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

export async function uploadClubLogo(formData: FormData) {
  const { profile } = await getAdminContext()
  if (!profile.club_id) return
  const file = formData.get("file")
  if (!(file instanceof File) || file.size === 0) return

  const supabase = await createClient()
  const logo_url = await uploadClubAsset({
    supabase,
    clubId: profile.club_id,
    folder: "logo",
    file,
  })

  const { error } = await supabase
    .from("clubs")
    .update({ logo_url })
    .eq("id", profile.club_id)

  if (error) throw new Error(error.message)
  revalidatePath("/website")
  revalidatePath("/settings/website")
}

export async function uploadClubHeroImage(formData: FormData) {
  const { profile } = await getAdminContext()
  if (!profile.club_id) return
  const file = formData.get("file")
  if (!(file instanceof File) || file.size === 0) return

  const supabase = await createClient()
  const hero_image_url = await uploadClubAsset({
    supabase,
    clubId: profile.club_id,
    folder: "hero",
    file,
  })

  const { error } = await supabase
    .from("clubs")
    .update({ hero_image_url })
    .eq("id", profile.club_id)

  if (error) throw new Error(error.message)
  revalidatePath("/website")
  revalidatePath("/settings/website")
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
  revalidatePath("/settings/website")
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
  revalidatePath("/settings/website")
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
  revalidatePath("/settings/website")
}

export async function deleteFaq(id: string) {
  const { profile } = await getAdminContext()
  if (!profile.club_id) return

  const supabase = await createClient()
  const { error } = await supabase.from("faqs").delete().eq("id", id).eq("club_id", profile.club_id)
  if (error) throw new Error(error.message)
  revalidatePath("/website")
  revalidatePath("/settings/website")
}

/** Reorder FAQs by setting order_index to each id's position in orderedIds. */
export async function reorderFaqs(orderedIds: string[]) {
  const { profile } = await getAdminContext()
  if (!profile.club_id) return

  const supabase = await createClient()
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase
      .from("faqs")
      .update({ order_index: i })
      .eq("id", orderedIds[i])
      .eq("club_id", profile.club_id)
    if (error) throw new Error(error.message)
  }
  revalidatePath("/website")
  revalidatePath("/settings/website")
}


"use server"

import { revalidatePath } from "next/cache"

import { getAdminContext } from "@/lib/admin/get-admin-context"
import { createClient } from "@/lib/supabase/server"

export async function upsertWaiverSettings(input: {
  is_enabled: boolean
  require_photo: boolean
  require_rsvp: boolean
}) {
  const { profile } = await getAdminContext()
  if (!profile.club_id) return

  const supabase = await createClient()
  const { error } = await supabase
    .from("waiver_settings")
    .upsert(
      {
        club_id: profile.club_id,
        is_enabled: input.is_enabled,
        require_photo: input.require_photo,
        // Name/email toggles removed from UI; keep these disabled.
        require_name: false,
        require_email: false,
        require_rsvp: input.require_rsvp,
      },
      { onConflict: "club_id" },
    )

  if (error) throw new Error(error.message)
  revalidatePath("/waivers")
}

function fileExt(name: string) {
  const ext = name.split(".").pop()
  if (!ext) return "pdf"
  return ext.toLowerCase()
}

export async function uploadWaiverTemplate(formData: FormData) {
  const { profile } = await getAdminContext()
  if (!profile.club_id) return

  const file = formData.get("file")
  if (!(file instanceof File) || file.size === 0) return

  const supabase = await createClient()
  const path = `${profile.club_id}/waiver/waiver-template.${fileExt(file.name)}`

  const uploadRes = await supabase.storage
    .from("club-waivers")
    .upload(path, file, { upsert: true, contentType: file.type })

  if (uploadRes.error) throw new Error(uploadRes.error.message)

  const signed = await supabase.storage
    .from("club-waivers")
    .createSignedUrl(path, 60 * 60 * 24 * 365)

  if (signed.error || !signed.data?.signedUrl) {
    throw new Error(signed.error?.message ?? "Failed to create signed URL.")
  }

  const { error } = await supabase
    .from("waiver_settings")
    .upsert(
      { club_id: profile.club_id, waiver_url: signed.data.signedUrl },
      { onConflict: "club_id" },
    )

  if (error) throw new Error(error.message)
  revalidatePath("/waivers")
}


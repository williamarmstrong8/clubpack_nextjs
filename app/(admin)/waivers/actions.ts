"use server"

import { revalidatePath } from "next/cache"

import { getAdminContext } from "@/lib/admin/get-admin-context"
import { createClient } from "@/lib/supabase/server"

const WAIVER_SUBMISSIONS_BUCKET = "waiver-submissions"

/** Extract storage object path from a Supabase public URL for waiver-submissions bucket. */
function storagePathFromPublicUrl(url: string | null): string | null {
  if (!url?.trim()) return null
  const marker = `/object/public/${WAIVER_SUBMISSIONS_BUCKET}/`
  const idx = url.indexOf(marker)
  if (idx === -1) return null
  const path = url.slice(idx + marker.length).split("?")[0]?.trim()
  return path && path.length > 0 ? decodeURIComponent(path) : null
}

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

export type DeleteWaiverResult = { ok: true } | { ok: false; error: string }

/**
 * Delete a waiver submission: remove waiver and photo from storage,
 * clear waiver (and avatar if same as submission photo) on membership, delete waiver_submissions row.
 */
export async function deleteWaiverSubmission(
  submissionId: string,
): Promise<DeleteWaiverResult> {
  try {
    const { profile } = await getAdminContext()
    if (!profile.club_id) return { ok: false, error: "No club linked." }

    const supabase = await createClient()

    const { data: row, error: fetchError } = await supabase
      .from("waiver_submissions")
      .select("id, club_id, membership_id, submitted_waiver_url, photo_url")
      .eq("id", submissionId)
      .eq("club_id", profile.club_id)
      .single()

    if (fetchError || !row) {
      return { ok: false, error: fetchError?.message ?? "Submission not found." }
    }

    const membershipId = (row as { membership_id?: string | null }).membership_id ?? null
    const submittedWaiverUrl = (row as { submitted_waiver_url?: string | null }).submitted_waiver_url ?? null
    const photoUrl = (row as { photo_url?: string | null }).photo_url ?? null

    const pathsToRemove: string[] = []
    const waiverPath = storagePathFromPublicUrl(submittedWaiverUrl)
    if (waiverPath) pathsToRemove.push(waiverPath)
    const photoPath = storagePathFromPublicUrl(photoUrl)
    if (photoPath) pathsToRemove.push(photoPath)

    if (pathsToRemove.length > 0) {
      await supabase.storage.from(WAIVER_SUBMISSIONS_BUCKET).remove(pathsToRemove)
    }

    if (membershipId) {
      const updates: { waiver_url?: null; waiver_signed_at?: null; avatar_url?: null } = {
        waiver_url: null,
        waiver_signed_at: null,
      }
      const { data: membership } = await supabase
        .from("memberships")
        .select("avatar_url")
        .eq("id", membershipId)
        .single()
      const currentAvatar = (membership as { avatar_url?: string | null } | null)?.avatar_url ?? null
      if (currentAvatar && photoUrl && currentAvatar === photoUrl) {
        updates.avatar_url = null
      }
      await supabase.from("memberships").update(updates).eq("id", membershipId)
    }

    const { error: deleteError } = await supabase
      .from("waiver_submissions")
      .delete()
      .eq("id", submissionId)
      .eq("club_id", profile.club_id)

    if (deleteError) return { ok: false, error: deleteError.message }

    revalidatePath("/waivers")
    return { ok: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete waiver."
    return { ok: false, error: message }
  }
}


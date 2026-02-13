"use server"

import { createClient } from "@/lib/supabase/server"
import { getClubBySubdomain } from "@/lib/data/club-site"

export type SubmitContactResult =
  | { ok: true }
  | { ok: false; error: string }

export async function submitContactForm(
  site: string,
  formData: {
    first_name: string
    last_name: string
    email: string
    subject?: string
    message: string
    phone_number?: string
  },
): Promise<SubmitContactResult> {
  const club = await getClubBySubdomain(site)
  if (!club?.id) {
    return { ok: false, error: "Club not found." }
  }

  const first_name = String(formData.first_name ?? "").trim()
  const last_name = String(formData.last_name ?? "").trim()
  const email = String(formData.email ?? "").trim()
  const message = String(formData.message ?? "").trim()
  const subject = String(formData.subject ?? "").trim()
  const phone_number = formData.phone_number
    ? String(formData.phone_number).trim() || null
    : null

  if (!first_name || !last_name || !email || !message) {
    return { ok: false, error: "Please fill in all required fields." }
  }

  const messageWithSubject = subject
    ? `Subject: ${subject}\n\n${message}`
    : message

  const supabase = await createClient()
  const { error } = await supabase.from("club_contact_submissions").insert({
    club_id: club.id,
    first_name,
    last_name,
    email,
    phone_number,
    message: messageWithSubject,
  })

  if (error) {
    return { ok: false, error: error.message }
  }
  return { ok: true }
}

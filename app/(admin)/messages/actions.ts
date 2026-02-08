"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { getAdminContext } from "@/lib/admin/get-admin-context"

export async function deleteContactSubmission(id: string) {
  const { profile } = await getAdminContext()
  if (!profile.club_id) return

  const supabase = await createClient()
  const { error } = await supabase
    .from("club_contact_submissions")
    .delete()
    .eq("id", id)
    .eq("club_id", profile.club_id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/messages")
}


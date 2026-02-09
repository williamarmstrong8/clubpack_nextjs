"use server"

import { revalidatePath } from "next/cache"

import { getAdminContext } from "@/lib/admin/get-admin-context"
import { createClient } from "@/lib/supabase/server"

export async function updateAdminProfile(input: {
  first_name: string
  last_name: string
}) {
  const { userId } = await getAdminContext()
  const supabase = await createClient()
  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: input.first_name,
      last_name: input.last_name,
    })
    .eq("id", userId)

  if (error) throw new Error(error.message)
  revalidatePath("/account")
}


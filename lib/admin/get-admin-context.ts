import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export type AdminContext = {
  userId: string
  profile: {
    id: string
    club_id: string | null
    role: string | null
    first_name: string | null
    last_name: string | null
  }
}

export async function getAdminContext(): Promise<AdminContext> {
  const supabase = await createClient()

  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims
  const userId = typeof claims?.sub === "string" ? claims.sub : null

  if (!userId) {
    redirect("/auth/login")
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, club_id, role, first_name, last_name")
    .eq("id", userId)
    .single()

  if (profileError || !profile) {
    redirect("/auth/login")
  }

  const role = profile.role ? String(profile.role).toLowerCase() : ""
  if (role !== "admin") {
    redirect("/auth/login?error=not_admin")
  }

  return { userId, profile }
}

export function getDisplayName(profile: AdminContext["profile"]) {
  const full = `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim()
  return full || "Admin"
}


import { getAdminContext } from "@/lib/admin/get-admin-context"
import { createClient } from "@/lib/supabase/server"

import { AccountClient } from "./account-client"

export const dynamic = "force-dynamic"

export default async function AccountPage() {
  const { userId, profile } = await getAdminContext()
  const supabase = await createClient()

  const [{ data: userRes }, { data: profileRes }] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("profiles")
      .select("first_name, last_name, role, club_id")
      .eq("id", userId)
      .single(),
  ])

  const email = userRes.user?.email ?? ""

  return (
    <AccountClient
      initial={{
        email,
        first_name: profileRes?.first_name ?? profile.first_name ?? "",
        last_name: profileRes?.last_name ?? profile.last_name ?? "",
        role: profileRes?.role ?? profile.role ?? null,
        club_id: profileRes?.club_id ?? profile.club_id ?? null,
      }}
    />
  )
}
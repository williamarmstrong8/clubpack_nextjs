import { createClient } from "@/lib/supabase/server"
import { getAdminContext } from "@/lib/admin/get-admin-context"
import { MembersClient, type MemberRow } from "./members-client"

export default async function MembersPage() {
  const { profile } = await getAdminContext()

  if (!profile.club_id) {
    return (
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Members</h2>
        <p className="text-sm text-muted-foreground">
          Your admin account is not connected to a club yet.
        </p>
      </div>
    )
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("memberships")
    .select("id, name, email, joined_at, status")
    .eq("club_id", profile.club_id)
    .order("joined_at", { ascending: false })

  if (error) {
    return (
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Members</h2>
        <p className="text-sm text-destructive">{error.message}</p>
      </div>
    )
  }

  const members = (data ?? []) as MemberRow[]
  return <MembersClient members={members} />
}
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
  const firstOfMonthIso = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  ).toISOString()

  const [membersRes, newThisMonthRes, clubRes, adminCountRes] =
    await Promise.all([
      supabase
        .from("memberships")
        .select("id, name, email, joined_at, avatar_url, phone")
        .eq("club_id", profile.club_id)
        .order("joined_at", { ascending: false }),
      supabase
        .from("memberships")
        .select("id", { count: "exact", head: true })
        .eq("club_id", profile.club_id)
        .gte("joined_at", firstOfMonthIso),
      supabase.from("clubs").select("subdomain").eq("id", profile.club_id).maybeSingle(),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("club_id", profile.club_id)
        .eq("role", "admin"),
    ])

  const { data, error } = membersRes

  if (error) {
    return (
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Members</h2>
        <p className="text-sm text-destructive">{error.message}</p>
      </div>
    )
  }

  const members = (data ?? []) as MemberRow[]
  const subdomain = (clubRes.data as { subdomain?: string | null } | null)?.subdomain ?? ""
  const inviteUrl = subdomain
    ? `https://${subdomain}.joinclubpack.com/signup`
    : "https://joinclubpack.com/signup"

  return (
    <MembersClient
      members={members}
      inviteUrl={inviteUrl}
      newMembersThisMonth={newThisMonthRes.count ?? 0}
      adminCount={adminCountRes.count ?? 0}
    />
  )
}
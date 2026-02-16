import { createClient } from "@/lib/supabase/server"
import { getAdminContext } from "@/lib/admin/get-admin-context"
import { SettingsClient } from "./settings-client"

export const dynamic = "force-dynamic"

type ClubRow = {
  name: string | null
  email: string | null
  phone_number: string | null
  meeting_location: string | null
  meeting_time: string | null
  description: string | null
}

export default async function SettingsPage() {
  const { profile } = await getAdminContext()

  if (!profile.club_id) {
    return (
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Your admin account is not connected to a club yet.
        </p>
      </div>
    )
  }

  const supabase = await createClient()
  const clubId = profile.club_id

  const [clubRes, policyRes] = await Promise.all([
    supabase
      .from("clubs")
      .select("name, email, phone_number, meeting_location, meeting_time, description")
      .eq("id", clubId)
      .single(),
    supabase.from("club_policy").select("id, content").eq("club_id", clubId).maybeSingle(),
  ])

  if (clubRes.error || !clubRes.data) {
    return (
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
        <p className="text-sm text-destructive">
          {clubRes.error?.message ?? "Failed to load club."}
        </p>
      </div>
    )
  }

  const club = clubRes.data as ClubRow
  const policy = policyRes.data as { id: string; content: string | null } | null

  return (
    <SettingsClient
      initial={{
        club: {
          name: club.name ?? "",
          email: club.email ?? "",
          phone_number: club.phone_number ?? "",
          meeting_location: club.meeting_location ?? "",
          meeting_time: club.meeting_time ?? "",
          description: club.description ?? "",
        },
        clubPolicyContent: policy?.content ?? "",
      }}
    />
  )
}
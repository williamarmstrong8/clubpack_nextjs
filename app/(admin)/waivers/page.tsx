import { createClient } from "@/lib/supabase/server"
import { getAdminContext } from "@/lib/admin/get-admin-context"
import { WaiversClient } from "./waivers-client"

export const dynamic = "force-dynamic"

type WaiverSettingsRow = {
  is_enabled: boolean | null
  waiver_url: string | null
  require_photo: boolean | null
  require_name: boolean | null
  require_email: boolean | null
  require_rsvp: boolean | null
}

type WaiverSubmissionRow = {
  id: string
  created_at: string | null
  membership_id: string | null
  submitted_waiver_url: string | null
  full_name: string | null
  email: string | null
  photo_url: string | null
}

export default async function WaiversPage() {
  const { profile } = await getAdminContext()

  if (!profile.club_id) {
    return (
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Waivers</h2>
        <p className="text-sm text-muted-foreground">
          Your admin account is not connected to a club yet.
        </p>
      </div>
    )
  }

  const supabase = await createClient()
  const clubId = profile.club_id

  const [settingsRes, submissionsRes] = await Promise.all([
    supabase
      .from("waiver_settings")
      .select("is_enabled, waiver_url, require_photo, require_name, require_email, require_rsvp")
      .eq("club_id", clubId)
      .maybeSingle(),
    supabase
      .from("waiver_submissions")
      .select("id, created_at, membership_id, submitted_waiver_url, full_name, email, photo_url")
      .eq("club_id", clubId)
      .order("created_at", { ascending: false })
      .limit(50),
  ])

  const settings = (settingsRes.data as WaiverSettingsRow | null) ?? null
  const submissions = ((submissionsRes.data ?? []) as WaiverSubmissionRow[]) ?? []

  return (
    <WaiversClient
      initial={{
        settings: {
          is_enabled: settings?.is_enabled ?? false,
          waiver_url: settings?.waiver_url ?? null,
          require_photo: settings?.require_photo ?? false,
          require_name: settings?.require_name ?? false,
          require_email: settings?.require_email ?? false,
          require_rsvp: settings?.require_rsvp ?? false,
        },
        submissions,
      }}
    />
  )
}
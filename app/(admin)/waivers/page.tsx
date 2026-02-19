import { createClient } from "@/lib/supabase/server"
import { getAdminContext } from "@/lib/admin/get-admin-context"
import { WaiversClient } from "./waivers-client"

export const dynamic = "force-dynamic"

type WaiverSettingsRow = {
  is_enabled: boolean | null
  waiver_url: string | null
  require_photo: boolean | null
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
  membership_avatar_url: string | null
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
      .select("is_enabled, waiver_url, require_photo, require_rsvp")
      .eq("club_id", clubId)
      .maybeSingle(),
    supabase
      .from("waiver_submissions")
      .select("id, created_at, membership_id, submitted_waiver_url, full_name, email, photo_url, memberships(avatar_url)")
      .eq("club_id", clubId)
      .order("created_at", { ascending: false }),
  ])

  const settings = (settingsRes.data as WaiverSettingsRow | null) ?? null
  const rawSubmissions = (submissionsRes.data ?? []) as Array<{
    id: string
    created_at: string | null
    membership_id: string | null
    submitted_waiver_url: string | null
    full_name: string | null
    email: string | null
    photo_url: string | null
    memberships?: { avatar_url: string | null } | { avatar_url: string | null }[] | null
  }>
  const submissions: WaiverSubmissionRow[] = rawSubmissions.map((s) => {
    const member = Array.isArray(s.memberships) ? s.memberships[0] : s.memberships
    return {
      id: s.id,
      created_at: s.created_at,
      membership_id: s.membership_id,
      submitted_waiver_url: s.submitted_waiver_url,
      full_name: s.full_name,
      email: s.email,
      photo_url: s.photo_url,
      membership_avatar_url: member?.avatar_url ?? null,
    }
  })

  return (
    <WaiversClient
      initial={{
        settings: {
          is_enabled: settings?.is_enabled ?? false,
          waiver_url: settings?.waiver_url ?? null,
          require_photo: settings?.require_photo ?? false,
          require_rsvp: settings?.require_rsvp ?? false,
        },
        submissions,
      }}
    />
  )
}
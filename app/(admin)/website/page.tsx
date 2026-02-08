import { getAdminContext } from "@/lib/admin/get-admin-context"
import { createClient } from "@/lib/supabase/server"
import { WebsiteClient, type ClubWebsiteContent, type ClubSettings, type FaqRow } from "./website-client"

export const dynamic = "force-dynamic"

type ClubRow = {
  subdomain: string | null
  hero_headline: string | null
  hero_subtext: string | null
  tagline: string | null
  instagram: string | null
}

export default async function WebsitePage() {
  const { profile } = await getAdminContext()

  if (!profile.club_id) {
    return (
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Website & App</h2>
        <p className="text-sm text-muted-foreground">
          Your admin account is not connected to a club yet.
        </p>
      </div>
    )
  }

  const supabase = await createClient()
  const [clubRes, settingsRes, faqsRes] = await Promise.all([
    supabase
      .from("clubs")
      .select("subdomain, hero_headline, hero_subtext, tagline, instagram")
      .eq("id", profile.club_id)
      .single(),
    supabase
      .from("club_settings")
      .select("show_event_calendar, show_contact_page, show_explore_page, require_login_to_rsvp")
      .eq("club_id", profile.club_id)
      .maybeSingle(),
    supabase
      .from("faqs")
      .select("id, question, answer, order_index")
      .eq("club_id", profile.club_id)
      .order("order_index", { ascending: true }),
  ])

  if (clubRes.error || !clubRes.data) {
    return (
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Website & App</h2>
        <p className="text-sm text-destructive">
          {clubRes.error?.message ?? "Failed to load club."}
        </p>
      </div>
    )
  }

  const initial = clubRes.data as ClubRow as ClubWebsiteContent
  const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "").replace(/^https?:\/\//, "").split("/")[0] ?? ""

  const settings: ClubSettings = {
    show_event_calendar: settingsRes.data?.show_event_calendar ?? true,
    show_contact_page: settingsRes.data?.show_contact_page ?? true,
    show_explore_page: settingsRes.data?.show_explore_page ?? true,
    require_login_to_rsvp: settingsRes.data?.require_login_to_rsvp ?? false,
  }

  const faqs = ((faqsRes.data ?? []) as FaqRow[]) ?? []

  return <WebsiteClient initial={initial} settings={settings} faqs={faqs} rootDomain={rootDomain} />
}
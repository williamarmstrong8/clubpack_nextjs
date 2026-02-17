import { getAdminContext } from "@/lib/admin/get-admin-context"
import { createClient } from "@/lib/supabase/server"

import { AnalyticsClient } from "./analytics-client"

export const dynamic = "force-dynamic"

type DailyCount = { date: string; count: number }

function isoDateOnly(d: Date) {
  return d.toISOString().slice(0, 10)
}

function startOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function addDays(d: Date, days: number) {
  const x = new Date(d)
  x.setDate(x.getDate() + days)
  return x
}

function buildDayBins(days: number) {
  const today = startOfDay(new Date())
  const start = addDays(today, -(days - 1))
  const bins: DailyCount[] = []
  for (let i = 0; i < days; i++) {
    bins.push({ date: isoDateOnly(addDays(start, i)), count: 0 })
  }
  return { start, end: addDays(today, 1), bins }
}

export default async function AnalyticsPage() {
  const { profile } = await getAdminContext()

  if (!profile.club_id) {
    return (
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Analytics</h2>
        <p className="text-sm text-muted-foreground">
          Your admin account is not connected to a club yet.
        </p>
      </div>
    )
  }

  const supabase = await createClient()
  const clubId = profile.club_id

  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [
    membersTotalRes,
    membersLast30Res,
    membersPrev30Res,
    rsvpsLast7Res,
    rsvpsPrev7Res,
    messagesLast30Res,
    eventsUpcomingRes,
    membersJoinedRows,
    rsvpsCreatedRows,
    websiteViewsLast7Res,
    websiteViewsLast30Res,
    websiteViewsRows,
  ] = await Promise.all([
    supabase.from("memberships").select("id", { count: "exact", head: true }).eq("club_id", clubId),
    supabase
      .from("memberships")
      .select("id", { count: "exact", head: true })
      .eq("club_id", clubId)
      .gte("joined_at", thirtyDaysAgo),
    supabase
      .from("memberships")
      .select("id", { count: "exact", head: true })
      .eq("club_id", clubId)
      .gte("joined_at", new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString())
      .lt("joined_at", thirtyDaysAgo),
    supabase
      .from("rsvps")
      .select("id", { count: "exact", head: true })
      .eq("club_id", clubId)
      .gte("created_at", sevenDaysAgo),
    supabase
      .from("rsvps")
      .select("id", { count: "exact", head: true })
      .eq("club_id", clubId)
      .gte("created_at", fourteenDaysAgo)
      .lt("created_at", sevenDaysAgo),
    supabase
      .from("club_contact_submissions")
      .select("id", { count: "exact", head: true })
      .eq("club_id", clubId)
      .gte("created_at", thirtyDaysAgo),
    supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .eq("club_id", clubId)
      .gte("event_date", isoDateOnly(new Date())),
    supabase
      .from("memberships")
      .select("joined_at")
      .eq("club_id", clubId)
      .gte("joined_at", thirtyDaysAgo),
    supabase
      .from("rsvps")
      .select("created_at")
      .eq("club_id", clubId)
      .gte("created_at", thirtyDaysAgo),
    supabase
      .from("club_website_views")
      .select("id", { count: "exact", head: true })
      .eq("club_id", clubId)
      .gte("viewed_at", sevenDaysAgo),
    supabase
      .from("club_website_views")
      .select("id", { count: "exact", head: true })
      .eq("club_id", clubId)
      .gte("viewed_at", thirtyDaysAgo),
    supabase
      .from("club_website_views")
      .select("viewed_at")
      .eq("club_id", clubId)
      .gte("viewed_at", thirtyDaysAgo),
  ])

  const membersTotal = membersTotalRes.count ?? 0
  const membersLast30 = membersLast30Res.count ?? 0
  const membersPrev30 = membersPrev30Res.count ?? 0
  const membersDelta30 = membersLast30 - membersPrev30

  const rsvpsLast7 = rsvpsLast7Res.count ?? 0
  const rsvpsPrev7 = rsvpsPrev7Res.count ?? 0
  const rsvpsDelta7 = rsvpsLast7 - rsvpsPrev7

  const messagesLast30 = messagesLast30Res.count ?? 0
  const upcomingEvents = eventsUpcomingRes.count ?? 0
  const websiteViewsLast7 = websiteViewsLast7Res.count ?? 0
  const websiteViewsLast30 = websiteViewsLast30Res.count ?? 0

  // 30-day mini “charts” (daily bars)
  const joinBins = buildDayBins(30)
  ;((membersJoinedRows.data ?? []) as Array<{ joined_at: string | null }>).forEach((r) => {
    if (!r.joined_at) return
    const d = isoDateOnly(new Date(r.joined_at))
    const idx = joinBins.bins.findIndex((b) => b.date === d)
    if (idx >= 0) joinBins.bins[idx]!.count += 1
  })

  const rsvpBins = buildDayBins(30)
  ;((rsvpsCreatedRows.data ?? []) as Array<{ created_at: string | null }>).forEach((r) => {
    if (!r.created_at) return
    const d = isoDateOnly(new Date(r.created_at))
    const idx = rsvpBins.bins.findIndex((b) => b.date === d)
    if (idx >= 0) rsvpBins.bins[idx]!.count += 1
  })

  const websiteViewBins = buildDayBins(30)
  ;((websiteViewsRows.data ?? []) as Array<{ viewed_at: string | null }>).forEach((r) => {
    if (!r.viewed_at) return
    const d = isoDateOnly(new Date(r.viewed_at))
    const idx = websiteViewBins.bins.findIndex((b) => b.date === d)
    if (idx >= 0) websiteViewBins.bins[idx]!.count += 1
  })

  return (
    <AnalyticsClient
      stats={{
        membersTotal,
        membersLast30,
        membersDelta30,
        rsvpsLast7,
        rsvpsDelta7,
        messagesLast30,
        upcomingEvents,
        websiteViewsLast7,
        websiteViewsLast30,
      }}
      charts={{
        membersDaily: joinBins.bins,
        rsvpsDaily: rsvpBins.bins,
        websiteViewsDaily: websiteViewBins.bins,
      }}
    />
  )
}

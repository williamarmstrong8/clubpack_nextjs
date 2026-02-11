import { getAdminContext } from "@/lib/admin/get-admin-context"
import { createClient } from "@/lib/supabase/server"

import { HomeClient } from "./home-client"

export const dynamic = "force-dynamic"

type ActivityRow = {
  id: string
  created_at: string
  action_type: string | null
  detail: string | null
}

function activityTitle(actionType: string | null) {
  const t = (actionType ?? "").toLowerCase()
  if (t === "event_created") return "Event created"
  if (t === "event_deleted") return "Event deleted"
  if (t === "event_updated") return "Event updated"
  if (t === "member_joined") return "New member joined"
  if (t === "member_left") return "Member left"
  return "Activity"
}

function formatTimeAgo(dateIso: string) {
  const ts = new Date(dateIso).getTime()
  const now = Date.now()
  const diffSec = Math.max(0, Math.floor((now - ts) / 1000))
  if (diffSec < 60) return `${diffSec}s ago`
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.floor(diffHr / 24)
  return `${diffDay}d ago`
}

export default async function HomePage() {
  const { profile } = await getAdminContext()

  if (!profile.club_id) {
    return (
      <div className="flex w-full flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
        <p className="text-sm text-muted-foreground">
          Your admin account is not connected to a club yet.
        </p>
      </div>
    )
  }

  const supabase = await createClient()
  const clubId = profile.club_id

  const todayIso = new Date().toISOString().slice(0, 10)
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const y = now.getFullYear()
  const m = now.getMonth()
  const startThisMonth = new Date(y, m, 1).toISOString()

  const [
    membersTotalRes,
    membersNewThisMonthRes,
    totalEventsRes,
    upcomingEventsRes,
    rsvpsThisMonthRes,
    rsvpsThisWeekRes,
    activityRes,
    clubRes,
  ] = await Promise.all([
    supabase.from("memberships").select("id", { count: "exact", head: true }).eq("club_id", clubId),
    supabase
      .from("memberships")
      .select("id", { count: "exact", head: true })
      .eq("club_id", clubId)
      .gte("joined_at", startThisMonth),
    supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .eq("club_id", clubId),
    supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .eq("club_id", clubId)
      .gte("event_date", todayIso),
    supabase
      .from("rsvps")
      .select("id", { count: "exact", head: true })
      .eq("club_id", clubId)
      .gte("created_at", startThisMonth),
    supabase
      .from("rsvps")
      .select("id", { count: "exact", head: true })
      .eq("club_id", clubId)
      .gte("created_at", sevenDaysAgo),
    supabase
      .from("activity_log")
      .select("id, created_at, action_type, detail")
      .eq("club_id", clubId)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("clubs").select("subdomain").eq("id", clubId).maybeSingle(),
  ])

  const membersTotal = membersTotalRes.count ?? 0
  const newMembersThisMonth = membersNewThisMonthRes.count ?? 0

  const totalEvents = totalEventsRes.count ?? 0
  const upcomingEvents = upcomingEventsRes.count ?? 0

  const rsvpsThisMonth = rsvpsThisMonthRes.count ?? 0
  const rsvpsThisWeek = rsvpsThisWeekRes.count ?? 0

  const recentActivity = ((activityRes.data ?? []) as ActivityRow[]).map((a) => ({
    id: a.id,
    title: activityTitle(a.action_type),
    detail: a.detail ?? "",
    time: formatTimeAgo(a.created_at),
  }))

  const subdomain = (clubRes.data as { subdomain?: string | null } | null)?.subdomain ?? ""
  const inviteUrl = subdomain
    ? `https://${subdomain}.joinclubpack.com/signup`
    : "https://joinclubpack.com/signup"

  const stats = [
    { title: "Total members", value: String(membersTotal), delta: String(newMembersThisMonth), deltaLabel: "new this month" },
    { title: "Total events", value: String(totalEvents), delta: String(upcomingEvents), deltaLabel: "upcoming events" },
    { title: "RSVPs this month", value: String(rsvpsThisMonth), delta: String(rsvpsThisWeek), deltaLabel: "this week" },
  ]

  return <HomeClient stats={stats} recentActivity={recentActivity} inviteUrl={inviteUrl} />
}
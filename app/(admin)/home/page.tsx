import { ArrowUpRight, CalendarPlus, UserPlus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { getAdminContext } from "@/lib/admin/get-admin-context"
import { createClient } from "@/lib/supabase/server"

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
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString()

  const [
    membersTotalRes,
    membersNewWeekRes,
    membersPrevWeekRes,
    upcomingEventsRes,
    rsvpsThisWeekRes,
    rsvpsPrevWeekRes,
    activityRes,
  ] = await Promise.all([
    supabase.from("memberships").select("id", { count: "exact", head: true }).eq("club_id", clubId),
    supabase
      .from("memberships")
      .select("id", { count: "exact", head: true })
      .eq("club_id", clubId)
      .gte("joined_at", sevenDaysAgo),
    supabase
      .from("memberships")
      .select("id", { count: "exact", head: true })
      .eq("club_id", clubId)
      .gte("joined_at", fourteenDaysAgo)
      .lt("joined_at", sevenDaysAgo),
    supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .eq("club_id", clubId)
      .gte("event_date", todayIso),
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
      .from("activity_log")
      .select("id, created_at, action_type, detail")
      .eq("club_id", clubId)
      .order("created_at", { ascending: false })
      .limit(5),
  ])

  const membersTotal = membersTotalRes.count ?? 0
  const membersNewWeek = membersNewWeekRes.count ?? 0
  const membersPrevWeek = membersPrevWeekRes.count ?? 0
  const membersDelta = membersNewWeek - membersPrevWeek

  const upcomingEvents = upcomingEventsRes.count ?? 0

  const rsvpsThisWeek = rsvpsThisWeekRes.count ?? 0
  const rsvpsPrevWeek = rsvpsPrevWeekRes.count ?? 0
  const rsvpsDelta = rsvpsThisWeek - rsvpsPrevWeek

  const recentActivity = ((activityRes.data ?? []) as ActivityRow[]).map((a) => ({
    id: a.id,
    title: activityTitle(a.action_type),
    detail: a.detail ?? "",
    time: formatTimeAgo(a.created_at),
  }))

  const stats = [
    { title: "Total members", value: String(membersTotal), delta: membersDelta >= 0 ? `+${membersDelta}` : String(membersDelta) },
    { title: "Upcoming events", value: String(upcomingEvents), delta: "—" },
    { title: "RSVPs this week", value: String(rsvpsThisWeek), delta: rsvpsDelta >= 0 ? `+${rsvpsDelta}` : String(rsvpsDelta) },
  ]

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
        <p className="text-sm text-muted-foreground">
          Here’s what’s happening with your club.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Badge variant="secondary">{stat.delta}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button className="justify-between">
              <span className="flex items-center gap-2">
                <CalendarPlus className="h-4 w-4" />
                Create event
              </span>
              <ArrowUpRight className="h-4 w-4 opacity-60" />
            </Button>
            <Button variant="outline" className="justify-between">
              <span className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Invite members
              </span>
              <ArrowUpRight className="h-4 w-4 opacity-60" />
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Activity</TableHead>
                    <TableHead className="hidden md:table-cell">Detail</TableHead>
                    <TableHead className="w-[120px] text-right">When</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivity.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.title}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {row.detail || "—"}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {row.time}
                      </TableCell>
                    </TableRow>
                  ))}
                  {recentActivity.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="py-10 text-center">
                        <div className="text-sm text-muted-foreground">
                          No recent activity yet.
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
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

const stats = [
  { title: "Total members", value: "248", delta: "+12" },
  { title: "Upcoming events", value: "6", delta: "+2" },
  { title: "RSVPs this week", value: "93", delta: "+18" },
]

const recentActivity = [
  {
    id: "a1",
    type: "member_joined",
    detail: "Avery Johnson joined the club",
    time: "2h ago",
  },
  {
    id: "a2",
    type: "event_created",
    detail: "Created event: Saturday Long Run",
    time: "Yesterday",
  },
  {
    id: "a3",
    type: "member_joined",
    detail: "Jordan Lee joined the club",
    time: "3d ago",
  },
]

export default function HomePage() {
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
                    <TableHead className="w-[120px] text-right">When</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivity.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.detail}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {row.time}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
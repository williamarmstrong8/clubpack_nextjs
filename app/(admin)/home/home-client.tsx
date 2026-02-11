"use client"

import * as React from "react"
import { ArrowUpRight, CalendarPlus, UserPlus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { InviteMembersDialog } from "@/app/(admin)/components/invite-members-dialog"
import { CreateEventDialog } from "@/app/(admin)/events/create-event-dialog"

export type HomeStat = {
  title: string
  value: string
  delta: string
  deltaLabel: string
}

export type RecentActivityItem = {
  id: string
  title: string
  detail: string
  time: string
}

export function HomeClient({
  stats,
  recentActivity,
  inviteUrl,
}: {
  stats: HomeStat[]
  recentActivity: RecentActivityItem[]
  inviteUrl: string
}) {
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
            <CardContent className="flex items-baseline justify-between gap-2">
              <div className="text-3xl font-semibold">{stat.value}</div>
              <div className="shrink-0 text-right text-xs text-muted-foreground">
                {stat.deltaLabel}
              </div>
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
            <CreateEventDialog
              trigger={
                <Button className="justify-between">
                  <span className="flex items-center gap-2">
                    <CalendarPlus className="h-4 w-4" />
                    Create event
                  </span>
                  <ArrowUpRight className="h-4 w-4 opacity-60" />
                </Button>
              }
            />
            <InviteMembersDialog
              inviteUrl={inviteUrl}
              trigger={
                <Button variant="outline" className="justify-between">
                  <span className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Invite members
                  </span>
                  <ArrowUpRight className="h-4 w-4 opacity-60" />
                </Button>
              }
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-1.5">
            {recentActivity.map((row) => (
              <Card key={row.id} className="shadow-none py-0 gap-0">
                <CardContent className="flex items-center justify-between gap-4 px-3 py-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{row.title}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {row.detail || "—"}
                    </div>
                  </div>
                  <div className="shrink-0 text-xs text-muted-foreground">
                    {row.time}
                  </div>
                </CardContent>
              </Card>
            ))}
            {recentActivity.length === 0 ? (
              <div className="py-10 text-center text-sm text-muted-foreground">
                No recent activity yet.
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


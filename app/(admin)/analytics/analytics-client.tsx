"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type DailyCount = { date: string; count: number }

function deltaBadge(delta: number) {
  if (delta === 0) return <Badge variant="secondary">0</Badge>
  if (delta > 0) return <Badge variant="secondary">{`+${delta}`}</Badge>
  return <Badge variant="secondary">{String(delta)}</Badge>
}

function MiniBars({ data }: { data: DailyCount[] }) {
  const max = Math.max(1, ...data.map((d) => d.count))
  return (
    <div className="flex items-end gap-1">
      {data.map((d) => (
        <div
          key={d.date}
          className="bg-muted relative h-14 w-2 overflow-hidden rounded"
          title={`${d.date}: ${d.count}`}
        >
          <div
            className="bg-primary absolute bottom-0 left-0 right-0 rounded"
            style={{ height: `${Math.round((d.count / max) * 100)}%` }}
          />
        </div>
      ))}
    </div>
  )
}

export function AnalyticsClient({
  stats,
  charts,
}: {
  stats: {
    membersTotal: number
    membersLast30: number
    membersDelta30: number
    rsvpsLast7: number
    rsvpsDelta7: number
    messagesLast30: number
    upcomingEvents: number
  }
  charts: {
    membersDaily: DailyCount[]
    rsvpsDaily: DailyCount[]
  }
}) {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Analytics</h2>
        <p className="text-sm text-muted-foreground">
          Simple, high-signal metrics for your club.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total members
            </CardTitle>
            <Badge variant="secondary">All-time</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{stats.membersTotal}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              New members (30d)
            </CardTitle>
            {deltaBadge(stats.membersDelta30)}
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{stats.membersLast30}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              RSVPs (7d)
            </CardTitle>
            {deltaBadge(stats.rsvpsDelta7)}
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{stats.rsvpsLast7}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Messages (30d)
            </CardTitle>
            <Badge variant="secondary">Inbox</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{stats.messagesLast30}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">New members (last 30 days)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <MiniBars data={charts.membersDaily} />
            <p className="text-xs text-muted-foreground">
              Hover bars for daily counts.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">RSVPs (last 30 days)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <MiniBars data={charts.rsvpsDaily} />
            <p className="text-xs text-muted-foreground">
              Helps you spot spikes around event announcements.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Right now</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Upcoming events</span>
            <span className="font-medium">{stats.upcomingEvents}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


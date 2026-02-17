"use client"

import * as React from "react"
import { format } from "date-fns"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type DailyCount = { date: string; count: number }

function formatChartDate(dateStr: string) {
  try {
    const d = new Date(dateStr + "T00:00:00")
    if (Number.isNaN(d.getTime())) return dateStr
    return format(d, "MMMM do")
  } catch {
    return dateStr
  }
}

function MiniBars({ data }: { data: DailyCount[] }) {
  const max = Math.max(1, ...data.map((d) => d.count))
  return (
    <TooltipProvider>
      <div className="flex items-end gap-1.5">
        {data.map((d) => (
          <Tooltip key={d.date}>
            <TooltipTrigger asChild>
              <div className="bg-muted relative h-48 min-w-[12px] flex-1 max-w-8 cursor-pointer overflow-hidden rounded-md">
                <div
                  className="bg-primary absolute bottom-0 left-0 right-0 rounded-md"
                  style={{ height: `${Math.round((d.count / max) * 100)}%` }}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <span className="font-medium">{d.count}</span>
              <span className="text-background/80"> · {formatChartDate(d.date)}</span>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
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
    websiteViewsLast7: number
    websiteViewsLast30: number
  }
  charts: {
    membersDaily: DailyCount[]
    rsvpsDaily: DailyCount[]
    websiteViewsDaily: DailyCount[]
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
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{stats.membersTotal}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              New members (30d)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{stats.membersLast30}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              RSVPs (7d)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{stats.rsvpsLast7}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Messages (30d)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{stats.messagesLast30}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Website views (7d)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{stats.websiteViewsLast7}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Website views (30d)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{stats.websiteViewsLast30}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">New members (last 30 days)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="min-h-[12rem]">
              <MiniBars data={charts.membersDaily} />
            </div>
            <p className="text-xs text-muted-foreground">
              Hover bars for daily counts.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">RSVPs (last 30 days)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="min-h-[12rem]">
              <MiniBars data={charts.rsvpsDaily} />
            </div>
            <p className="text-xs text-muted-foreground">
              Helps you spot spikes around event announcements.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Website views (last 30 days)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="min-h-[12rem]">
              <MiniBars data={charts.websiteViewsDaily} />
            </div>
            <p className="text-xs text-muted-foreground">
              Page loads on your club site (home, events, contact, etc.).
            </p>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}


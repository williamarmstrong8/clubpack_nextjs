import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";

import type { ClubEvent } from "../mock-data";

export function EventsSection({ events }: { events: ClubEvent[] }) {
  return (
    <section className="bg-muted/20">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="size-4" />
              Upcoming events
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">
              See what&apos;s next
            </h2>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Weekly runs are open to all. Bring a friend, choose your pace, and
              hang after.
            </p>
          </div>

          <Button asChild variant="outline">
            <Link href="./events">All events</Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.title} className="h-full">
              <CardHeader className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{event.dateLabel}</Badge>
                  <Badge>{event.runType}</Badge>
                </div>
                <CardTitle className="text-base">{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="size-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Meet 10 min early
                  </div>
                  <Button asChild size="sm" variant="ghost">
                    <Link href="./events">Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}


import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";

const events = [
  {
    slug: "sunrise-social-5k",
    title: "Sunrise Social 5K",
    dateLabel: "Tue, Feb 11",
    time: "6:30 AM",
    location: "Lady Bird Lake Trail",
    runType: "5K",
  },
  {
    slug: "hills-for-breakfast",
    title: "Hills for Breakfast",
    dateLabel: "Wed, Feb 12",
    time: "6:15 AM",
    location: "Austin High Steps",
    runType: "Workout",
  },
  {
    slug: "tempo-and-treats",
    title: "Tempo + Treats",
    dateLabel: "Thu, Feb 13",
    time: "6:15 PM",
    location: "Zilker Park",
    runType: "Tempo",
  },
  {
    slug: "social-shakeout",
    title: "Social Shakeout",
    dateLabel: "Fri, Feb 14",
    time: "7:00 AM",
    location: "South Congress",
    runType: "Easy",
  },
  {
    slug: "weekend-long-run",
    title: "Weekend Long Run",
    dateLabel: "Sat, Feb 15",
    time: "8:00 AM",
    location: "Mueller Lake Park",
    runType: "Long Run",
  },
  {
    slug: "coffee-mile",
    title: "Coffee Mile",
    dateLabel: "Sun, Feb 16",
    time: "9:00 AM",
    location: "Downtown Austin",
    runType: "Fun Run",
  },
] as const;

export default function ClubEventsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="size-4" />
            Events
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Upcoming runs</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            A mix of social miles and structured workouts. Choose what fits your
            week — all paces welcome.
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="../#join">Join club</Link>
        </Button>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event.slug} className="h-full">
            <CardHeader className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{event.dateLabel}</Badge>
                <Badge>{event.runType}</Badge>
              </div>
              <CardTitle className="text-base">{event.title}</CardTitle>
              <CardDescription className="flex flex-col gap-1.5 pt-1">
                <span className="inline-flex items-center gap-2">
                  <Clock className="size-4" />
                  {event.time}
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="size-4" />
                  {event.location}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Bring water · Meet 10 min early
              </div>
              <Button asChild size="sm" variant="ghost">
                <Link href={`./${event.slug}`}>Details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


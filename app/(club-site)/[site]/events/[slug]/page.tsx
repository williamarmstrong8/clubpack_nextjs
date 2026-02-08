import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";

const events = [
  {
    slug: "sunrise-social-5k",
    title: "Sunrise Social 5K",
    dateLabel: "Tue, Feb 11",
    time: "6:30 AM",
    location: "Lady Bird Lake Trail",
    runType: "5K",
    notes:
      "Easy conversational pace. We’ll split into groups and regroup at mile markers.",
  },
  {
    slug: "hills-for-breakfast",
    title: "Hills for Breakfast",
    dateLabel: "Wed, Feb 12",
    time: "6:15 AM",
    location: "Austin High Steps",
    runType: "Workout",
    notes: "Warmup jog, then 6–8 hill reps. Cooldown and stretch after.",
  },
  {
    slug: "tempo-and-treats",
    title: "Tempo + Treats",
    dateLabel: "Thu, Feb 13",
    time: "6:15 PM",
    location: "Zilker Park",
    runType: "Tempo",
    notes: "Optional tempo segments. Stay for snacks after.",
  },
  {
    slug: "social-shakeout",
    title: "Social Shakeout",
    dateLabel: "Fri, Feb 14",
    time: "7:00 AM",
    location: "South Congress",
    runType: "Easy",
    notes: "A short easy run to start the day right.",
  },
  {
    slug: "weekend-long-run",
    title: "Weekend Long Run",
    dateLabel: "Sat, Feb 15",
    time: "8:00 AM",
    location: "Mueller Lake Park",
    runType: "Long Run",
    notes: "Choose 6–12 miles. Multiple pace groups available.",
  },
  {
    slug: "coffee-mile",
    title: "Coffee Mile",
    dateLabel: "Sun, Feb 16",
    time: "9:00 AM",
    location: "Downtown Austin",
    runType: "Fun Run",
    notes: "A short loop to your favorite coffee spot.",
  },
] as const;

export default function EventPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const event = events.find((e) => e.slug === slug);

  if (!event) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold tracking-tight">Event not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This event may have been moved or removed.
        </p>
        <Button asChild className="mt-6" variant="outline">
          <Link href="../">Back to events</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{event.dateLabel}</Badge>
            <Badge>{event.runType}</Badge>
          </div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight">
            {event.title}
          </h1>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center">
            <span className="inline-flex items-center gap-2">
              <Clock className="size-4" />
              {event.time}
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4" />
              {event.location}
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="inline-flex items-center gap-2">
              <Calendar className="size-4" />
              Weekly club event
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="../">Back to events</Link>
          </Button>
          <Button>Join / RSVP</Button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>{event.notes}</p>
            <p>
              Bring water, wear reflective gear if it&apos;s dark, and introduce
              yourself to the group leader when you arrive.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Meeting info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div>
              <div className="font-medium text-foreground">Meet point</div>
              <div>Main entrance / parking lot</div>
            </div>
            <div>
              <div className="font-medium text-foreground">Arrive</div>
              <div>10 minutes early</div>
            </div>
            <div>
              <div className="font-medium text-foreground">Pace</div>
              <div>Groups + regrouping</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
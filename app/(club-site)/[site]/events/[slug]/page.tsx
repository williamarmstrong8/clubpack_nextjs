import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";

import { getClubBySubdomain, getEventById } from "@/lib/data/club-site";

function formatEventDateLabel(isoDate: string | null) {
  if (!isoDate) return "TBD";
  const d = new Date(`${isoDate}T00:00:00`);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatEventTime(t: string | null) {
  const time = (t ?? "").trim();
  if (!time) return "TBD";
  if (/[ap]m$/i.test(time)) return time;
  if (/^\d{2}:\d{2}(:\d{2})?$/.test(time)) {
    const date = new Date(`1970-01-01T${time}`);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
    }
  }
  return time;
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ site: string; slug: string }>;
}) {
  const { site, slug } = await params;
  const club = await getClubBySubdomain(site);
  if (!club) notFound();

  const event = await getEventById(club.id, slug);

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
            <Badge variant="secondary">{formatEventDateLabel(event.event_date)}</Badge>
            <Badge>Run</Badge>
          </div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight">
            {event.title ?? "Untitled"}
          </h1>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center">
            <span className="inline-flex items-center gap-2">
              <Clock className="size-4" />
              {formatEventTime(event.event_time)}
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4" />
              {event.location_name ?? "TBD"}
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
            <p>{event.description ?? "Details coming soon."}</p>
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
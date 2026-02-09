import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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

import { getClubBySubdomain, getUpcomingEventsByClubId, type EventRow } from "@/lib/data/club-site";

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

type UiEvent = {
  slug: string;
  title: string;
  dateLabel: string;
  time: string;
  location: string;
  runType: string;
  imageUrl: string;
};

function toUiEvent(e: EventRow): UiEvent {
  const imageUrl = 
    (typeof e.image_url === "string" && e.image_url) ||
    (typeof e.event_image === "string" && e.event_image) ||
    null;
    
  return {
    slug: e.id,
    title: e.title ?? "Untitled",
    dateLabel: formatEventDateLabel(e.event_date),
    time: formatEventTime(e.event_time),
    location: e.location_name ?? "TBD",
    runType: "Run",
    imageUrl: imageUrl || "/club-photos/happy-group.webp",
  };
}

export default async function ClubEventsPage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site } = await params
  const club = await getClubBySubdomain(site);
  if (!club) notFound();

  const events = (await getUpcomingEventsByClubId(club.id, 50)).map(toUiEvent);

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 pt-24 pb-16 sm:px-6 lg:px-8">
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
          <Link href="../signup">Join club</Link>
        </Button>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event.slug} className="h-full overflow-hidden p-0">
            <Link href={`./events/${event.slug}`} className="block">
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            </Link>
            <CardHeader className="space-y-2 pb-3">
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
            <CardContent className="flex items-center justify-between pt-0">
              <div className="text-xs text-muted-foreground">
                Bring water · Meet 10 min early
              </div>
              <Button asChild size="sm" variant="ghost">
                <Link href={`./events/${event.slug}`}>Details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


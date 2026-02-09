import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

  const eventImageUrl = 
    (typeof event.image_url === "string" && event.image_url) ||
    (typeof event.event_image === "string" && event.event_image) ||
    "/club-photos/happy-group.webp";

  // Mock RSVPs - in production, fetch from database
  const mockRsvps = [
    { id: "1", name: "John Doe", avatar: null },
    { id: "2", name: "Jane Smith", avatar: null },
    { id: "3", name: "Mike Johnson", avatar: null },
    { id: "4", name: "Sarah Williams", avatar: null },
  ];

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 pt-24 pb-10 sm:px-6 lg:px-8">
      {/* Hero Image Card at Top */}
      <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl">
        <Image
          src={eventImageUrl}
          alt={event.title ?? "Event image"}
          fill
          className="object-cover"
          sizes="(max-width: 1400px) 100vw, 1400px"
          priority
        />
      </div>

      {/* Title and Metadata */}
      <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{formatEventDateLabel(event.event_date)}</Badge>
            <Badge>Run</Badge>
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight">
            {event.title ?? "Untitled"}
          </h1>
          <div className="flex flex-col gap-2 text-base text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center">
            <span className="inline-flex items-center gap-2">
              <Clock className="size-5" />
              {formatEventTime(event.event_time)}
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-5" />
              {event.location_name ?? "TBD"}
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="inline-flex items-center gap-2">
              <Calendar className="size-5" />
              Weekly club event
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="../">Back to events</Link>
          </Button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
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

        {/* RSVP Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">RSVPs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {mockRsvps.slice(0, 4).map((rsvp, index) => (
                  <Avatar
                    key={rsvp.id}
                    className="size-10 border-2 border-background"
                    style={{ zIndex: mockRsvps.length - index }}
                  >
                    <AvatarImage src={rsvp.avatar || undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                      {rsvp.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="ml-3 text-sm text-muted-foreground">
                {mockRsvps.length} {mockRsvps.length === 1 ? "person" : "people"} going
              </span>
            </div>
            
            <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
              RSVP for this event
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              RSVP helps us plan. You can always show up!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
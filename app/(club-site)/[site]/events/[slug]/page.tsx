import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";

import { EventMapCard } from "@/components/maps/event-map-card";
import { AddToGoogleCalendar } from "@/components/events/add-to-google-calendar";
import { getClubBySubdomain, getEventById, getRequireLoginToRsvp, getRsvpsForEvent } from "@/lib/data/club-site";
import { createClient } from "@/lib/supabase/server";

import { EventRsvpCard } from "./event-rsvp-card";

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

  const [rsvps, requireLoginToRsvp, membership, existingRsvp] = await Promise.all([
    getRsvpsForEvent(club.id, event.id),
    getRequireLoginToRsvp(club.id),
    (async () => {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase
        .from("memberships")
        .select("id")
        .eq("club_id", club.id)
        .eq("auth_user_id", user.id)
        .maybeSingle();
      return data as { id: string } | null;
    })(),
    (async () => {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      const { data: mem } = await supabase
        .from("memberships")
        .select("id")
        .eq("club_id", club.id)
        .eq("auth_user_id", user.id)
        .maybeSingle();
      if (!mem) return false;
      const { data: rsvp } = await supabase
        .from("rsvps")
        .select("id")
        .eq("event_id", event.id)
        .eq("membership_id", mem.id)
        .maybeSingle();
      return !!rsvp;
    })(),
  ]);

  const maxAttendees = typeof event.max_attendees === "number" ? event.max_attendees : null;

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
              {formatEventTime(event.event_time)}{event.end_time ? ` – ${formatEventTime(typeof event.end_time === "string" ? event.end_time : null)}` : ""}
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
        <div className="lg:col-span-2">
          <Card>
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
        </div>

        <div className="space-y-4">
          {/* RSVP Card */}
          <EventRsvpCard
            eventId={event.id}
            clubId={club.id}
            site={site}
            rsvps={rsvps}
            maxAttendees={maxAttendees}
            requireLoginToRsvp={requireLoginToRsvp}
            isLoggedIn={!!membership}
            alreadyRsvped={existingRsvp}
          />

          {/* Map Card — shown when coordinates exist */}
          {typeof event.latitude === "number" &&
            typeof event.longitude === "number" && (
              <EventMapCard
                latitude={event.latitude}
                longitude={event.longitude}
                locationName={event.location_name}
              />
            )}

          {/* Add to Google Calendar */}
          {event.event_date && (
            <AddToGoogleCalendar
              title={event.title ?? "Event"}
              description={event.description}
              eventDate={event.event_date}
              eventTime={event.event_time}
              endTime={typeof event.end_time === "string" ? event.end_time : null}
              locationName={event.location_name}
              className="w-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}
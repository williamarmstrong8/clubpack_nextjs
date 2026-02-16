import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";

import { EventMapCard } from "@/components/maps/event-map-card";
import { getClubBySubdomain, getEventById, getRequireLoginToRsvp, getRsvpsForEvent } from "@/lib/data/club-site";
import { createClient } from "@/lib/supabase/server";

import { EventRsvpCard } from "./event-rsvp-card";

function formatEventDateLabel(isoDate: string | null) {
  const raw = (isoDate ?? "").trim();
  if (!raw) return "TBD";
  const datePart = raw.includes("T") ? raw.slice(0, 10) : raw;
  const d = new Date(`${datePart}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "TBD";
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
  if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(time)) {
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
      <main className="flex-grow bg-white pt-28 pb-20">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Event not found</h1>
          <p className="mt-2 text-base text-gray-600">
            This event may have been moved or removed.
          </p>
          <Button asChild className="mt-6 rounded-none" variant="outline">
            <Link href={`/${site}/events`}>Back to events</Link>
          </Button>
        </div>
      </main>
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
    <main className="flex-grow bg-white pt-28 pb-20">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Back link — matches about/contact */}
        <div className="mb-8">
          <Link
            href={`/${site}/events`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span aria-hidden>←</span>
            Back to events
          </Link>
        </div>

        {/* Hero image — same container as other pages */}
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg border border-gray-200 mb-10">
          <Image
            src={eventImageUrl}
            alt={event.title ?? "Event image"}
            fill
            className="object-cover"
            sizes="(max-width: 1400px) 100vw, 1400px"
            priority
          />
        </div>

        {/* Title and metadata — club site typography */}
        <div className="mb-16">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-2">
            <span className="font-semibold text-gray-900">
              {formatEventDateLabel(event.event_date)}
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" />
              {formatEventTime(event.event_time)}{event.end_time ? ` – ${formatEventTime(typeof event.end_time === "string" ? event.end_time : null)}` : ""}
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" />
              {event.location_name ?? "TBD"}
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {event.title ?? "Untitled"}
          </h1>
        </div>

        {/* Content grid — bordered blocks like about/contact */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 lg:p-8">
              <h2 className="mb-3 text-lg font-bold tracking-tight text-gray-900">Details</h2>
              <div className="space-y-3 text-base leading-relaxed text-gray-700">
                <p>{event.description ?? "Details coming soon."}</p>
                <p>
                  Bring water, wear reflective gear if it&apos;s dark, and introduce
                  yourself to the group leader when you arrive.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
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
            eventDetails={{
              title: event.title ?? null,
              description: event.description ?? null,
              eventDate: event.event_date ?? null,
              eventTime: event.event_time ?? null,
              endTime: typeof event.end_time === "string" ? event.end_time : null,
              locationName: event.location_name ?? null,
            }}
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
          </div>
        </div>
      </div>
    </main>
  );
}
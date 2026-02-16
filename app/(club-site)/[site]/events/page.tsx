import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";

import { getClubBySubdomain, getUpcomingEventsByClubId, type EventRow } from "@/lib/data/club-site";

function formatDateLong(eventDateIso: string | null): string {
  if (!eventDateIso) return "";
  const d = new Date(`${eventDateIso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
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
  eventDateIso: string | null;
  time: string;
  endTime?: string;
  location: string;
  imageUrl: string;
  description: string | null;
  max_attendees: number | null;
};

function toUiEvent(e: EventRow): UiEvent {
  const imageUrl =
    (typeof e.image_url === "string" && e.image_url) ||
    (typeof e.event_image === "string" && e.event_image) ||
    null;

  return {
    slug: e.id,
    title: e.title ?? "Untitled",
    eventDateIso: e.event_date ?? null,
    time: formatEventTime(e.event_time),
    endTime: e.end_time ? formatEventTime(e.end_time) : undefined,
    location: e.location_name ?? "TBD",
    imageUrl: imageUrl || "/club-photos/happy-group.webp",
    description: e.description ?? null,
    max_attendees: typeof e.max_attendees === "number" ? e.max_attendees : null,
  };
}

export default async function ClubEventsPage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site } = await params;
  const club = await getClubBySubdomain(site);
  if (!club) notFound();

  const events = (await getUpcomingEventsByClubId(club.id, 50)).map(toUiEvent);

  return (
    <main className="flex-grow bg-white pt-28 pb-20">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Upcoming Events
          </h1>
          <p className="text-lg text-gray-700 sm:text-xl">
            Join us at our upcoming events and activities
          </p>
        </div>

        {events.length === 0 ? (
          <div className="py-12 text-center">
            <Calendar className="mx-auto size-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No Upcoming Events
            </h3>
            <p className="mt-2 text-gray-500">Check back later for new events.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const dateLong = formatDateLong(event.eventDateIso);
              const timeRange = event.endTime
                ? `${event.time} – ${event.endTime}`
                : event.time;

              return (
                <div
                  key={event.slug}
                  className="flex flex-col overflow-hidden border border-gray-200 bg-white transition-all duration-300 hover:border-gray-300"
                >
                  {/* Image - 16:9 aspect ratio */}
                  <Link href={`./${event.slug}`} className="relative block aspect-video w-full shrink-0">
                    {event.imageUrl ? (
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                        <Calendar className="size-12 text-gray-300" />
                      </div>
                    )}
                  </Link>

                  {/* Content */}
                  <div className="flex flex-grow flex-col p-6 lg:p-8">
                    <div className="mb-4 flex-grow">
                      {timeRange && timeRange !== "TBD" && (
                        <div className="mb-1 text-xs font-medium text-gray-500">
                          {timeRange}
                        </div>
                      )}
                      {dateLong && (
                        <div className="text-sm font-medium text-gray-900">
                          {dateLong}
                        </div>
                      )}

                      <h2 className="mb-4 mt-4 line-clamp-2 text-xl font-bold leading-tight text-gray-900 sm:text-2xl">
                        <Link href={`./${event.slug}`} className="hover:underline">
                          {event.title}
                        </Link>
                      </h2>

                      {(event.location || event.max_attendees != null) && (
                        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                          {event.location && event.location !== "TBD" && (
                            <div className="flex items-center text-gray-600">
                              <MapPin className="mr-1.5 size-4 shrink-0 text-gray-400" />
                              <span className="text-sm">{event.location}</span>
                            </div>
                          )}
                          {typeof event.max_attendees === "number" && (
                            <div className="flex items-center text-gray-600">
                              <Users className="mr-1.5 size-4 shrink-0 text-gray-400" />
                              <span className="text-sm">
                                {event.max_attendees} spots
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {event.description && (
                        <p className="line-clamp-3 text-sm leading-relaxed text-gray-600">
                          {event.description}
                        </p>
                      )}
                    </div>

                    <Button
                      asChild
                      className="h-auto w-full rounded-none bg-primary px-8 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-300 hover:opacity-90 hover:shadow-md"
                    >
                      <Link href={`./${event.slug}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

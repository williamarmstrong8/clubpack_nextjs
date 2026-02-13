import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";

import type { ClubEvent } from "../mock-data";

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

export function EventsSection({ events }: { events: ClubEvent[] }) {
  const displayEvents = events.slice(0, 3);

  if (displayEvents.length === 0) return null;

  return (
    <section id="events" className="relative bg-white py-20">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <h2 className="mb-16 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          Upcoming Events
        </h2>

        <div className="space-y-6">
          {displayEvents.map((event) => {
            const dateLong = formatDateLong(event.eventDateIso);
            const timeRange =
              event.endTime
                ? `${event.time} – ${event.endTime}`
                : event.time;

            return (
              <div
                key={event.id}
                className="overflow-hidden border border-gray-200 bg-white transition-all duration-300 hover:border-gray-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-stretch">
                  {/* Image Section - matches reference lg:w-2/5 xl:w-1/3, aspect-video */}
                  <div className="w-full shrink-0 lg:w-2/5 xl:w-1/3">
                    {event.imageUrl ? (
                      <Link href={`./events/${event.id}`} className="relative block aspect-video w-full">
                        <Image
                          src={event.imageUrl}
                          alt={event.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 40vw"
                        />
                      </Link>
                    ) : (
                      <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                        <Calendar className="size-12 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Content Section - tight padding so no gap from image; button fixed top-right */}
                  <div className="relative flex flex-1 flex-col py-4 pl-5 pr-28 lg:py-5 lg:pl-6 lg:pr-32">
                    {/* RSVP button - fixed top-right, independent of content flow */}
                    <div className="absolute top-4 right-5 lg:top-5 lg:right-6">
                      <Button
                        asChild
                        className="h-auto rounded-none px-8 py-2.5 text-sm font-medium shadow-sm transition-all duration-300 hover:shadow-md"
                      >
                        <Link href={`./events/${event.id}`}>RSVP</Link>
                      </Button>
                    </div>

                    {/* Time + Date - minimal gap to title */}
                    <div>
                      {timeRange && timeRange !== "TBD" && (
                        <div className="text-xs font-medium text-gray-500">
                          {timeRange}
                        </div>
                      )}
                      {dateLong && (
                        <div className="text-sm font-medium text-gray-900">
                          {dateLong}
                        </div>
                      )}
                    </div>

                    {/* Title - tight to time/date */}
                    <h3 className="mb-2 mt-0.5 text-xl font-bold leading-tight text-gray-900 sm:text-2xl">
                      <Link
                        href={`./events/${event.id}`}
                        className="hover:underline"
                      >
                        {event.title}
                      </Link>
                    </h3>

                    {/* Location + Attendees */}
                    {(event.location || event.max_attendees != null) && (
                      <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-2">
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
                              {event.rsvpCount ?? 0}/{event.max_attendees} attending
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Description */}
                    {event.description && (
                      <p className="line-clamp-3 text-sm leading-relaxed text-gray-600 mt-0">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

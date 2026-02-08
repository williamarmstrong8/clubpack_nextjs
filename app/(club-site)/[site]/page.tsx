import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { AboutSection } from "./components/about-section"
import { EventsSection } from "./components/events-section"
import { HeroSection } from "./components/hero-section"
import { JoinSection } from "./components/join-section"
import type { ClubData, ClubEvent } from "./mock-data"

import { getClubBySubdomain, getUpcomingEventsByClubId, type ClubRow, type EventRow } from "@/lib/data/club-site"

function clubNameFromRow(club: ClubRow, fallback: string) {
  const name = typeof club.name === "string" ? club.name : null
  const headline = typeof club.hero_headline === "string" ? club.hero_headline : null
  const subdomain = typeof club.subdomain === "string" ? club.subdomain : null
  return (name || headline || subdomain || fallback).trim()
}

function clubDescriptionFromRow(club: ClubRow) {
  const desc = typeof club.description === "string" ? club.description : null
  const heroSubtext = typeof club.hero_subtext === "string" ? club.hero_subtext : null
  const tagline = typeof club.tagline === "string" ? club.tagline : null
  return (desc || heroSubtext || tagline || "").trim()
}

function clubLocationFromRow(club: ClubRow) {
  const loc = typeof club.location === "string" ? club.location : null
  const city = typeof club.city === "string" ? (club.city as string) : null
  const state = typeof club.state === "string" ? (club.state as string) : null
  return (
    (loc || [city, state].filter(Boolean).join(", ") || "Local").trim()
  )
}

function clubHeroImageFromRow(club: ClubRow) {
  const heroImage =
    (typeof club.hero_image_url === "string" && club.hero_image_url) ||
    (typeof club.hero_image === "string" && club.hero_image) ||
    (typeof club.heroImage === "string" && (club.heroImage as string)) ||
    ""

  // Fall back to an existing public asset so the hero never breaks.
  return heroImage || "/club-photos/happy-group.webp"
}

function formatEventDateLabel(isoDate: string | null) {
  if (!isoDate) return "TBD"
  const d = new Date(`${isoDate}T00:00:00`)
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

function formatEventTime(t: string | null) {
  const time = (t ?? "").trim()
  if (!time) return "TBD"
  if (/[ap]m$/i.test(time)) return time
  // Supports "HH:MM" or "HH:MM:SS"
  if (/^\d{2}:\d{2}(:\d{2})?$/.test(time)) {
    const date = new Date(`1970-01-01T${time}`)
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
      })
    }
  }
  return time
}

function toClubEvent(e: EventRow): ClubEvent {
  return {
    title: e.title ?? "Untitled",
    dateLabel: formatEventDateLabel(e.event_date),
    time: formatEventTime(e.event_time),
    location: e.location_name ?? "TBD",
    runType: "Run",
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ site: string }>
}): Promise<Metadata> {
  const { site } = await params
  const club = await getClubBySubdomain(site)
  if (!club) return { title: "ClubPack", description: "ClubPack club site" }

  const name = clubNameFromRow(club, site)
  const description =
    clubDescriptionFromRow(club) || "Join this club on ClubPack."

  return {
    title: `${name} | ClubPack`,
    description,
  }
}

export default async function ClubSiteHomePage({
  params,
}: {
  params: Promise<{ site: string }>
}) {
  const { site } = await params
  const club = await getClubBySubdomain(site)
  if (!club) notFound()

  const events = await getUpcomingEventsByClubId(club.id, 6)

  const clubData: ClubData = {
    name: clubNameFromRow(club, site),
    location: clubLocationFromRow(club),
    tagline: (club.tagline ?? club.hero_subtext ?? "").toString().trim(),
    heroImage: clubHeroImageFromRow(club),
    description: clubDescriptionFromRow(club),
  }

  const upcomingEvents: ClubEvent[] = events.map(toClubEvent)

  return (
    <div className="bg-background">
      <HeroSection club={clubData} />
      <AboutSection club={clubData} />
      <EventsSection events={upcomingEvents} />
      <JoinSection />
    </div>
  );
}
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { AboutSection } from "./components/about-section"
import { EventsSection } from "./components/events-section"
import { FaqsSection } from "./components/faqs-section"
import { HeroSection } from "./components/hero-section"
import { JoinSection } from "./components/join-section"
import type { ClubData, ClubEvent } from "./mock-data"

import { getClubBySubdomain, getUpcomingEventsByClubId, getFaqsByClubId, type ClubRow, type EventRow } from "@/lib/data/club-site"

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
  const imageUrl = 
    (typeof e.image_url === "string" && e.image_url) ||
    (typeof e.event_image === "string" && e.event_image) ||
    null;
    
  return {
    title: e.title ?? "Untitled",
    dateLabel: formatEventDateLabel(e.event_date),
    time: formatEventTime(e.event_time),
    endTime: e.end_time ? formatEventTime(e.end_time) : undefined,
    location: e.location_name ?? "TBD",
    runType: "Run",
    imageUrl: imageUrl || "/club-photos/happy-group.webp",
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

  // Fetch club's FAQs from `faqs` table (same as clubpack_code website template)
  const faqRows = await getFaqsByClubId(club.id)
  const defaultFaqs: Array<{ question: string; answer: string }> = [
    { question: "Do I need to sign up in advance?", answer: "RSVP helps us plan, but you can always show up! We welcome drop-ins. Just come a few minutes early to say hi." },
    { question: "What pace do you run?", answer: "We have a mix of paces — we regroup often so no one gets left behind. All levels are welcome, from walkers to seasoned runners." },
    { question: "What should I bring?", answer: "Bring water, wear comfortable shoes, and dress for the weather. If it's dark, reflective gear or a headlamp is recommended." },
    { question: "Is there a fee to join?", answer: "Nope — we're free and open to everyone. Just show up and enjoy the community." },
  ]

  const clubFaqs = faqRows
    .filter((row) => (row.question ?? "").trim() !== "")
    .map((row) => ({
      question: (row.question ?? "").trim(),
      answer: (row.answer ?? "").trim(),
    }))
  const faqs = clubFaqs.length > 0 ? clubFaqs : defaultFaqs

  return (
    <div className="bg-background">
      <HeroSection club={clubData} />
      <AboutSection club={clubData} />
      <EventsSection events={upcomingEvents} />
      <FaqsSection faqs={faqs} />
      <JoinSection />
    </div>
  );
}
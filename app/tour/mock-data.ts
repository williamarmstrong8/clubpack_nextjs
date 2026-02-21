/**
 * Mock data for the Take a Tour demo. No real APIs or databases are used.
 */

import type { ClubData, ClubEvent } from "@/app/(club-site)/[site]/mock-data";
import type { HomeStat, RecentActivityItem } from "@/app/(admin)/home/home-client";
import type { EventRow as AdminEventRow } from "@/app/(admin)/events/events-client";
import type { MemberRow as AdminMemberRow } from "@/app/(admin)/members/members-client";
import type { ClubWebsiteContent, ClubSettings, FaqRow } from "@/app/(admin)/website/website-client";

// Re-export types for convenience
export type { ClubData, ClubEvent };

/** Club site mock data (same shape as real club site page) */
export const tourClubData: ClubData = {
  name: "Outdoor Adventure Club",
  location: "Austin, TX",
  tagline: "Weekly runs, hikes, and community — all paces welcome.",
  heroImage: "/club-photos/happy-group.webp",
  description:
    "Outdoor Adventure Club is a welcoming community built around consistency and good vibes. Whether you're training for a race or just getting moving, show up as you are.",
};

export const tourUpcomingEvents: ClubEvent[] = [
  {
    id: "tour-e1",
    title: "Sunrise Social 5K",
    dateLabel: "Tue, Feb 25",
    eventDateIso: "2026-02-25",
    time: "6:30 AM",
    location: "Lady Bird Lake Trail",
    runType: "5K",
    imageUrl: "/tour/run-event.JPG",
    max_attendees: 30,
    rsvpCount: 12,
  },
  {
    id: "tour-e2",
    title: "Tempo + Coffee",
    dateLabel: "Thu, Feb 27",
    eventDateIso: "2026-02-27",
    time: "6:15 PM",
    location: "Zilker Park",
    runType: "Tempo",
    imageUrl: "/tour/outdoor-event.jpg",
    max_attendees: 25,
    rsvpCount: 8,
  },
  {
    id: "tour-e3",
    title: "Weekend Long Run",
    dateLabel: "Sat, Mar 1",
    eventDateIso: "2026-03-01",
    time: "8:00 AM",
    location: "Mueller Lake Park",
    runType: "Long Run",
    imageUrl: "/tour/nature-event.jpg",
    max_attendees: 40,
    rsvpCount: 18,
  },
];

export const tourFaqs: Array<{ question: string; answer: string }> = [
  {
    question: "Do I need to sign up in advance?",
    answer:
      "RSVP helps us plan, but you can always show up! We welcome drop-ins. Just come a few minutes early to say hi.",
  },
  {
    question: "Who can join?",
    answer:
      "Everyone is welcome. Our community is open to all — come as you are and get involved at your own pace.",
  },
  {
    question: "What should I expect at my first event?",
    answer:
      "Introduce yourself when you arrive. We'll make sure you feel welcome and help you connect with others.",
  },
];

/** Signup step: pre-filled values for the create-club form (display only) */
export const tourCreateClubForm = {
  clubName: "Outdoor Adventure Club",
  subdomain: "outdoor-adventure-club",
  suffix: ".joinclubpack.com",
};

/** Admin dashboard mock data */
export const tourAdminStats: HomeStat[] = [
  { title: "Total members", value: "478", delta: "52", deltaLabel: "new this month" },
  { title: "Total events", value: "22", delta: "5", deltaLabel: "upcoming events" },
  { title: "RSVPs this month", value: "1,045", delta: "156", deltaLabel: "this week" },
];

export const tourRecentActivity: RecentActivityItem[] = [
  { id: "a1", title: "Event created", detail: "Sunrise Social 5K", time: "2h ago" },
  { id: "a2", title: "New member joined", detail: "Alex M.", time: "5h ago" },
  { id: "a3", title: "Event updated", detail: "Tempo + Coffee", time: "1d ago" },
  { id: "a4", title: "New member joined", detail: "Sam K.", time: "2d ago" },
];

export const tourInviteUrl = "https://outdoor-adventure-club.joinclubpack.com/signup";

/** Admin Website & App page (WebsiteClient) */
export const tourWebsiteInitial: ClubWebsiteContent = {
  subdomain: "outdoor-adventure-club",
  name: tourClubData.name,
  hero_headline: "Welcome to Outdoor Adventure Club",
  hero_subtext: "Weekly runs, hikes, and community — all paces welcome.",
  tagline: tourClubData.tagline,
  instagram: null,
  about_blurb: tourClubData.description,
};

export const tourWebsiteSettings: ClubSettings = {
  show_event_calendar: true,
  show_contact_page: true,
  show_explore_page: true,
  require_login_to_rsvp: false,
};

export const tourWebsiteFaqs: FaqRow[] = tourFaqs.map((f, i) => ({
  id: `tour-faq-${i}`,
  question: f.question,
  answer: f.answer,
  order_index: i,
}));

export const tourRootDomain = "joinclubpack.com";

/** Admin events list (EventRow shape for EventsClient) */
export const tourAdminEvents: AdminEventRow[] = [
  {
    id: "tour-e1",
    title: "Sunrise Social 5K",
    event_date: "2026-02-25",
    event_time: "06:30",
    location_name: "Lady Bird Lake Trail",
    status: "published",
    max_attendees: 30,
    rsvpCount: 12,
    image_url: "/tour/run-event.JPG",
  },
  {
    id: "tour-e2",
    title: "Tempo + Coffee",
    event_date: "2026-02-27",
    event_time: "18:15",
    location_name: "Zilker Park",
    status: "published",
    max_attendees: 25,
    rsvpCount: 8,
    image_url: "/tour/outdoor-event.jpg",
  },
  {
    id: "tour-e3",
    title: "Weekend Long Run",
    event_date: "2026-03-01",
    event_time: "08:00",
    location_name: "Mueller Lake Park",
    status: "published",
    max_attendees: 40,
    rsvpCount: 18,
    image_url: "/tour/nature-event.jpg",
  },
];

/** Admin members list (MemberRow shape for MembersClient) */
export const tourAdminMembers: AdminMemberRow[] = [
  { id: "m1", name: "Alex Morgan", email: "alex@example.com", joined_at: "2026-02-18T10:00:00Z", phone: null, role: null, avatar_url: null },
  { id: "m2", name: "Sam Kim", email: "sam@example.com", joined_at: "2026-02-15T14:00:00Z", phone: null, role: null, avatar_url: null },
  { id: "m3", name: "Jordan Lee", email: "jordan@example.com", joined_at: "2026-02-10T09:00:00Z", phone: null, role: null, avatar_url: null },
  { id: "m4", name: "Taylor Chen", email: "taylor.chen@example.com", joined_at: "2026-02-12T11:30:00Z", phone: null, role: null, avatar_url: null },
  { id: "m5", name: "Morgan Davis", email: "morgan.d@example.com", joined_at: "2026-02-08T16:00:00Z", phone: null, role: null, avatar_url: null },
  { id: "m6", name: "Riley Johnson", email: "riley.j@example.com", joined_at: "2026-02-05T09:15:00Z", phone: null, role: null, avatar_url: null },
  { id: "m7", name: "Casey Williams", email: "casey.w@example.com", joined_at: "2026-02-03T14:45:00Z", phone: null, role: null, avatar_url: null },
  { id: "m8", name: "Jamie Martinez", email: "jamie.m@example.com", joined_at: "2026-01-28T10:00:00Z", phone: null, role: null, avatar_url: null },
  { id: "m9", name: "Quinn Anderson", email: "quinn.a@example.com", joined_at: "2026-01-25T08:30:00Z", phone: null, role: null, avatar_url: null },
  { id: "m10", name: "Avery Thompson", email: "avery.t@example.com", joined_at: "2026-01-22T12:00:00Z", phone: null, role: null, avatar_url: null },
  { id: "m11", name: "Drew Garcia", email: "drew.g@example.com", joined_at: "2026-01-18T15:20:00Z", phone: null, role: null, avatar_url: null },
  { id: "m12", name: "Skyler Brown", email: "skyler.b@example.com", joined_at: "2026-01-14T09:00:00Z", phone: null, role: null, avatar_url: null },
  { id: "m13", name: "Parker Wilson", email: "parker.w@example.com", joined_at: "2026-01-10T11:45:00Z", phone: null, role: null, avatar_url: null },
  { id: "m14", name: "Reese Moore", email: "reese.m@example.com", joined_at: "2026-01-05T13:30:00Z", phone: null, role: null, avatar_url: null },
  { id: "m15", name: "Cameron Taylor", email: "cameron.t@example.com", joined_at: "2025-12-28T10:15:00Z", phone: null, role: null, avatar_url: null },
];

/** For club navbar/footer in tour (no real user) */
export const tourClubNav = {
  site: "outdoor-adventure-club",
  clubName: tourClubData.name,
  clubLogo: null as string | null,
};

export const tourClubFooter = {
  name: tourClubData.name,
  tagline: tourClubData.tagline,
  instagram: null as string | null,
  contact_email: null as string | null,
};

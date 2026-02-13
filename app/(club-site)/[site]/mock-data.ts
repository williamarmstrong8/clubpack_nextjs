export type ClubData = {
  name: string;
  location: string;
  tagline: string;
  heroImage: string;
  description: string;
};

export type ClubEvent = {
  id: string;
  title: string;
  dateLabel: string;
  /** ISO date for full formatting (e.g. Thursday, June 25, 2026) */
  eventDateIso: string | null;
  time: string;
  endTime?: string;
  location: string;
  runType: string;
  imageUrl?: string;
  description?: string | null;
  max_attendees?: number | null;
  /** When set, show "X/Y attending" */
  rsvpCount?: number;
};

export const clubData: ClubData = {
  name: "Happy Mile Club",
  location: "Austin, TX",
  tagline: "A weekly run club for every pace — then coffee after.",
  heroImage: "/globe.svg",
  description:
    "Happy Mile Club is a welcoming run club built around consistency, community, and good vibes. Show up as you are — whether you're training for a PR or just getting moving.",
};

export const upcomingEvents: ClubEvent[] = [
  {
    id: "1",
    title: "Sunrise Social 5K",
    dateLabel: "Tue, Feb 11",
    eventDateIso: "2026-02-11",
    time: "6:30 AM",
    location: "Lady Bird Lake Trail",
    runType: "5K",
  },
  {
    id: "2",
    title: "Tempo + Treats",
    dateLabel: "Thu, Feb 13",
    eventDateIso: "2026-02-13",
    time: "6:15 PM",
    location: "Zilker Park",
    runType: "Tempo",
  },
  {
    id: "3",
    title: "Weekend Long Run",
    dateLabel: "Sat, Feb 15",
    eventDateIso: "2026-02-15",
    time: "8:00 AM",
    location: "Mueller Lake Park",
    runType: "Long Run",
  },
];


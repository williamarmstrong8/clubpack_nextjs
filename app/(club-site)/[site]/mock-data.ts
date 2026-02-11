export type ClubData = {
  name: string;
  location: string;
  tagline: string;
  heroImage: string;
  description: string;
};

export type ClubEvent = {
  title: string;
  dateLabel: string;
  time: string;
  endTime?: string;
  location: string;
  runType: string;
  imageUrl?: string;
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
    title: "Sunrise Social 5K",
    dateLabel: "Tue, Feb 11",
    time: "6:30 AM",
    location: "Lady Bird Lake Trail",
    runType: "5K",
  },
  {
    title: "Tempo + Treats",
    dateLabel: "Thu, Feb 13",
    time: "6:15 PM",
    location: "Zilker Park",
    runType: "Tempo",
  },
  {
    title: "Weekend Long Run",
    dateLabel: "Sat, Feb 15",
    time: "8:00 AM",
    location: "Mueller Lake Park",
    runType: "Long Run",
  },
];


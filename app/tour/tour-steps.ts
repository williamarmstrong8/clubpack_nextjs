/**
 * Tour step definitions: order, copy, and which background view to show.
 */

export type TourStepView =
  | "welcome"
  | "signup"
  | "side-by-side"
  | "club-focus"
  | "admin-dashboard"
  | "club-events"
  | "admin-website"
  | "admin-events"
  | "admin-members";

export type TourStep = {
  id: string;
  title: string;
  description: string;
  view: TourStepView;
};

export const TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to the ClubPack tour",
    description:
      "See how easy it is to build and manage your club. Create your club, get a live site and dashboard, and run events and members in one place.",
    view: "admin-dashboard",
  },
  {
    id: "signup",
    title: "Create your club",
    description:
      "Start by creating your club name and site's URL.",
    view: "signup",
  },
  {
    id: "side-by-side",
    title: "Your club site and dashboard",
    description:
      "Once your club is created, you get two things: a public-facing club site for members and events, and an admin dashboard to manage everything in one place.",
    view: "side-by-side",
  },
  {
    id: "club-focus",
    title: "Your club site",
    description:
      "Your club site includes a hero, about section, upcoming events, FAQs, and a clear call to join. Members can browse events and RSVP without leaving the site.",
    view: "club-focus",
  },
  {
    id: "club-events",
    title: "Club site events page",
    description:
      "Your public club site has a dedicated events page where members can browse upcoming events, see dates and locations, and RSVP. Events you create in the dashboard appear here automatically.",
    view: "club-events",
  },
  {
    id: "admin-dashboard",
    title: "Admin dashboard",
    description:
      "From the dashboard you can see member growth, event counts, and RSVPs at a glance. Quick actions let you create events and invite members without leaving the page.",
    view: "admin-dashboard",
  },
  {
    id: "admin-website",
    title: "Website & App",
    description:
      "Customize your club site from here: update your hero, about section, tagline, and FAQs. Changes go live on your public site right away.",
    view: "admin-website",
  },
  {
    id: "admin-members-page",
    title: "Members",
    description:
      "View and manage your member list. Invite new members with a link and keep your community growing.",
    view: "admin-members",
  },
  {
    id: "admin-events",
    title: "Manage events",
    description:
      "Create and edit events, set dates and locations, and track RSVPs. Your events automatically appear on your club site so members can discover and sign up.",
    view: "admin-events",
  },
  {
    id: "ready",
    title: "See how easy it is",
    description:
      "Ready to set up your club within minutes? Create your club, get a live site and dashboard, and start inviting members.",
    view: "welcome",
  },
];

export const TOUR_STEP_COUNT = TOUR_STEPS.length;

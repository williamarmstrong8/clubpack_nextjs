"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import { AdminShell } from "@/app/(admin)/components/admin-shell";
import { HomeClient } from "@/app/(admin)/home/home-client";
import { EventsClient } from "@/app/(admin)/events/events-client";
import { MembersClient } from "@/app/(admin)/members/members-client";
import { WebsiteClient } from "@/app/(admin)/website/website-client";
import { ClubNavbar } from "@/app/(club-site)/components/club-navbar";
import { ClubFooter } from "@/app/(club-site)/components/club-footer";
import { HeroSection } from "@/app/(club-site)/[site]/components/hero-section";
import { AboutSection } from "@/app/(club-site)/[site]/components/about-section";
import { EventsSection } from "@/app/(club-site)/[site]/components/events-section";
import { FaqsSection } from "@/app/(club-site)/[site]/components/faqs-section";
import { JoinSection } from "@/app/(club-site)/[site]/components/join-section";

import { useTour } from "../context/tour-context";
import type { TourStepView } from "../tour-steps";
import {
  tourClubData,
  tourUpcomingEvents,
  tourFaqs,
  tourClubNav,
  tourClubFooter,
  tourAdminStats,
  tourRecentActivity,
  tourInviteUrl,
  tourAdminEvents,
  tourAdminMembers,
  tourWebsiteInitial,
  tourWebsiteSettings,
  tourWebsiteFaqs,
  tourRootDomain,
} from "../mock-data";
import { TourCreateClubForm } from "./tour-create-club-form";

function WelcomeView() {
  return (
    <motion.div
      className="flex min-h-dvh w-full items-center justify-center bg-muted/30 p-6 md:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
    </motion.div>
  );
}

function ClubSiteContent() {
  return (
    <div className="bg-background text-foreground min-h-dvh flex flex-col">
      <ClubNavbar
        site={tourClubNav.site}
        clubName={tourClubNav.clubName}
        clubLogo={tourClubNav.clubLogo}
        user={null}
        memberAvatarUrl={null}
      />
      <main className="flex-1">
        <HeroSection club={tourClubData} />
        <AboutSection club={tourClubData} />
        <EventsSection events={tourUpcomingEvents} />
        <FaqsSection faqs={tourFaqs} />
        <JoinSection />
      </main>
      <ClubFooter club={tourClubFooter} hasPolicy={false} policyHref="#" />
    </div>
  );
}

function SignupView() {
  const { tourClubName, tourSubdomain, signupPhase, setTourClubName, goNext } = useTour();
  const interactive = signupPhase === "active";
  return (
    <motion.div
      className="flex min-h-dvh w-full items-center justify-center bg-muted/30 p-6 md:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
      >
        <TourCreateClubForm
          clubName={interactive ? tourClubName : ""}
          subdomain={interactive ? tourSubdomain : ""}
          interactive={interactive}
          onClubNameChange={setTourClubName}
          onContinue={goNext}
        />
      </motion.div>
    </motion.div>
  );
}

function SideBySideView() {
  const { tourSubdomain } = useTour();
  const displaySubdomain = tourSubdomain.trim() || "outdoor-adventure-club";
  const clubSiteUrl = `${displaySubdomain}.joinclubpack.com`;

  return (
    <motion.div
      className="flex min-h-dvh w-full items-center justify-center gap-6 bg-muted/30 p-6 md:flex-row md:gap-8 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      {/* Club site card (left) with browser URL bar — 4:3 aspect ratio */}
      <motion.div
        className="w-full max-w-[480px] flex-1 shrink-0 aspect-[4/3] md:max-w-[42%]"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          {/* Browser chrome: dots + URL */}
          <div className="flex shrink-0 items-center gap-2 border-b border-border bg-muted/50 px-3 py-2">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex flex-1 items-center justify-center">
              <span className="rounded-md bg-background px-3 py-1 text-xs text-muted-foreground font-mono">
                https://{clubSiteUrl}
              </span>
            </div>
            <div className="w-[52px]" aria-hidden />
          </div>
          <div className="min-h-0 flex-1 overflow-auto bg-background">
            <div className="scale-[0.5] origin-top-left w-[200%] min-h-[200%] md:scale-[0.55] md:w-[181.8%] md:min-h-[181.8%]">
              <ClubSiteContent />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Admin dashboard card (right) — 4:3 aspect ratio */}
      <motion.div
        className="w-full max-w-[480px] flex-1 shrink-0 aspect-[4/3] md:max-w-[42%]"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.08 }}
      >
        <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          {/* Browser chrome for admin */}
          <div className="flex shrink-0 items-center gap-2 border-b border-border bg-muted/50 px-3 py-2">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex flex-1 items-center justify-center">
              <span className="rounded-md bg-background px-3 py-1 text-xs text-muted-foreground font-mono">
                https://my.joinclubpack.com
              </span>
            </div>
            <div className="w-[52px]" aria-hidden />
          </div>
          <div className="min-h-0 flex-1 overflow-auto bg-background">
            <div className="scale-[0.5] origin-top-left w-[200%] min-h-[200%] md:scale-[0.55] md:w-[181.8%] md:min-h-[181.8%]">
              <AdminShell
                user={{ name: "Demo User", role: "Admin" }}
                memberCount={478}
                titleOverride="Dashboard"
                hideMemberLimitBanner
              >
                <HomeClient
                  stats={tourAdminStats}
                  recentActivity={tourRecentActivity}
                  inviteUrl={tourInviteUrl}
                />
              </AdminShell>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ClubFocusView() {
  return (
    <div className="min-h-dvh w-full overflow-auto bg-background">
      <motion.div
        initial={{ scale: 0.94, opacity: 0.85 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="min-h-dvh origin-top"
      >
        <ClubSiteContent />
      </motion.div>
    </div>
  );
}

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

function ClubEventsView() {
  return (
    <div className="min-h-dvh w-full overflow-auto bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-dvh flex flex-col bg-white"
      >
        <ClubNavbar
          site={tourClubNav.site}
          clubName={tourClubNav.clubName}
          clubLogo={tourClubNav.clubLogo}
          user={null}
          memberAvatarUrl={null}
          variant="dark"
        />
        <main className="flex-grow bg-white pt-28 pb-20">
          <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                Upcoming Events
              </h1>
              <p className="text-lg text-gray-700 sm:text-xl">
                Join us at our upcoming events and activities
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tourUpcomingEvents.map((event) => {
                const dateLong = formatDateLong(event.eventDateIso ?? null);
                const timeRange = event.endTime
                  ? `${event.time} – ${event.endTime}`
                  : event.time;
                const imageUrl = event.imageUrl || "/club-photos/happy-group.webp";
                return (
                  <div
                    key={event.id}
                    className="flex flex-col overflow-hidden border border-gray-200 bg-white transition-all duration-300 hover:border-gray-300"
                  >
                    <Link
                      href={`/events/${event.id}`}
                      className="relative block aspect-video w-full shrink-0"
                    >
                      <Image
                        src={imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </Link>
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
                          <Link
                            href={`/events/${event.id}`}
                            className="hover:underline"
                          >
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
                                  {event.rsvpCount ?? 0}/{event.max_attendees}{" "}
                                  attending
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
                        <Link href={`/events/${event.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </motion.div>
    </div>
  );
}

function AdminDashboardView() {
  return (
    <motion.div
      className="min-h-dvh w-full overflow-auto bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AdminShell
        user={{ name: "Demo User", role: "Admin" }}
        memberCount={478}
        titleOverride="Dashboard"
        sidebarActivePath="/home"
        hideMemberLimitBanner
      >
        <HomeClient
          stats={tourAdminStats}
          recentActivity={tourRecentActivity}
          inviteUrl={tourInviteUrl}
        />
      </AdminShell>
    </motion.div>
  );
}

function AdminWebsiteView() {
  return (
    <motion.div
      className="min-h-dvh w-full overflow-auto bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AdminShell
        user={{ name: "Demo User", role: "Admin" }}
        memberCount={478}
        titleOverride="Website & App"
        sidebarActivePath="/website"
        hideMemberLimitBanner
      >
        <WebsiteClient
          initial={tourWebsiteInitial}
          settings={tourWebsiteSettings}
          faqs={tourWebsiteFaqs}
          rootDomain={tourRootDomain}
        />
      </AdminShell>
    </motion.div>
  );
}

function AdminEventsView() {
  return (
    <motion.div
      className="min-h-dvh w-full overflow-auto bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AdminShell
        user={{ name: "Demo User", role: "Admin" }}
        memberCount={478}
        titleOverride="Events"
        sidebarActivePath="/events"
        hideMemberLimitBanner
      >
        <EventsClient events={tourAdminEvents} />
      </AdminShell>
    </motion.div>
  );
}

function AdminMembersView() {
  return (
    <motion.div
      className="min-h-dvh w-full overflow-auto bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AdminShell
        user={{ name: "Demo User", role: "Admin" }}
        memberCount={478}
        titleOverride="Members"
        sidebarActivePath="/members"
        hideMemberLimitBanner
      >
        <MembersClient
          members={tourAdminMembers}
          inviteUrl={tourInviteUrl}
          newMembersThisMonth={52}
          adminCount={3}
          totalMembers={478}
        />
      </AdminShell>
    </motion.div>
  );
}

const viewMap: Record<
  TourStepView,
  () => React.ReactNode
> = {
  welcome: () => <WelcomeView />,
  signup: () => <SignupView />,
  "side-by-side": () => <SideBySideView />,
  "club-focus": () => <ClubFocusView />,
  "admin-dashboard": () => <AdminDashboardView />,
  "club-events": () => <ClubEventsView />,
  "admin-website": () => <AdminWebsiteView />,
  "admin-events": () => <AdminEventsView />,
  "admin-members": () => <AdminMembersView />,
};

const ADMIN_VIEWS: TourStepView[] = ["admin-dashboard", "admin-website", "admin-events", "admin-members"];

function tourViewKey(view: TourStepView): string {
  return ADMIN_VIEWS.includes(view) ? "admin" : view;
}

export function TourBackground() {
  const { step } = useTour();
  const view = step?.view ?? "welcome";
  const RenderView = viewMap[view];
  const key = tourViewKey(view);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.35,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {RenderView()}
      </motion.div>
    </AnimatePresence>
  );
}

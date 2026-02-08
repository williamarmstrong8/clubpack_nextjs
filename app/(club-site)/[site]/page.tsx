import { AboutSection } from "./components/about-section";
import { EventsSection } from "./components/events-section";
import { HeroSection } from "./components/hero-section";
import { JoinSection } from "./components/join-section";
import { clubData, upcomingEvents } from "./mock-data";

export default function ClubSiteHomePage() {
  return (
    <div className="bg-background">
      <HeroSection club={clubData} />
      <AboutSection club={clubData} />
      <EventsSection events={upcomingEvents} />
      <JoinSection />
    </div>
  );
}
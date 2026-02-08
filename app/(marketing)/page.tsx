import HeroSection from "./components/home/HeroSection";
import TrustedClubsSection from "./components/home/TrustedClubsSection";
import ProblemSection from "./components/home/ProblemSection";
import SolutionSection from "./components/home/SolutionSection";
import CTASection from "./components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustedClubsSection />
      <ProblemSection />
      <SolutionSection />
      <CTASection />
    </>
  );
}

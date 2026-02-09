import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Features",
};

const APP_ORIGIN = "https://my.joinclubpack.com";

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" className="w-3.5 h-3.5" aria-hidden="true">
      <path
        d="M16 6l-7.5 8L4 10.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FeatureIcon({ name }: { name: "globe" | "users" | "calendar" | "chart" | "toolkit" }) {
  const common = "w-7 h-7 text-white";
  switch (name) {
    case "globe":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3c3.5 3.5 3.5 14 0 18" />
          <path d="M12 3c-3.5 3.5-3.5 14 0 18" />
        </svg>
      );
    case "users":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "calendar":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="3" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      );
    case "chart":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="M8 17v-6" />
          <path d="M12 17V8" />
          <path d="M16 17v-3" />
        </svg>
      );
    case "toolkit":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 7l-4 4" />
          <path d="M3 21l6-6" />
          <path d="M16 3a5 5 0 0 0 5 5c0 6-5 11-11 11a5 5 0 0 0-5-5C5 8 10 3 16 3z" />
        </svg>
      );
  }
}

export default function FeaturesPage() {
  const features = [
    {
      icon: "globe" as const,
      title: "Branded Club Website",
      description: "A professional website — built to match your club's brand.",
      details: [
        "Custom subdomain (e.g. yourclub.clubpack.com)",
        "Club logo, colors, and branding",
        "Mobile-optimized and SEO-friendly",
        "Event creation and RSVP tracking",
      ],
      image: "/landing_images/website.png",
    },
    {
      icon: "users" as const,
      title: "Member Sign-Up & Directory",
      description: "Streamline how new members join and stay organized.",
      details: [
        "Customizable sign-up form",
        "Auto-add to your member directory",
        "Member roles and permissions",
        "Exportable contact info",
      ],
      image: "/landing_images/member-directory.png",
    },
    {
      icon: "calendar" as const,
      title: "Event Planning & Templates",
      description: "Plan better events with less overhead.",
      details: [
        "Create and manage upcoming events",
        "Invite members and track RSVPs",
        "Browse or customize prebuilt event templates",
        "Add event photos, location, and post-run notes",
      ],
      image: "/landing_images/events.png",
    },
    {
      icon: "chart" as const,
      title: "Admin Dashboard & Tools",
      description: "One hub to manage everything behind the scenes.",
      details: [
        "Website & App: Customize your club's public site and app",
        "Members: Manage people, roles, and permissions",
        "Events: See and edit past/upcoming events + attendance data",
        "Event Ideas Library: Built-in inspiration for new event formats",
      ],
      image: "/landing_images/admin-dashboard.png",
    },
    {
      icon: "toolkit" as const,
      title: "Leadership Toolkit",
      description: "Seamless handoffs when leadership changes.",
      details: [
        "Transition checklists and documentation templates",
        "Event history and sponsor/vendor records",
        "Training and onboarding guide for new admins",
        "Shared notes, contacts, and passwords",
      ],
      image: "/landing_images/leadership-handoff.png",
    },
  ];

  return (
    <>
      <section className="pt-32 pb-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0YxRjVGOSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-50" />
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 lg:px-16 w-full text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 mb-6 tracking-tight leading-[1.1]">
            Everything You Need to <br className="hidden sm:block" /> Run Your
            Club
          </h1>

          <p className="text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            ClubPack provides the tools, automation, and insights you need to
            build and grow a thriving community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              className="h-auto bg-[#0054f9] hover:bg-[#0040d6] text-white px-8 py-3 rounded-xl font-normal text-base transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <a
                href={`${APP_ORIGIN}/signup`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Start Building Free
              </a>
            </Button>
            <Button
              asChild
              variant="secondary"
              className="h-auto bg-gray-100 hover:bg-gray-200 text-gray-900 px-8 py-3 rounded-xl font-normal text-base transition-colors duration-200"
            >
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0YxRjVGOSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-50" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 lg:px-16 w-full relative z-10">
          <div className="space-y-24">
            {features.map((feature, index) => {
              const reversed = index % 2 === 1;
              return (
                <div
                  key={feature.title}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                    reversed ? "lg:grid-flow-col-dense" : ""
                  }`}
                >
                  <div className={reversed ? "lg:col-start-2" : ""}>
                    <div className="w-14 h-14 bg-[#0054f9] rounded-2xl flex items-center justify-center mb-6 shadow-[0_8px_16px_-4px_rgba(0,84,249,0.3)]">
                      <FeatureIcon name={feature.icon} />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {feature.title}
                    </h3>

                    <p className="text-gray-600 text-base mb-8 leading-relaxed">
                      {feature.description}
                    </p>

                    <div className="space-y-3">
                      {feature.details.map((detail) => (
                        <div
                          key={detail}
                          className="flex items-start space-x-3"
                        >
                          <div className="w-5 h-5 bg-[#0054f9] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white">
                            <CheckIcon />
                          </div>
                          <span className="text-gray-700 text-base leading-relaxed">
                            {detail}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={reversed ? "lg:col-start-1" : ""}>
                    <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-100 aspect-[16/10]">
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-40">
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl" />
        </div>

        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 lg:px-16 w-full relative z-10">
          <div className="bg-[#0054f9] rounded-[2.5rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,84,249,0.25)] border border-blue-400/20">
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
                Ready to Transform Your Club?
              </h2>
              <p className="text-2xl text-blue-50/80 mb-10 leading-relaxed">
                Join hundreds of clubs already using ClubPack to build stronger
                communities.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button
                  asChild
                  className="h-auto bg-white text-[#0054f9] hover:bg-gray-50 px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98] w-full sm:w-auto"
                >
                  <a
                    href={`${APP_ORIGIN}/signup`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Started Free
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-auto bg-transparent text-white border-2 border-white/20 hover:bg-white/5 px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-200 w-full sm:w-auto backdrop-blur-sm"
                >
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

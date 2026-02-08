import Image from "next/image";

const APP_ORIGIN = "https://my.joinclubpack.com";

const MESSAGES = [
  {
    id: 1,
    app: "Instagram",
    logo: "/logos/Instagram_icon.png",
    user: "@run_member",
    text: "Tagged you in a story: 'Best workout with the club!'",
    time: "2m ago",
  },
  {
    id: 2,
    app: "Strava",
    logo: "/logos/strava.png",
    user: "Run Club",
    text: "3 new members joined the 'Winter Miles' challenge.",
    time: "5m ago",
  },
  {
    id: 3,
    app: "Eventbrite",
    logo: "/logos/eventbrite.png",
    user: "Ticket Sales",
    text: "New order: 3 VIP tickets sold. $150.00 total.",
    time: "12m ago",
  },
];

const appLogos = [
  { name: "Square", src: "/logos/square-logo.png" },
  { name: "Eventbrite", src: "/logos/eventbrite.png" },
  { name: "Partiful", src: "/logos/partiful.png" },
  { name: "Strava", src: "/logos/strava.png" },
  { name: "Squarespace", src: "/logos/squarespace.png" },
  { name: "Sweatpals", src: "/logos/sweatpals.png" },
  { name: "Venmo", src: "/logos/Venmo_logo.png" },
  { name: "Google Maps", src: "/logos/google-maps.png" },
  { name: "Instagram", src: "/logos/Instagram_icon.png" },
];

export default function ProblemSection() {
  return (
    <section className="pt-24 pb-12 bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-8 sm:px-12 lg:px-16 w-full">
        <div className="text-left mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-4">
            Managing a Club is Difficult
          </h2>
          <p className="text-2xl text-gray-600">
            Every club leader knows the struggle of managing multiple tools and
            keeping everyone connected.
          </p>
        </div>

        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Too many softwares
                </h3>
                <p className="text-gray-600 text-base mb-4 leading-relaxed">
                  Running a club requires juggling multiple tools with scattered
                  logins and details across different platforms.
                </p>
                <a
                  href={`${APP_ORIGIN}/signup`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-normal py-3 px-10 rounded-xl mb-4 transition-colors duration-200"
                >
                  Explore our solution
                </a>
              </div>

              <div className="space-y-3 -mx-8 mb-8 mt-auto overflow-hidden">
                <div className="overflow-hidden">
                  <div className="flex gap-3 cp-marquee-right px-8">
                    {[...appLogos.slice(0, 5), ...appLogos.slice(0, 5)].map(
                      (app, idx) => (
                        <div
                          key={`${app.name}-${idx}`}
                          className="relative w-20 h-20 shrink-0"
                        >
                          <Image
                            src={app.src}
                            alt={app.name}
                            fill
                            sizes="80px"
                            className="object-contain rounded-2xl"
                          />
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="overflow-hidden">
                  <div className="flex gap-3 cp-marquee-left px-8">
                    {[...appLogos.slice(5, 9), ...appLogos.slice(5, 9)].map(
                      (app, idx) => (
                        <div
                          key={`${app.name}-${idx}`}
                          className="relative w-20 h-20 shrink-0"
                        >
                          <Image
                            src={app.src}
                            alt={app.name}
                            fill
                            sizes="80px"
                            className="object-contain rounded-2xl"
                          />
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  No club analytics
                </h3>
                <p className="text-gray-600 text-base mb-4 leading-relaxed">
                  Clubs struggle to understand performance, member engagement,
                  and growth without clear data.
                </p>
                <a
                  href={`${APP_ORIGIN}/signup`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-normal py-3 px-10 rounded-xl mb-4 transition-colors duration-200"
                >
                  Get better analytics
                </a>
              </div>

              <div className="-mx-8 mb-0 mt-auto pt-8 pb-8">
                <div className="flex items-end justify-center gap-2 h-48">
                  <div className="w-8 bg-gray-200 rounded-t-sm h-[55%]" />
                  <div className="w-8 bg-gray-200 rounded-t-sm h-[75%]" />
                  <div className="w-8 bg-gray-200 rounded-t-sm h-[92%]" />
                  <div className="w-8 bg-gray-200 rounded-t-sm h-[65%]" />
                  <div className="w-8 bg-gray-200 rounded-t-sm h-[85%]" />
                  <div className="w-8 bg-gray-200 rounded-t-sm h-[97%]" />
                  <div className="w-8 bg-gray-200 rounded-t-sm h-[70%]" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Communication chaos
                </h3>
                <p className="text-gray-600 text-base mb-4 leading-relaxed">
                  Keeping members informed and aligned across multiple channels
                  is messy and time-consuming.
                </p>
                <a
                  href={`${APP_ORIGIN}/signup`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-normal py-3 px-10 rounded-xl mb-6 transition-colors duration-200"
                >
                  Consolidate the chaos
                </a>
              </div>

              <div className="space-y-3 -mx-8 -mb-2 px-8">
                {MESSAGES.map((msg) => (
                  <div
                    key={msg.id}
                    className="bg-white/90 backdrop-blur-sm p-3.5 rounded-[24px] shadow-sm border border-gray-100 flex items-center gap-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 relative">
                      <Image
                        src={msg.logo}
                        alt={msg.app}
                        fill
                        sizes="48px"
                        className="object-contain rounded-xl"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className="font-bold text-[15px] text-gray-900 truncate">
                          {msg.app}
                        </span>
                        <span className="text-[11px] text-gray-400 whitespace-nowrap ml-2">
                          {msg.time}
                        </span>
                      </div>
                      <p className="text-[13px] text-gray-600 leading-tight line-clamp-2">
                        <span className="font-semibold text-gray-700">
                          {msg.user}
                        </span>{" "}
                        {msg.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 lg:mt-8 relative rounded-2xl overflow-hidden shadow-lg h-[600px]">
            <Image
              src="/club-photos/happy-group.jpeg"
              alt="Happy club members"
              fill
              sizes="(max-width: 1440px) 100vw, 1440px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />

            <div className="relative z-10 h-full flex flex-col justify-start p-8 lg:p-12">
              <div>
                <h3 className="text-2xl lg:text-3xl font-medium text-white mb-3">
                  Focus on what really matters
                </h3>
                <p className="text-white/90 text-base lg:text-md mb-6 leading-relaxed max-w-2xl">
                  Stop juggling multiple tools and start building your
                  community. ClubPack brings everything together in one place so
                  you can focus on what you do best—growing your club.
                </p>
                <a
                  href={`${APP_ORIGIN}/signup`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-[#0054f9] hover:bg-neutral-900 text-white text-base lg:text-md py-2 px-4 rounded-xl transition-colors duration-200"
                >
                  Get started today
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

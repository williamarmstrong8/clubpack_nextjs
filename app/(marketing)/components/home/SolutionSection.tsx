import Image from "next/image";
import Link from "next/link";

const APP_ORIGIN = "https://my.joinclubpack.com";

const COLUMN_1_IMAGES = [
  "/solution/happy-club.png",
  "/solution/faq.png",
  "/solution/photo-club.png",
  "/solution/happy-contact.png",
  "/solution/SF-pickle-club.png",
  "/solution/happy-events.png",
  "/solution/sky-club.png",
  "/solution/upcoming-events.png",
];

const COLUMN_2_IMAGES = [
  "/solution/happy-events.png",
  "/solution/photo-club.png",
  "/solution/faq.png",
  "/solution/happy-club.png",
  "/solution/upcoming-events.png",
  "/solution/SF-pickle-club.png",
  "/solution/happy-contact.png",
  "/solution/sky-club.png",
];

function VerticalMarquee({
  images,
  direction,
  durationSeconds,
  offset = 0,
}: {
  images: string[];
  direction: "up" | "down";
  durationSeconds: number;
  offset?: number;
}) {
  const safeOffset = images.length
    ? ((offset % images.length) + images.length) % images.length
    : 0;
  const orderedImages =
    safeOffset === 0
      ? images
      : [...images.slice(safeOffset), ...images.slice(0, safeOffset)];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div
        className={`flex flex-col gap-4 ${
          direction === "up" ? "cp-vertical-marquee-up" : "cp-vertical-marquee-down"
        }`}
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        {[...orderedImages, ...orderedImages].map((src, idx) => (
          <div key={`${src}-${idx}`} className="relative aspect-[16/9] w-full shrink-0 px-2">
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover border border-gray-100 shadow-sm rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SolutionSection() {
  return (
    <section className="pt-24 pb-12 bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-8 sm:px-12 lg:px-16 w-full">
        {/* Header */}
        <div className="text-left mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-4">
            Everything You Need, All in One Place
          </h2>
          <p className="text-2xl text-gray-600">
            ClubPack eliminates the complexity with integrated tools designed specifically for club management.
          </p>
        </div>

        {/* Solution Cards */}
        <div className="w-full space-y-6 lg:space-y-8">
          {/* Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Wide Card - Scrolling Image Carousel */}
            <div className="lg:col-span-2 relative rounded-2xl overflow-hidden shadow-sm border border-gray-100 min-h-[450px] max-h-[570px] bg-white px-3">
              <div className="grid grid-cols-2 gap-2 h-full">
                <VerticalMarquee
                  images={COLUMN_1_IMAGES}
                  direction="up"
                  durationSeconds={75}
                />
                <VerticalMarquee
                  images={COLUMN_2_IMAGES}
                  direction="down"
                  durationSeconds={83}
                  offset={3}
                />
              </div>
              
            </div>

            {/* Standard Card - Website Description */}
            <div className="lg:col-span-1 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col h-full">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-2">
                  Beautiful website out of the box
                </h3>
                <p className="text-gray-600 text-base mb-8 leading-relaxed">
                  You get a custom website with beautiful design on signup. Showcase your club&apos;s story, events, and community with a professional online presence that converts visitors into members.
                </p>

                {/* 3 Mins Visual */}
                <div className="mb-10 py-10 flex flex-col items-center justify-center border-y border-gray-100 bg-gray-50/30 rounded-xl">
                  <span className="text-7xl font-black text-gray-900 tracking-tighter">3 mins</span>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-[0.2em] mt-3">Published Online</p>
                </div>

                <div className="flex justify-center w-full">
                <a
                  href="https://my.joinclubpack.com/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-[#0054f9] hover:bg-[#0040d6] text-white font-normal py-3 px-10 rounded-xl transition-colors duration-200"
                >
                  Create my site
                </a>
              </div>
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Standard Card - Admin Dashboard Description with Image */}
            <div className="lg:col-span-1 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col h-full relative overflow-hidden">
              <div className="flex-1 relative z-10" />

              <div className="absolute bottom-0 left-1 w-[110%] h-[360px] translate-x-24 -translate-y-10 scale-125">
                <Image
                  src="/solution/sidebar.png"
                  alt="ClubPack sidebar interface"
                  fill
                  sizes="400px"
                  className="object-contain object-left-bottom rounded-xl border border-gray-200 shadow-lg"
                />
              </div>
            </div>

            {/* Wide Card - Analytics & Insights */}
            <div className="lg:col-span-2 relative rounded-2xl overflow-hidden shadow-sm border border-gray-100 min-h-[500px] bg-white p-8 flex flex-col justify-between">
              {/* Wave Graph Background */}
              <svg
                className="absolute top-0 left-0 right-0 w-full h-3/4"
                viewBox="0 0 1200 500"
                preserveAspectRatio="none"
                style={{ opacity: 50 }}
              >
                <path
                  d="M0,280 Q100,180 200,240 T350,200 Q450,150 550,220 T750,180 Q850,230 950,200 T1200,240 L1200,500 L0,500 Z"
                  fill="url(#waveGradient)"
                />
                <path
                  d="M0,280 Q100,180 200,240 T350,200 Q450,150 550,220 T750,180 Q850,230 950,200 T1200,240"
                  fill="none"
                  stroke="#0054f9"
                  strokeWidth="3"
                  className="drop-shadow-sm"
                />
                <defs>
                  <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0054f9" stopOpacity="0.5" />
                    <stop offset="50%" stopColor="#0054f9" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#E8F0FE" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Cards Container */}
              <div className="relative z-10 flex gap-16 items-center justify-start flex-1 px-4 py-8">
                {/* Events Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-[400px] hover:shadow-2xl transition-all duration-300 overflow-hidden group flex">
                  <div className="relative w-44 shrink-0">
                    <Image
                      src="/solution/event-image.jpeg"
                      alt="Event"
                      fill
                      sizes="176px"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-center">
                    <h4 className="text-lg font-bold text-gray-900 mb-1">Club Social Mixer</h4>
                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <p className="text-xs font-medium text-gray-500">Friday, Jan 24 • 7:00 PM</p>
                    </div>
                    <a
                      href={APP_ORIGIN + "/signup"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center bg-[#0054f9] hover:bg-[#0040d6] text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] text-sm"
                    >
                      Create Event
                    </a>
                  </div>
                </div>

                {/* Member & Analytics Stack */}
                <div className="flex flex-col gap-4">
                  {/* Member Card */}
                  <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100 w-64 hover:shadow-2xl transition-all duration-300 group">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#0054f9] to-[#0040d6] rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-inner rotate-3 group-hover:rotate-0 transition-transform duration-300">
                          S
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="text-lg font-bold text-gray-900">Sarah J.</h4>
                          <span className="bg-blue-50 text-[#0054f9] text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-tighter">New</span>
                        </div>
                        <p className="text-xs font-semibold text-gray-400">Member since Jan 15</p>
                      </div>
                    </div>
                  </div>

                  {/* Analytics Mini Card */}
                  <div className="bg-white rounded-2xl p-4 shadow-xl border border-gray-100 w-64 hover:shadow-2xl transition-all duration-300 mt-2 ml-4">
                    <div className="grid grid-cols-3 gap-1 items-center">
                      <div className="text-center">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">Members</p>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-lg font-bold text-gray-900">142</span>
                          <span className="text-[10px] text-green-600 font-bold">↑12%</span>
                        </div>
                      </div>
                      <div className="text-center border-x border-gray-100">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">RSVPs</p>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-lg font-bold text-gray-900">84</span>
                          <span className="text-[10px] text-green-600 font-bold">↑24%</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">Events</p>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-lg font-bold text-gray-900">12</span>
                          <span className="text-[10px] text-green-600 font-bold">↑8%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Text Section */}
              <div className="relative z-10 mt-auto">
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  Events, members, analytics. All in one place.
                </h3>
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  Manage your club&apos;s events, track member growth and engagement, and access real-time analytics to make data-driven decisions that grow your community.
                </p>
                <Link
                  href="/features"
                  className="inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 px-8 rounded-xl transition-colors duration-200"
                >
                  Explore Features
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
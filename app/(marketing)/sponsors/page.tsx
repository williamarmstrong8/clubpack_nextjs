import Link from "next/link";

export const metadata = {
  title: "For Sponsors",
};

export default function SponsorsPage() {
  const benefits = [
    {
      title: "Discover & Connect",
      description:
        "Browse active clubs across campuses and find the right partnerships for your brand.",
    },
    {
      title: "Everything in One Place",
      description:
        "Club details, performance signals, and outreach — centralized for faster sponsorship management.",
    },
    {
      title: "Verified Partnerships",
      description:
        "Lightweight agreements and clear expectations built in for secure, transparent deals.",
    },
  ];

  const features = [
    {
      title: "Access to 500+ Clubs",
      description:
        "Connect with student organizations across multiple campuses and demographics.",
      details: [
        "Browse by campus, size, and interests",
        "Detailed club profiles and member counts",
        "Contact info and social links",
      ],
    },
    {
      title: "Analytics & Insights",
      description:
        "Track campaign performance and get clear reporting on sponsorship ROI.",
      details: [
        "Campaign performance tracking",
        "ROI measurement and reporting",
        "Student engagement signals",
      ],
    },
    {
      title: "Streamlined Process",
      description:
        "From discovery to deal closure in minutes with a guided workflow.",
      details: [
        "Simple sponsorship offers",
        "Automated paperwork",
        "Payment processing support",
      ],
    },
    {
      title: "Secure & Compliant",
      description:
        "Enterprise-grade security with best practices for educational partnerships.",
      details: ["Privacy-first handling", "Encryption in transit", "Audit-friendly records"],
    },
  ];

  const testimonials = [
    {
      quote:
        "ClubPack made it incredibly easy to find and partner with student clubs. The platform is intuitive and the results exceeded our expectations.",
      author: "Sarah Chen",
      role: "Marketing Director",
      company: "TechStart Inc.",
    },
    {
      quote:
        "We've seen a big increase in student engagement since partnering with clubs through ClubPack. The platform is game-changing.",
      author: "Michael Rodriguez",
      role: "Brand Manager",
      company: "Campus Connect",
    },
  ];

  return (
    <>
      <section className="relative pt-32 pb-24 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0YxRjVGOSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-50" />
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 lg:px-16 w-full text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-[#0054f9] px-4 py-2 rounded-full text-sm font-bold mb-6">
            <span className="w-2 h-2 rounded-full bg-[#0054f9]" />
            <span>For Sponsors</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 mb-6 tracking-tight leading-[1.1]">
            Partner with Social Clubs Nationwide
          </h1>

          <p className="text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
            Discover, connect, and collaborate with clubs through ClubPack. Join
            as a verified sponsor and start partnering faster.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600 mb-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0054f9]" />
              <span className="font-semibold">500+ Active Clubs</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0054f9]" />
              <span className="font-semibold">Faster Deals</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0054f9]" />
              <span className="font-semibold">Verified Partners</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="bg-[#0054f9] hover:bg-[#0040d6] text-white px-8 py-4 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-200 inline-flex items-center gap-2"
            >
              <span>Contact Us</span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/contact"
              className="border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 px-8 py-4 rounded-xl font-semibold transition-all duration-200"
            >
              Schedule Demo
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0YxRjVGOSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-50" />
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 lg:px-16 w-full relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 mb-4 tracking-tight leading-[1.1]">
              Why Choose ClubPack?
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
              Streamline your sponsorship process with tools designed for
              brand-club partnerships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300 text-center h-full"
              >
                <div className="w-16 h-16 bg-[#0054f9] rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-[0_8px_16px_-4px_rgba(0,84,249,0.3)] text-white text-2xl font-black">
                  •
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0YxRjVGOSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-50" />
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 lg:px-16 w-full relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-[#0054f9] px-4 py-2 rounded-full text-sm font-bold mb-6">
              <span className="w-2 h-2 rounded-full bg-[#0054f9]" />
              <span>Powerful features</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 mb-4 tracking-tight leading-[1.1]">
              Everything You Need to Succeed
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
              Discover, connect, and partner with student clubs effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300 h-full"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#0054f9] rounded-2xl flex items-center justify-center shadow-[0_8px_16px_-4px_rgba(0,84,249,0.3)] flex-shrink-0 text-white font-black">
                    ✓
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {feature.details.map((detail) => (
                    <div
                      key={detail}
                      className="flex items-center gap-3 text-sm text-gray-600"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#0054f9]" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <Link
                    href="/contact"
                    className="text-[#0054f9] font-semibold hover:text-[#0040d6] transition-colors inline-flex items-center gap-2"
                  >
                    <span>Learn More</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0YxRjVGOSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-50" />
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 lg:px-16 w-full relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 mb-4 tracking-tight leading-[1.1]">
              What Our Sponsors Say
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
              Hear from brands that have partnered with clubs through ClubPack.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.author}
                className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300 h-full"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#0054f9] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-[0_8px_16px_-4px_rgba(0,84,249,0.3)]">
                    {t.author.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <div className="font-bold text-gray-900">{t.author}</div>
                    <div className="text-sm text-gray-500 font-medium">
                      {t.role}, {t.company}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed italic">
                  &quot;{t.quote}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0YxRjVGOSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-50" />
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-8 sm:px-12 lg:px-16 w-full text-center relative z-10">
          <div className="bg-white rounded-2xl p-12 shadow-xl border border-gray-100">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 mb-6 tracking-tight leading-[1.1]">
              Ready to Partner with Student Clubs?
            </h2>
            <p className="text-2xl text-gray-600 mb-10 leading-relaxed">
              Join brands already partnering with clubs through ClubPack.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <Link
                href="/contact"
                className="bg-[#0054f9] hover:bg-[#0040d6] text-white px-8 py-4 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-200 inline-flex items-center gap-2"
              >
                <span>Contact Us</span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/contact"
                className="border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 px-8 py-4 rounded-xl font-semibold transition-all duration-200"
              >
                Contact Sales
              </Link>
            </div>

            <p className="text-gray-500 text-sm font-medium">
              No setup fees • Cancel anytime • 30-day money-back guarantee
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

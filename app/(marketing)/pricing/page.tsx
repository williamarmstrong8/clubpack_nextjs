import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Pricing",
};

const APP_ORIGIN = "https://my.joinclubpack.com";

export default function PricingPage() {
  const plans = [
    {
      name: "FREE",
      price: "0",
      period: "month",
      features: [
        "Up to 50 members",
        "Club website",
        "Admin dashboard",
        "Basic event management",
        "Email support",
      ],
      description: "Perfect for clubs getting started with online presence",
      cta: "Get Started Free",
      href: `${APP_ORIGIN}/signup`,
      popular: false,
    },
    {
      name: "GROWTH",
      price: "4.99",
      period: "month",
      features: [
        "Up to 500 members",
        "Everything in Free",
        "Mobile app access",
        "Third-party integrations",
        "Advanced analytics",
      ],
      description: "Perfect for clubs ready to expand their reach",
      cta: "Subscribe",
      href: `${APP_ORIGIN}/signup`,
      popular: true,
    },
    {
      name: "PREMIUM",
      price: "39.99",
      period: "month",
      features: [
        "Unlimited members",
        "Everything in Growth",
        "Custom integrations",
        "AI-powered insights",
        "Priority support",
        "Custom domain",
        "API access",
        "White-label options",
      ],
      description: "For established clubs with advanced needs",
      cta: "Talk to Sales",
      href: "/contact",
      popular: false,
    },
  ] as const;

  const faqs = [
    {
      q: "Can I change plans later?",
      a: "Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we’ll prorate any billing differences.",
    },
    {
      q: "What happens if I exceed my member limit?",
      a: "We’ll notify you when you’re approaching your limit. You can upgrade your plan or we’ll work with you to find a fit.",
    },
    {
      q: "Do you offer discounts for annual billing?",
      a: "Yes. Annual billing saves you money, and we offer special discounts for student orgs and non-profits.",
    },
    {
      q: "Is there a setup fee?",
      a: "No setup fees ever. We include onboarding and training with all plans to help you start quickly.",
    },
    {
      q: "Can I cancel my subscription?",
      a: "Yes, you can cancel at any time. Your club stays active through the end of your billing period.",
    },
    {
      q: "Do you offer refunds?",
      a: "We offer a 30-day money-back guarantee on all paid plans.",
    },
  ];

  return (
    <>
      <section className="relative pt-32 pb-24 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0YxRjVGOSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-50" />
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 lg:px-16 w-full text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 mb-6 tracking-tight leading-[1.1]">
            Simple, Transparent Pricing
          </h1>

          <p className="text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
            Start free, scale as you grow. No hidden fees, no long-term
            contracts.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0054f9]" />
              <span className="font-semibold">No Hidden Fees</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0054f9]" />
              <span className="font-semibold">30-Day Money Back</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0054f9]" />
              <span className="font-semibold">Cancel Anytime</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0YxRjVGOSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-50" />
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-8 sm:px-12 lg:px-16 w-full relative z-10">
          <div className="text-left mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl">
              Start free and upgrade as your club grows. All plans include
              access to the core platform.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`bg-white rounded-2xl p-8 shadow-xl border transition-shadow duration-300 h-full flex flex-col gap-0 ${
                  plan.popular
                    ? "border-blue-200 shadow-[0_24px_48px_-16px_rgba(0,84,249,0.25)]"
                    : "border-gray-100 hover:shadow-2xl"
                }`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="text-sm font-bold text-gray-500 tracking-widest">
                      {plan.name}
                    </div>
                    {plan.popular && (
                      <div className="mt-2 inline-flex items-center bg-blue-50 text-[#0054f9] px-3 py-1 rounded-full text-xs font-bold">
                        Most Popular
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-5xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-500">/{plan.period}</span>
                </div>

                <p className="text-gray-600 mb-8 leading-relaxed">
                  {plan.description}
                </p>

                <ul className="space-y-3 mb-10">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="w-5 h-5 bg-[#0054f9] text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg
                          viewBox="0 0 20 20"
                          className="w-3.5 h-3.5"
                          aria-hidden="true"
                        >
                          <path
                            d="M16 6l-7.5 8L4 10.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="text-gray-700 leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  {plan.href.startsWith("http") ? (
                    <Button
                      asChild
                      className={`w-full h-auto px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                        plan.popular
                          ? "bg-[#0054f9] hover:bg-[#0040d6] text-white shadow-sm hover:shadow-md"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                      }`}
                    >
                      <a
                        href={plan.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {plan.cta}
                      </a>
                    </Button>
                  ) : (
                    <Button
                      asChild
                      className={`w-full h-auto px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                        plan.popular
                          ? "bg-[#0054f9] hover:bg-[#0040d6] text-white shadow-sm hover:shadow-md"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                      }`}
                    >
                      <Link href={plan.href}>{plan.cta}</Link>
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0YxRjVGOSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-50" />
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-8 sm:px-12 lg:px-16 w-full relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 mb-4 tracking-tight leading-[1.1]">
              Frequently Asked Questions
            </h2>
            <p className="text-2xl text-gray-600">Got questions? We&apos;ve got answers.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100"
              >
                <summary className="cursor-pointer text-xl md:text-2xl font-bold text-gray-900">
                  {faq.q}
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

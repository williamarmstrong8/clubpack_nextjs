"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

const APP_ORIGIN = "https://my.joinclubpack.com";

function HamburgerIcon({ open }: { open: boolean }) {
  return open ? (
    <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  const resourcesItems = useMemo(
    () => [
      {
        name: "Blog",
        href: "/blog",
        description: "Tips and insights for club leaders",
      },
      { name: "Contact", href: "/contact", description: "Get in touch" },
    ],
    [],
  );

  const navLinkClass = (href: string) => {
    const active = pathname === href;
    return `text-sm px-3 py-2 rounded-md transition-colors focus:outline-none ${
      active ? "text-gray-300" : "text-gray-400 hover:text-gray-300"
    }`;
  };

  return (
    <header className="w-full bg-black sticky top-0 z-50">
      <nav className="w-full">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="relative flex items-center justify-between h-14">
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center gap-2.5 group"
                onClick={() => setMobileOpen(false)}
              >
                <img
                  src="/clubpack-logos/clubpack-logo-large.svg"
                  alt="ClubPack"
                  className="h-6 w-auto"
                  loading="eager"
                  decoding="async"
                />
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              <Link href="/features" className={navLinkClass("/features")}>
                Features
              </Link>

              <div
                className="relative"
                onMouseEnter={() => setResourcesOpen(true)}
                onMouseLeave={() => setResourcesOpen(false)}
              >
                <button
                  type="button"
                  className="text-sm text-gray-400 hover:text-gray-300 px-3 py-2 rounded-md transition-colors flex items-center gap-1 focus:outline-none"
                  aria-haspopup="menu"
                  aria-expanded={resourcesOpen}
                >
                  Resources
                  <svg
                    viewBox="0 0 20 20"
                    className="h-4 w-4 text-gray-400"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 7l5 6 5-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {resourcesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-gray-950 rounded-lg shadow-2xl border border-gray-800 p-4">
                    <div className="space-y-0.5">
                      {resourcesItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block p-2 rounded-md hover:bg-gray-900 transition-colors group"
                        >
                          <div className="text-white font-medium text-sm mb-0.5 group-hover:text-gray-100">
                            {item.name}
                          </div>
                          <div className="text-gray-400 text-xs">
                            {item.description}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link href="/pricing" className={navLinkClass("/pricing")}>
                Pricing
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Button
                asChild
                variant="ghost"
                className="text-gray-400 hover:text-gray-300 px-4 py-2 rounded-full text-sm"
              >
                <a
                  href={`${APP_ORIGIN}/login`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Login
                </a>
              </Button>
              <Button
                asChild
                className="h-8 px-4 rounded-md text-sm text-white bg-[#0054f9] hover:bg-[#0040d6]"
              >
                <a
                  href={`${APP_ORIGIN}/signup`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join for Free
                </a>
              </Button>
            </div>

            <button
              type="button"
              className="md:hidden p-2 text-white hover:bg-gray-800 rounded-lg transition-colors focus:outline-none"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              <HamburgerIcon open={mobileOpen} />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-gray-950/95 backdrop-blur-xl border-t border-gray-800">
            <div className="max-w-[1440px] mx-auto pt-2 pb-4 px-6 space-y-1">
              <Link
                href="/features"
                className="block px-3 py-2.5 text-sm font-medium text-white hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Features
              </Link>

              <Link
                href="/pricing"
                className="block px-3 py-2.5 text-sm font-medium text-white hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Pricing
              </Link>

              <Link
                href="/sponsors"
                className="block px-3 py-2.5 text-sm font-medium text-white hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                For Sponsors
              </Link>

              <div className="py-2">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
                  Resources
                </div>
                {resourcesItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-3 py-2.5 text-sm font-medium text-white hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="pt-4 space-y-2">
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-center text-gray-400 hover:text-gray-300 px-4 py-2 rounded-full text-sm"
                >
                  <a
                    href={`${APP_ORIGIN}/login`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </a>
                </Button>
                <Button
                  asChild
                  className="w-full bg-[#0054f9] hover:bg-[#0040d6] text-white px-4 py-2 rounded-md text-sm"
                >
                  <a
                    href={`${APP_ORIGIN}/signup`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                  >
                    Start Building Free
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

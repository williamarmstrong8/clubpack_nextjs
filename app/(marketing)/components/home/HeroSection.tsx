"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const APP_ORIGIN = "https://my.joinclubpack.com";

type ActiveView = "dashboard" | "website";

export default function HeroSection() {
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");

  return (
    <section className="relative overflow-hidden bg-white min-h-screen flex items-center pt-32 pb-12">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-[520px] h-[520px] bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-[520px] h-[520px] bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]" />
      </div>

      <div className="max-w-[1280px] mx-auto px-8 sm:px-12 lg:px-16 w-full relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-gray-900 mb-8 tracking-tight leading-[1.05]">
            The platform for
            <br />
            modern clubs
          </h1>

          <p className="text-lg sm:text-xl md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Build your club website, manage members, and plan events all in one
            platform.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Button
              asChild
              className="h-auto bg-[#0054f9] hover:bg-[#0040d6] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 focus-visible:ring-blue-500/50"
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
              variant="outline"
              className="h-auto border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
            >
              <a href="/tour">Take a tour</a>
            </Button>
          </div>
        </div>

        <div className="w-full rounded-2xl overflow-hidden border border-gray-200 bg-gray-50/50 mb-8">
          <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
            <Image
              src="/second.png"
              alt="Admin dashboard preview"
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className={`object-cover transition-opacity duration-500 ${
                activeView === "dashboard" ? "opacity-100" : "opacity-0"
              }`}
            />
            <Image
              src="/first.png"
              alt="Club website preview"
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className={`object-cover transition-opacity duration-500 ${
                activeView === "website" ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative max-w-2xl w-full">
            <div className="bg-gray-100/50 rounded-2xl p-1.5 backdrop-blur-sm border border-gray-200/50">
              <div className="flex relative">
                <div
                  className="absolute top-0 bottom-0 w-1/2 bg-white rounded-xl shadow-sm border border-gray-200/50 transition-transform duration-300"
                  style={{
                    transform:
                      activeView === "dashboard"
                        ? "translateX(0%)"
                        : "translateX(100%)",
                  }}
                  aria-hidden="true"
                />

                <button
                  type="button"
                  onClick={() => setActiveView("dashboard")}
                  className="relative flex-1 px-8 py-5 rounded-xl text-left flex items-center transition-colors duration-200 z-10"
                >
                  <div className="flex-1">
                    <div
                      className={`font-semibold transition-colors duration-200 ${
                        activeView === "dashboard"
                          ? "text-gray-900"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Admin Dashboard
                    </div>
                    <div
                      className={`text-sm transition-colors duration-200 ${
                        activeView === "dashboard"
                          ? "text-gray-600"
                          : "text-gray-400"
                      }`}
                    >
                      Manage members & events
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveView("website")}
                  className="relative flex-1 px-8 py-5 rounded-xl text-left flex items-center transition-colors duration-200 z-10"
                >
                  <div className="flex-1">
                    <div
                      className={`font-semibold transition-colors duration-200 ${
                        activeView === "website"
                          ? "text-gray-900"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Club Website
                    </div>
                    <div
                      className={`text-sm transition-colors duration-200 ${
                        activeView === "website"
                          ? "text-gray-600"
                          : "text-gray-400"
                      }`}
                    >
                      Your public presence
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

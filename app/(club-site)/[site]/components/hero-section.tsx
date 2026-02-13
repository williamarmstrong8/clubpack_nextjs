import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import type { ClubData } from "../mock-data";

export function HeroSection({ club }: { club: ClubData }) {
  const hasImage = !!club.heroImage;

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background Image */}
      {hasImage && (
        <>
          <Image
            src={club.heroImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </>
      )}

      {/* Gradient background when no image */}
      {!hasImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
      )}

      {/* Content */}
      <div
        className={`relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${hasImage ? "text-center" : "text-center lg:text-left"}`}
      >
        <div
          className={`max-w-4xl ${hasImage ? "mx-auto" : "mx-auto lg:mx-0"}`}
        >
          <h1
            className={`mb-6 text-5xl font-bold tracking-tight leading-[1.1] sm:text-6xl md:text-7xl lg:text-8xl ${hasImage ? "text-white" : "text-gray-900"}`}
          >
            Welcome to {club.name}
          </h1>

          <p
            className={`mb-10 max-w-2xl text-lg leading-relaxed sm:text-xl md:text-2xl ${hasImage ? "text-white/90" : "text-gray-600"} ${hasImage ? "mx-auto" : "mx-auto lg:mx-0"}`}
          >
            {club.tagline ||
              "Join our community and be part of something special."}
          </p>

          <div
            className={hasImage ? "flex justify-center" : "flex justify-center lg:justify-start"}
          >
            <Button
              asChild
              size="lg"
              className="h-12 rounded-none px-8 font-medium shadow-lg transition-all duration-300 hover:shadow-xl sm:h-14 sm:px-10 sm:text-lg"
            >
              <Link href="#about">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

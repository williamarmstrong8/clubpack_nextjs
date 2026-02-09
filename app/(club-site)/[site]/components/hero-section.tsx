import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

import type { ClubData } from "../mock-data";

export function HeroSection({ club }: { club: ClubData }) {
  return (
    <section className="relative min-h-dvh overflow-hidden">
      {/* Full Background Image */}
      <Image
        src={club.heroImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      
      {/* Simple Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative mx-auto flex min-h-dvh w-full max-w-[1400px] items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-6">
          <div className="flex justify-center">
            <Badge
              variant="secondary"
              className="gap-1.5 rounded-full px-3 py-1 bg-white/95 text-foreground backdrop-blur-sm"
            >
              <MapPin className="size-3.5" />
              {club.location}
            </Badge>
          </div>

          <div className="space-y-4">
            <h1 className="text-balance text-5xl font-bold tracking-tight text-white drop-shadow-lg sm:text-7xl">
              {club.name}
            </h1>
            <p className="text-balance text-xl text-white/90 drop-shadow-md sm:text-2xl">
              {club.tagline}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/signup">Join now</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="border-2 border-white/80 text-white hover:bg-white/10 hover:text-white hover:border-white">
              <Link href="./events">View events</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}


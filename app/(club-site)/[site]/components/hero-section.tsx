import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

import type { ClubData } from "../mock-data";

export function HeroSection({ club }: { club: ClubData }) {
  return (
    <section className="relative min-h-[calc(100dvh-3.5rem)] overflow-hidden">
      <Image
        src={club.heroImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />
      <div className="absolute inset-0 [background:radial-gradient(circle_at_top,theme(colors.primary/0.18),transparent_55%)]" />

      <div className="relative mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-6xl items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-6">
          <div className="flex justify-center">
            <Badge
              variant="secondary"
              className="gap-1.5 rounded-full px-3 py-1"
            >
              <MapPin className="size-3.5" />
              {club.location}
            </Badge>
          </div>

          <div className="space-y-3">
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
              {club.name}
            </h1>
            <p className="text-balance text-lg text-muted-foreground sm:text-xl">
              {club.tagline}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="#join">Join now</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="./events">View events</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}


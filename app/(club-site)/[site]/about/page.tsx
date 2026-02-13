import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { getClubBySubdomain } from "@/lib/data/club-site";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site } = await params
  const club = await getClubBySubdomain(site);
  if (!club) notFound();

  const name =
    (typeof club.name === "string" && club.name.trim()) ||
    (typeof club.hero_headline === "string" && club.hero_headline.trim()) ||
    site;
  const mission =
    (typeof club.description === "string" && club.description.trim()) ||
    (typeof club.hero_subtext === "string" && club.hero_subtext.trim()) ||
    (typeof club.tagline === "string" && club.tagline.trim()) ||
    "Join us for weekly community events.";

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          About {name}
        </h1>

        <p className="text-balance text-base text-muted-foreground leading-relaxed">
          {mission}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Button asChild>
            <Link href="../signup">Join club</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="../events">See events</Link>
          </Button>
        </div>
      </div>

      <Separator className="my-10" />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Community-first</CardTitle>
            <CardDescription>
              We prioritize consistency, kindness, and connection over ego.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Clear logistics</CardTitle>
            <CardDescription>
              Straightforward plans, clear times and places, and helpful updates.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Better together</CardTitle>
            <CardDescription>
              Whether you&apos;re new or a regular, you belong here.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
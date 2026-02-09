import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
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
  const location =
    (typeof club.location === "string" && club.location.trim()) || "Local";
  const mission =
    (typeof club.description === "string" && club.description.trim()) ||
    (typeof club.hero_subtext === "string" && club.hero_subtext.trim()) ||
    (typeof club.tagline === "string" && club.tagline.trim()) ||
    "Join us for weekly community events.";

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{location}</Badge>
          <Badge>All paces</Badge>
          <Badge variant="outline">Weekly runs</Badge>
        </div>

        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          About {name}
        </h1>

        <p className="text-balance text-base text-muted-foreground leading-relaxed">
          {mission}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button asChild>
            <Link href="../#join">Join club</Link>
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
              Simple routes, obvious meeting points, and helpful reminders.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Better together</CardTitle>
            <CardDescription>
              Whether it&apos;s your first mile or your fiftieth, you belong here.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Our story</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Happy Mile started as a small group text: “Easy 3 at sunrise?” A few
            weeks later, the run became a ritual — the kind that makes your whole
            week feel lighter.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Today, we keep the same promise: no complicated rules, no pressure,
            and no one left behind. We regroup often, celebrate small wins, and
            usually end with coffee.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">What to expect</h2>
          <div className="grid gap-3">
            <div className="rounded-xl border bg-muted/30 p-4">
              <div className="font-medium">Arrive early</div>
              <div className="text-sm text-muted-foreground">
                We start on time. Aim for 10 minutes early to say hi.
              </div>
            </div>
            <div className="rounded-xl border bg-muted/30 p-4">
              <div className="font-medium">Choose your pace</div>
              <div className="text-sm text-muted-foreground">
                Run, jog, walk — it&apos;s all movement. We regroup often.
              </div>
            </div>
            <div className="rounded-xl border bg-muted/30 p-4">
              <div className="font-medium">Stay after</div>
              <div className="text-sm text-muted-foreground">
                Optional, but highly recommended: coffee, snacks, and good
                conversations.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";

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
    <main className="flex-grow bg-white pt-28 pb-20">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Header - matches events page */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            About {name}
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-gray-700 sm:text-xl max-w-3xl mx-auto">
            {mission}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <Button asChild className="rounded-none">
              <Link href="../signup">Join club</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-none">
              <Link href="../events">See events</Link>
            </Button>
          </div>
        </div>

        {/* Values - same container width and typography as home/events */}
        <div className="border-t border-gray-200 pt-16">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 lg:p-8">
              <h2 className="mb-3 text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
                Community-first
              </h2>
              <p className="text-lg leading-relaxed text-gray-700">
                We prioritize consistency, kindness, and connection over ego.
              </p>
            </div>
            <div className="flex flex-col border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 lg:p-8">
              <h2 className="mb-3 text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
                Clear logistics
              </h2>
              <p className="text-lg leading-relaxed text-gray-700">
                Straightforward plans, clear times and places, and helpful updates.
              </p>
            </div>
            <div className="flex flex-col border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 lg:p-8">
              <h2 className="mb-3 text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
                Better together
              </h2>
              <p className="text-lg leading-relaxed text-gray-700">
                Whether you&apos;re new or a regular, you belong here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
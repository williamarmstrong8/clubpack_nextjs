import { notFound } from "next/navigation";

import { getClubBySubdomain } from "@/lib/data/club-site";
import { createClient } from "@/lib/supabase/server";

export default async function ClubPolicyPage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site } = await params;
  const club = await getClubBySubdomain(site);
  if (!club) notFound();

  const supabase = await createClient();
  const { data: policy } = await supabase
    .from("club_policy")
    .select("content")
    .eq("club_id", club.id)
    .maybeSingle();

  if (!policy?.content?.trim()) notFound();

  const clubName =
    (typeof club.name === "string" && club.name.trim()) ||
    (typeof club.hero_headline === "string" && club.hero_headline.trim()) ||
    site;

  return (
    <main className="min-h-[60vh] flex-grow bg-white pt-28 pb-20">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Club policy
          </h1>
          <p className="text-muted-foreground">
            {clubName} — policy and guidelines
          </p>
        </div>
        <div className="border border-gray-200 bg-white p-6 sm:p-8 lg:p-10">
          <div
            className="prose prose-gray max-w-none text-gray-700 prose-p:leading-relaxed prose-headings:font-semibold prose-headings:text-gray-900"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {policy.content.trim()}
          </div>
        </div>
      </div>
    </main>
  );
}

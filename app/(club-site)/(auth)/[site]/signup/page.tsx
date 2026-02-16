import Image from "next/image";
import { notFound } from "next/navigation";
import { SignupForm } from "./signup-form";
import { getClubBySubdomain } from "@/lib/data/club-site";

export default async function ClubSignupPage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site } = await params;
  const club = await getClubBySubdomain(site);
  if (!club) notFound();

  const clubLogo = 
    (typeof club.logo_url === "string" && club.logo_url) ||
    (typeof club.logo === "string" && club.logo) ||
    null;

  const clubName = (club.name ?? "").toString();

  function initialsFromName(name: string) {
    const parts = name.split(" ").filter(Boolean);
    return (parts[0]?.[0] ?? "C") + (parts[1]?.[0] ?? "P");
  }

  const initials = initialsFromName(clubName || site);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted/20 px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          {clubLogo ? (
            <Image
              src={clubLogo}
              alt={`${clubName} logo`}
              width={120}
              height={48}
              className="h-12 w-auto max-h-16 object-contain"
            />
          ) : (
            <span className="text-2xl font-bold text-foreground">
              {initials}
            </span>
          )}
        </div>
        <SignupForm site={site} />
      </div>
    </div>
  );
}

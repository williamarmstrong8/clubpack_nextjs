import { notFound } from "next/navigation";
import { Mail, MapPin, Instagram } from "lucide-react";

import { ContactForm } from "./contact-form";
import { getClubBySubdomain } from "@/lib/data/club-site";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site } = await params;
  const club = await getClubBySubdomain(site);
  if (!club) notFound();

  const clubName = (club.name ?? club.hero_headline ?? site).toString();
  const contactEmail = (club.contact_email ?? club.email ?? "").toString();
  const location =
    (typeof club.meeting_location === "string" && club.meeting_location.trim()) ||
    (typeof club.location === "string" && club.location.trim()) ||
    [club.city, club.state].filter(Boolean).join(", ") ||
    "Local";
  const instagram = (club.instagram ?? "").toString();

  return (
    <main className="flex-grow bg-white pt-28 pb-20">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Header - matches events/about */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Get in touch
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-700 sm:text-xl">
            Have questions about {clubName}? We&apos;d love to hear from you. Send
            us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left Column: Contact Info */}
          <div className="space-y-4">
            {contactEmail && (
              <div className="border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 lg:p-8">
                <h2 className="mb-2 flex items-center gap-2 text-lg font-bold tracking-tight text-gray-900">
                  <Mail className="size-5 text-gray-500" />
                  Email
                </h2>
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-lg leading-relaxed text-gray-700 hover:text-gray-900"
                >
                  {contactEmail}
                </a>
              </div>
            )}

            <div className="border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 lg:p-8">
              <h2 className="mb-2 flex items-center gap-2 text-lg font-bold tracking-tight text-gray-900">
                <MapPin className="size-5 text-gray-500" />
                Location
              </h2>
              <p className="text-lg leading-relaxed text-gray-700">{location}</p>
            </div>

            {instagram && (
              <div className="border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 lg:p-8">
                <h2 className="mb-2 flex items-center gap-2 text-lg font-bold tracking-tight text-gray-900">
                  <Instagram className="size-5 text-gray-500" />
                  Instagram
                </h2>
                <a
                  href={`https://instagram.com/${instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg leading-relaxed text-gray-700 hover:text-gray-900"
                >
                  @{instagram.replace("@", "")}
                </a>
              </div>
            )}
          </div>

          {/* Right Column: Contact Form */}
          <div>
            <ContactForm site={site} clubName={clubName} />
          </div>
        </div>
      </div>
    </main>
  );
}

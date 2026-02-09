import { notFound } from "next/navigation";
import { ContactForm } from "./contact-form";
import { getClubBySubdomain } from "@/lib/data/club-site";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin, Instagram } from "lucide-react";

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
    (typeof club.location === "string" && club.location.trim()) ||
    [club.city, club.state].filter(Boolean).join(", ") ||
    "Local";
  const instagram = (club.instagram ?? "").toString();

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 pt-24 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left Column: Contact Info */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Get in touch
            </h1>
            <p className="text-lg text-muted-foreground">
              Have questions about {clubName}? We'd love to hear from you. Send
              us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            {contactEmail && (
              <Card>
                <CardHeader className="pb-1">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Mail className="size-4" />
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {contactEmail}
                  </a>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="size-4" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">{location}</p>
              </CardContent>
            </Card>

            {instagram && (
              <Card>
                <CardHeader className="pb-1">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Instagram className="size-4" />
                    Instagram
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <a
                    href={`https://instagram.com/${instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    @{instagram.replace("@", "")}
                  </a>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div>
          <ContactForm site={site} clubName={clubName} />
        </div>
      </div>
    </div>
  );
}

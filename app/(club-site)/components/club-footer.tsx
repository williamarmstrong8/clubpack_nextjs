import { Separator } from "@/components/ui/separator";
import { Instagram } from "lucide-react";

function instagramUrl(handleOrUrl: string) {
  const v = handleOrUrl.trim();
  if (!v) return "";
  if (v.startsWith("http://") || v.startsWith("https://")) return v;
  const handle = v.startsWith("@") ? v.slice(1) : v;
  return `https://instagram.com/${handle}`;
}

export function ClubFooter({
  club,
}: {
  club?: {
    name?: string | null;
    tagline?: string | null;
    instagram?: string | null;
    contact_email?: string | null;
    email?: string | null;
  };
}) {
  const clubName = (club?.name ?? "").trim() || "ClubPack Club Site";
  const tagline =
    (club?.tagline ?? "").trim() ||
    "A clean, theme-ready website template for run clubs.";
  const ig = club?.instagram ? instagramUrl(String(club.instagram)) : "";

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="text-sm font-semibold">{clubName}</div>
            <p className="text-sm text-muted-foreground">
              {tagline}
            </p>
          </div>

          {ig && (
            <div className="flex items-center gap-4 text-sm">
              <a
                href={ig}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
                aria-label="Instagram"
              >
                <Instagram className="size-5" />
              </a>
            </div>
          )}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-2 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} Clubpack. All rights reserved.
          </p>
          <p>
            Powered by <span className="font-medium text-foreground">Clubpack</span>
          </p>
        </div>
      </div>
    </footer>
  );
}


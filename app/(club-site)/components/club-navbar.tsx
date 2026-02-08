"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";

type NavItem = {
  label: string;
  href: (site: string) => string;
};

function titleCaseFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function initialsFromName(name: string) {
  const parts = name.split(" ").filter(Boolean);
  return (parts[0]?.[0] ?? "C") + (parts[1]?.[0] ?? "P");
}

export function ClubNavbar({
  site,
  clubName: clubNameProp,
}: {
  site: string;
  clubName?: string | null;
}) {
  const pathname = usePathname();
  const clubName =
    (clubNameProp ?? "").trim() || titleCaseFromSlug(site ?? "club");
  const initials = initialsFromName(clubName);

  const navItems: NavItem[] = useMemo(
    () => [
      { label: "Home", href: (s) => `/${s}` },
      { label: "Events", href: (s) => `/${s}/events` },
      { label: "About", href: (s) => `/${s}/about` },
    ],
    [],
  );

  const joinHref = `/${site}#join`;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link
            href={`/${site}`}
            className="inline-flex items-center gap-2 font-semibold tracking-tight"
          >
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              {initials}
            </span>
            <span className="hidden sm:inline">{clubName}</span>
            <span className="sm:hidden">Club</span>
          </Link>

          <Separator orientation="vertical" className="hidden h-6 md:block" />

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const href = item.href(site);
              const active = pathname === href;
              return (
                <Link
                  key={item.label}
                  href={href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                    active && "text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Button asChild>
            <Link href={joinHref}>Join Club</Link>
          </Button>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] p-0">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/${site}`}
                    className="inline-flex items-center gap-2 font-semibold tracking-tight"
                  >
                    <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      {initials}
                    </span>
                    <span>{clubName}</span>
                  </Link>
                </div>
              </div>

              <Separator />

              <div className="p-3">
                <nav className="grid gap-1">
                  {navItems.map((item) => {
                    const href = item.href(site);
                    const active = pathname === href;
                    return (
                      <Link
                        key={item.label}
                        href={href}
                        className={cn(
                          "rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
                          active && "bg-muted text-foreground",
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="p-6 pt-2">
                <Button asChild className="w-full">
                  <Link href={joinHref}>Join Club</Link>
                </Button>
                <p className="mt-3 text-xs text-muted-foreground">
                  Free to join. Weekly community runs in Austin.
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}


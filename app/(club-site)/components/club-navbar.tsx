"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useEffect } from "react";
import type { User } from "@supabase/supabase-js";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Menu, Settings, LogOut } from "lucide-react";
import { signout } from "../(auth)/[site]/actions/auth";

type NavItem = {
  label: string;
  href: string;
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

function getUserInitials(user: User | null) {
  if (!user) return "?";
  const firstName = user.user_metadata?.first_name || "";
  const lastName = user.user_metadata?.last_name || "";
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  return user.email?.[0]?.toUpperCase() || "?";
}

export function ClubNavbar({
  site,
  clubName: clubNameProp,
  clubLogo,
  user,
  memberAvatarUrl,
}: {
  site: string;
  clubName?: string | null;
  clubLogo?: string | null;
  user?: User | null;
  memberAvatarUrl?: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Prefetch nav routes + auth pages in the background so clicks are fast
  useEffect(() => {
    const base = site ? `/${encodeURIComponent(site)}` : "";
    router.prefetch(`${base}/events`);
    router.prefetch(`${base}/about`);
    router.prefetch(`${base}/contact`);
    router.prefetch(`${base}/account`);
    router.prefetch(`${base}/login`);
    router.prefetch(`${base}/signup`);
  }, [router, site]);

  const clubName =
    (clubNameProp ?? "").trim() || titleCaseFromSlug(site ?? "club");
  const initials = initialsFromName(clubName);

  // Determine if we're on a page where navbar should be dark
  const isOnContentPage = pathname?.includes("/events") || pathname?.includes("/about") || pathname?.includes("/contact") || pathname?.includes("/policy") || pathname?.includes("/account");
  const textColor = isOnContentPage ? 'text-foreground' : 'text-white';

  const navItems: NavItem[] = useMemo(
    () => [
      { label: "Events", href: "/events" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    [],
  );

  const joinHref = "/signup";

  return (
    <header className="absolute top-0 left-0 right-0 z-50 w-full bg-transparent">
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo + Club Name */}
        <div className="flex items-center gap-3 flex-1">
          <Link
            href="/"
            className={cn("inline-flex items-center gap-2.5 font-semibold tracking-tight", textColor)}
          >
            {clubLogo ? (
              <Image
                src={clubLogo}
                alt={`${clubName} logo`}
                width={120}
                height={48}
                className="h-8 w-auto max-h-8 object-contain"
              />
            ) : (
              <span className={cn("inline-flex size-8 items-center justify-center rounded-lg backdrop-blur-sm", 
                isOnContentPage ? "bg-muted" : "bg-white/20 text-white"
              )}>
                {initials}
              </span>
            )}
            <span className={cn("hidden sm:inline drop-shadow-md", textColor)}>{clubName}</span>
            <span className={cn("sm:hidden drop-shadow-md", textColor)}>Club</span>
          </Link>
        </div>

        {/* Center: Navigation Links (absolutely centered) */}
        <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => {
            const href = item.href;
            const active = pathname === href;
            return (
              <Link
                key={item.label}
                href={href}
                prefetch={true}
                className={cn(
                  "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  isOnContentPage
                    ? "text-muted-foreground hover:text-foreground hover:bg-muted"
                    : "text-white/80 hover:text-white hover:bg-white/10",
                  active && (isOnContentPage ? "text-foreground bg-muted" : "text-white bg-white/10")
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: User Menu or Join Button */}
        <div className="hidden md:flex items-center gap-3 flex-1 justify-end">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn("relative size-9 rounded-full p-0", 
                  isOnContentPage ? "hover:bg-muted" : "hover:bg-white/10"
                )}>
                  <Avatar className={cn("size-9 border", 
                    isOnContentPage ? "border-border" : "border-white/20"
                  )}>
                    <AvatarImage src={memberAvatarUrl ?? undefined} alt="" />
                    <AvatarFallback className={cn("text-sm font-medium",
                      isOnContentPage ? "bg-muted" : "bg-white/20 text-white"
                    )}>
                      {getUserInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.user_metadata?.first_name || "Member"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account" prefetch={true} className="cursor-pointer">
                    <Settings className="mr-2 size-4" />
                    Account Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={async () => { await signout(); }}
                >
                  <LogOut className="mr-2 size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" className={cn(
                "rounded-none",
                isOnContentPage 
                  ? "text-foreground hover:bg-muted"
                  : "text-white hover:bg-white/10 hover:text-white"
              )}>
                <Link href="/login" prefetch={true}>Log in</Link>
              </Button>
              <Button asChild className="rounded-none bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href={joinHref} prefetch={true}>Join Club</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu" className="text-white hover:bg-white/10">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] p-0">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2.5 font-semibold tracking-tight"
                  >
                    {clubLogo ? (
                      <Image
                        src={clubLogo}
                        alt={`${clubName} logo`}
                        width={32}
                        height={32}
                        className="size-8 rounded-lg object-cover"
                      />
                    ) : (
                      <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        {initials}
                      </span>
                    )}
                    <span>{clubName}</span>
                  </Link>
                </div>
              </div>

              <Separator />

              <div className="p-3">
                <nav className="grid gap-1">
                  {navItems.map((item) => {
                    const href = item.href;
                    const active = pathname === href;
                    return (
                      <Link
                        key={item.label}
                        href={href}
                        prefetch={true}
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
                {user ? (
                  <div className="space-y-3">
                    <div className="rounded-lg border bg-muted/50 p-3">
                      <div className="text-sm font-medium">
                        {user.user_metadata?.first_name || "Member"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                    <Button asChild className="w-full" variant="outline">
                      <Link href="/account" prefetch={true}>
                        <Settings className="mr-2 size-4" />
                        Account Settings
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={async () => { await signout(); }}
                    >
                      <LogOut className="mr-2 size-4" />
                      Sign out
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button asChild className="w-full rounded-none">
                      <Link href={joinHref} prefetch={true}>Join Club</Link>
                    </Button>
                    <Button asChild className="mt-2 w-full rounded-none" variant="outline">
                      <Link href="/login" prefetch={true}>Log in</Link>
                    </Button>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Free to join. Weekly community events.
                    </p>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}


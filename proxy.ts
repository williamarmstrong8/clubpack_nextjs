import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { copySupabaseCookies, updateSession } from "@/lib/supabase/proxy";

// --- HELPER FUNCTIONS ---

function normalizeHostname(host: string | null): string {
  // `host` comes in as "localhost:3000" or "clubpack.com"
  // We split by ":" to remove the port.
  return (host ?? "").split(":")[0]?.toLowerCase() ?? "";
}

function normalizeRootDomain(domain: string | undefined): string {
  // Handles "localhost:3000", "https://clubpack.com", etc.
  const d = (domain ?? "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .split("/")[0]!;
  // IMPORTANT: Remove port if present in the env var
  return d.split(":")[0] ?? "";
}

function isLocalhostHostname(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname.endsWith(".localhost")
  );
}

function getSubdomain(hostname: string, rootDomain: string): string | null {
  // 1. Localhost Check (Dev Environment)
  if (hostname === "localhost") return null;
  
  // 2. Exact Match Check (Root Domain)
  // If user visits "clubpack.com", there is no subdomain.
  if (hostname === rootDomain) return null;
  if (hostname === `www.${rootDomain}`) return null;

  // 3. Subdomain Extraction
  // If hostname is "happy-mile.clubpack.com"
  if (hostname.endsWith(`.${rootDomain}`)) {
    // Remove ".clubpack.com" from the end
    const sub = hostname.slice(0, -(rootDomain.length + 1));
    return sub || null;
  }

  // 4. Fallback (Unknown hosts go to marketing)
  return null;
}

// --- MAIN PROXY FUNCTION ---

export async function proxy(req: NextRequest) {
  const { supabaseResponse, claims } = await updateSession(req);

  const hostname = normalizeHostname(req.headers.get("host"));
  const envRootDomain = normalizeRootDomain(process.env.NEXT_PUBLIC_ROOT_DOMAIN);

  // For local dev, `*.localhost` is commonly used for subdomain testing.
  // In that case, the effective root domain should be "localhost".
  const effectiveRootDomain = isLocalhostHostname(hostname)
    ? "localhost"
    : envRootDomain;

  const subdomain =
    effectiveRootDomain.length > 0 ? getSubdomain(hostname, effectiveRootDomain) : null;

  const url = req.nextUrl.clone();
  const path = url.pathname;

  // 🔍 DEBUG LOGS (dev only)
  if (process.env.NODE_ENV !== "production") {
    console.log(`[Proxy] Host: ${hostname} | Subdomain: ${subdomain} | Path: ${path}`);
  }

  // Headers for Server Components (Optional but recommended)
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-url", req.url);
  requestHeaders.set("x-subdomain", subdomain || "");
  requestHeaders.set("x-hostname", hostname);

  // NOTE:
  // Do NOT rewrite to route-group paths like `/(marketing)` or `/(admin)` — those are
  // filesystem-only and will be treated as literal URL segments (which can accidentally
  // match routes like `/:site` and send you to the club site).

  const firstSegment = path.split("/")[1] ?? "";
  const isAuthRoute = path === "/auth" || path.startsWith("/auth/");

  const userId =
    claims && typeof claims.sub === "string" && claims.sub.length > 0
      ? claims.sub
      : null;

  const withSupabaseCookies = (res: NextResponse) => {
    copySupabaseCookies(supabaseResponse, res);
    return res;
  };

  const ADMIN_ROOT_SEGMENTS = new Set([
    "account",
    "analytics",
    "billing",
    "event-ideas",
    "events",
    "home",
    "members",
    "messages",
    "settings",
    "waivers",
    "website",
    "auth",
  ]);

  const MARKETING_ROOT_SEGMENTS = new Set(["", "features", "pricing", "sponsors", "blog", "tour"]);

  // CASE 1: Admin App (my.<rootDomain>)
  // Enforce that admin pages only render on the `my` subdomain.
  if (subdomain === "my") {
    // Auth gating for admin app.
    if (!userId && !isAuthRoute) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/auth/login";
      return withSupabaseCookies(NextResponse.redirect(loginUrl));
    }

    // If already logged in, keep users out of login/sign-up (but allow /auth/create-club).
    const isCreateClubRoute = path === "/auth/create-club" || path.startsWith("/auth/create-club/");
    if (userId && isAuthRoute && !isCreateClubRoute) {
      const homeUrl = req.nextUrl.clone();
      homeUrl.pathname = "/home";
      return withSupabaseCookies(NextResponse.redirect(homeUrl));
    }

    if (path === "/") {
      url.pathname = "/home";
      return withSupabaseCookies(
        NextResponse.rewrite(url, { request: { headers: requestHeaders } }),
      );
    }

    if (!ADMIN_ROOT_SEGMENTS.has(firstSegment)) {
      url.pathname = "/home";
      return withSupabaseCookies(
        NextResponse.rewrite(url, { request: { headers: requestHeaders } }),
      );
    }

    return withSupabaseCookies(
      NextResponse.rewrite(url, { request: { headers: requestHeaders } }),
    );
  }

  // CASE 2: Tenant Club Sites (happy-mile.<rootDomain>)
  if (subdomain) {
    // Prevent double-prefix if someone navigates to `/{site}/*` directly on the tenant host.
    if (firstSegment === subdomain) {
      return withSupabaseCookies(NextResponse.next({ request: { headers: requestHeaders } }));
    }

    // Club routes live at URL-space `/:site/*` (i.e. app/(club-site)/[site]/*)
    url.pathname = `/${encodeURIComponent(subdomain)}${path}`;
    return withSupabaseCookies(
      NextResponse.rewrite(url, { request: { headers: requestHeaders } }),
    );
  }

  // CASE 3: Marketing / Root (root domain or localhost)
  // Enforce that tenant/admin routes are not reachable on the root domain.
  if (ADMIN_ROOT_SEGMENTS.has(firstSegment)) {
    url.pathname = "/";
    return withSupabaseCookies(
      NextResponse.rewrite(url, { request: { headers: requestHeaders } }),
    );
  }

  // Only allow known marketing top-level routes on the root domain; otherwise
  // keep users on the marketing site root.
  if (!MARKETING_ROOT_SEGMENTS.has(firstSegment)) {
    url.pathname = "/";
    return withSupabaseCookies(
      NextResponse.rewrite(url, { request: { headers: requestHeaders } }),
    );
  }

  return withSupabaseCookies(NextResponse.next({ request: { headers: requestHeaders } }));
}

export const config = {
  matcher: [
    // Exclude Next internals + all static files by extension from proxy.
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|.*\\..*).*)",
  ],
};
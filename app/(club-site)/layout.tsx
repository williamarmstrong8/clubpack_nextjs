import type { ReactNode } from "react";

/**
 * Route-group layout for club-site.
 *
 * IMPORTANT: Route-group layouts (like `(club-site)`) do NOT receive dynamic `params`.
 * The dynamic tenant layout lives at `app/(club-site)/[site]/layout.tsx`.
 */
export default function ClubSiteLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}


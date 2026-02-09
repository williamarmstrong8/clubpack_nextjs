import type { ReactNode } from "react";

/**
 * Route-group layout for the club-site.
 *
 * IMPORTANT: Route-group layouts (like `app/(club-site)/layout.tsx`) do NOT
 * reliably receive dynamic params from child segments in all Next versions.
 * Tenant-aware logic lives in `app/(club-site)/[site]/layout.tsx`.
 */
export default function ClubSiteLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}


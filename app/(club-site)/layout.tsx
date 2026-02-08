import type { ReactNode } from "react";

import { ClubFooter } from "./components/club-footer";
import { ClubNavbar } from "./components/club-navbar";

export default function ClubSiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <ClubNavbar />
      <main>{children}</main>
      <ClubFooter />
    </div>
  );
}


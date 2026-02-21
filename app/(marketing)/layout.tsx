import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./marketing.css";
import AnnouncementBanner from "./components/AnnouncementBanner";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: {
    default: "ClubPack",
    template: "%s | ClubPack",
  },
  description: "The all-in-one platform for modern social clubs.",
  icons: { icon: "/clubpack-logo-site.png" },
};

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBanner />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}


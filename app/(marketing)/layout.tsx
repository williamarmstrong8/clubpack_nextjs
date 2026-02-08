import type { Metadata } from "next";
import type { ReactNode } from "react";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: {
    default: "ClubPack",
    template: "%s | ClubPack",
  },
  description: "The all-in-one platform for modern social clubs.",
};

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}


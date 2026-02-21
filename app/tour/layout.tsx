import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Take a Tour | ClubPack",
  description:
    "A guided walkthrough of ClubPack: create your club, see your club site and admin dashboard, and explore key features.",
  robots: { index: true, follow: true },
};

export default function TourLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh w-full">
      {children}
    </div>
  );
}

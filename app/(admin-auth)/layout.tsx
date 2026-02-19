import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    default: "ClubPack Admin Auth",
    template: "%s | ClubPack",
  },
  icons: { icon: "/clubpack-logo-site.png" },
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


import type { Metadata } from "next"
import type { ReactNode } from "react"

import { getClubBySubdomain } from "@/lib/data/club-site"

import { PageViewTracker } from "../../components/page-view-tracker"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ site: string }>
}): Promise<Metadata> {
  const { site } = await params
  const club = await getClubBySubdomain(site)
  if (!club) return {}

  const clubLogo =
    (typeof club.logo_url === "string" && club.logo_url) ||
    (typeof club.logo === "string" && club.logo) ||
    null
  const faviconUrl = clubLogo || "/clubpack-logo-site.png"

  return {
    icons: {
      icon: [{ url: faviconUrl, sizes: "32x32" }, { url: faviconUrl, sizes: "16x16" }],
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
  }
}

export default async function AuthSiteLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ site: string }>
}) {
  const { site } = await params
  return (
    <>
      <PageViewTracker site={site} />
      {children}
    </>
  )
}

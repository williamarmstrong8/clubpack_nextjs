import type { Metadata } from "next"
import type { ReactNode } from "react"

import { getClubBySubdomain } from "@/lib/data/club-site"

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

  return {
    icons: clubLogo ? { icon: clubLogo } : undefined,
  }
}

export default function AuthSiteLayout({
  children,
}: {
  children: ReactNode
}) {
  return <>{children}</>
}

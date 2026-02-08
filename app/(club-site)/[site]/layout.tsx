import type { ReactNode } from "react"
import { notFound } from "next/navigation"

import { getClubBySubdomain } from "@/lib/data/club-site"

import { ClubFooter } from "../components/club-footer"
import { ClubNavbar } from "../components/club-navbar"

export default async function ClubTenantLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ site: string }>
}) {
  const { site } = await params
  const club = await getClubBySubdomain(site)
  if (!club) notFound()

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <ClubNavbar site={site} clubName={(club.name ?? "").toString()} />
      <main>{children}</main>
      <ClubFooter
        club={{
          name: (club.name ?? club.hero_headline ?? site).toString(),
          tagline: (club.tagline ?? club.hero_subtext ?? "").toString(),
          instagram: (club.instagram ?? "").toString(),
          contact_email: (club.contact_email ?? club.email ?? "").toString(),
        }}
      />
    </div>
  )
}


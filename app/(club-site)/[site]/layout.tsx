import type { ReactNode } from "react"
import { notFound } from "next/navigation"

import { getClubBySubdomain } from "@/lib/data/club-site"
import { createClient } from "@/lib/supabase/server"

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

  const clubLogo = 
    (typeof club.logo_url === "string" && club.logo_url) ||
    (typeof club.logo === "string" && club.logo) ||
    null

  const primaryColor = (typeof club.primary_color === "string" && club.primary_color) || null

  // Get current user
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      {primaryColor && (
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --primary: ${primaryColor};
            }
          `
        }} />
      )}
      <div className="relative min-h-dvh bg-background text-foreground">
        <ClubNavbar 
          site={site} 
          clubName={(club.name ?? "").toString()} 
          clubLogo={clubLogo}
          user={user}
        />
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
    </>
  )
}


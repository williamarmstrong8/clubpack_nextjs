import type { Metadata } from "next"
import type { ReactNode } from "react"
import { notFound } from "next/navigation"

import { getClubBySubdomain } from "@/lib/data/club-site"
import { createClient } from "@/lib/supabase/server"

import { ClubFooter } from "../components/club-footer"
import { ClubNavbar } from "../components/club-navbar"
import { PageViewTracker } from "../components/page-view-tracker"

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
    icons: clubLogo ? { icon: clubLogo } : { icon: "/clubpack-logo-site.png" },
  }
}

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

  // Get current user and their membership avatar; check if club has a policy for footer
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let memberAvatarUrl: string | null = null
  let hasPolicy = false
  if (user?.id && club?.id) {
    const { data: membership } = await supabase
      .from("memberships")
      .select("avatar_url")
      .eq("club_id", club.id)
      .eq("auth_user_id", user.id)
      .maybeSingle()
    memberAvatarUrl = (membership as { avatar_url?: string | null } | null)?.avatar_url ?? null
  }
  if (club?.id) {
    const { data: policyRow } = await supabase
      .from("club_policy")
      .select("id, content")
      .eq("club_id", club.id)
      .limit(1)
      .maybeSingle()
    const policy = policyRow as { id: string; content?: string | null } | null
    hasPolicy = !!(policy?.id && policy?.content?.trim())
  }

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
      <PageViewTracker site={site} />
      <div className="relative min-h-dvh bg-background text-foreground">
        <ClubNavbar 
          site={site} 
          clubName={(club.name ?? "").toString()} 
          clubLogo={clubLogo}
          user={user}
          memberAvatarUrl={memberAvatarUrl}
        />
        <main>{children}</main>
        <ClubFooter
          club={{
            name: (club.name ?? club.hero_headline ?? site).toString(),
            tagline: (club.tagline ?? club.hero_subtext ?? "").toString(),
            instagram: (club.instagram ?? "").toString(),
            contact_email: (club.contact_email ?? club.email ?? "").toString(),
          }}
          hasPolicy={hasPolicy}
          policyHref="/policy"
        />
      </div>
    </>
  )
}


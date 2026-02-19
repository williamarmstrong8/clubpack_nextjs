import { redirect } from "next/navigation";
import { getUser } from "../../(auth)/[site]/actions/auth";
import { getClubBySubdomain } from "@/lib/data/club-site";
import { AccountSettings } from "./account-settings";
import { createClient } from "@/lib/supabase/server";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site } = await params;
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const club = await getClubBySubdomain(site);

  // Fetch membership for this club + user (single source of truth for profile)
  type MembershipRow = {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    avatar_url: string | null;
    waiver_url: string | null;
    waiver_signed_at: string | null;
  };
  let membership: MembershipRow | null = null;
  let effectiveWaiverUrl: string | null = null;
  let effectiveWaiverSignedAt: string | null = null;
  if (club?.id) {
    const { data } = await supabase
      .from("memberships")
      .select("id, name, email, phone, avatar_url, waiver_url, waiver_signed_at")
      .eq("club_id", club.id)
      .eq("auth_user_id", user.id)
      .maybeSingle();
    membership = data as MembershipRow | null;
    // Use memberships.waiver_url / waiver_signed_at if set; else fall back to latest waiver_submissions (for legacy submissions)
    if (membership) {
      const fromMembership = (membership.waiver_url?.trim() && membership.waiver_url) ? { url: membership.waiver_url, at: membership.waiver_signed_at ?? null } : null;
      if (fromMembership) {
        effectiveWaiverUrl = fromMembership.url;
        effectiveWaiverSignedAt = fromMembership.at;
      } else {
        const { data: subList } = await supabase
          .from("waiver_submissions")
          .select("submitted_waiver_url, created_at")
          .eq("membership_id", membership.id)
          .not("submitted_waiver_url", "is", null)
          .order("created_at", { ascending: false })
          .limit(1);
        const ws = (subList as Array<{ submitted_waiver_url?: string | null; created_at?: string | null }> | null)?.[0] ?? null;
        if (ws?.submitted_waiver_url?.trim()) {
          effectiveWaiverUrl = ws.submitted_waiver_url;
          effectiveWaiverSignedAt = ws.created_at ?? null;
        }
      }
    }
  }

  // Check waiver settings for club (enabled + template URL + required fields)
  let waiversEnabled = false;
  let requirePhoto = false;
  let waiverTemplateUrl: string | null = null;
  if (club?.id) {
    const { data: waiverSettings } = await supabase
      .from("waiver_settings")
      .select("is_enabled, require_photo, waiver_url")
      .eq("club_id", club.id)
      .maybeSingle();
    const ws = waiverSettings as { is_enabled?: boolean; require_photo?: boolean; waiver_url?: string | null } | null;
    waiversEnabled = ws?.is_enabled ?? false;
    requirePhoto = ws?.require_photo ?? false;
    waiverTemplateUrl = (typeof ws?.waiver_url === "string" && ws.waiver_url) ? ws.waiver_url : null;
  }

  return (
    <main className="flex-grow bg-white pt-28 pb-20">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile and club membership information.
          </p>
        </div>
        <AccountSettings
          site={site}
          clubId={club?.id ?? null}
          user={user}
          membership={membership}
          waiversEnabled={waiversEnabled}
          requirePhoto={requirePhoto}
          waiverTemplateUrl={waiverTemplateUrl}
          effectiveWaiverUrl={effectiveWaiverUrl}
          effectiveWaiverSignedAt={effectiveWaiverSignedAt}
        />
        </div>
      </div>
    </main>
  );
}

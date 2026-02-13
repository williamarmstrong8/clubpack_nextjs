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

  // Fetch member profile
  const { data: member } = await supabase
    .from("members")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  // Check waiver settings for club (enabled + required fields)
  const club = await getClubBySubdomain(site);
  let waiversEnabled = false;
  let requirePhoto = false;
  if (club?.id) {
    const { data: waiverSettings } = await supabase
      .from("waiver_settings")
      .select("is_enabled, require_photo")
      .eq("club_id", club.id)
      .maybeSingle();
    const ws = waiverSettings as { is_enabled?: boolean; require_photo?: boolean } | null;
    waiversEnabled = ws?.is_enabled ?? false;
    requirePhoto = ws?.require_photo ?? false;
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 md:py-14 lg:px-8">
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
          member={member}
          waiversEnabled={waiversEnabled}
          requirePhoto={requirePhoto}
        />
      </div>
    </div>
  );
}

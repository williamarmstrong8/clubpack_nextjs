import { redirect } from "next/navigation";
import { getUser } from "../../(auth)/[site]/actions/auth";
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
    redirect(`/${site}/login`);
  }

  // Fetch member profile
  const supabase = await createClient();
  const { data: member } = await supabase
    .from("members")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 md:py-14 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile and club membership information.
          </p>
        </div>
        <AccountSettings site={site} user={user} member={member} />
      </div>
    </div>
  );
}

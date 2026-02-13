import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "./components/admin-shell";
import { getAdminContext, getDisplayName } from "@/lib/admin/get-admin-context";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "ClubPack Admin",
    template: "%s | ClubPack Admin",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { profile } = await getAdminContext();
  const name = getDisplayName(profile);
  const roleLabel = "Admin";

  let memberCount = 0;
  if (profile.club_id) {
    const supabase = await createClient();
    const { count } = await supabase
      .from("memberships")
      .select("id", { count: "exact", head: true })
      .eq("club_id", profile.club_id);
    memberCount = count ?? 0;
  }

  return (
    <AdminShell user={{ name, role: roleLabel }} memberCount={memberCount}>
      {children}
    </AdminShell>
  );
}

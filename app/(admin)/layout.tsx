import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
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

  if (!profile.club_id) {
    redirect("/auth/create-club");
  }

  const name = getDisplayName(profile);
  const roleLabel = "Admin";

  const supabase = await createClient();
  const { count } = await supabase
    .from("memberships")
    .select("id", { count: "exact", head: true })
    .eq("club_id", profile.club_id);
  const memberCount = count ?? 0;

  return (
    <AdminShell user={{ name, role: roleLabel }} memberCount={memberCount}>
      {children}
    </AdminShell>
  );
}

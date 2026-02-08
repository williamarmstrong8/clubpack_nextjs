import type { Metadata } from "next";
import type { ReactNode } from "react";
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

  return (
    <AdminShell user={{ name, role: roleLabel }}>
      {children}
    </AdminShell>
  );
}

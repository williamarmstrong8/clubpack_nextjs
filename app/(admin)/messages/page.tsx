import { createClient } from "@/lib/supabase/server"
import { getAdminContext } from "@/lib/admin/get-admin-context"
import { MessagesClient, type ContactSubmissionRow } from "./messages-client"

export default async function MessagesPage() {
  const { profile } = await getAdminContext()

  if (!profile.club_id) {
    return (
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Messages</h2>
        <p className="text-sm text-muted-foreground">
          Your admin account is not connected to a club yet.
        </p>
      </div>
    )
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("club_contact_submissions")
    .select("id, first_name, last_name, email, phone_number, message, created_at")
    .eq("club_id", profile.club_id)
    .order("created_at", { ascending: false })

  if (error) {
    return (
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Messages</h2>
        <p className="text-sm text-destructive">{error.message}</p>
      </div>
    )
  }

  const rows = (data ?? []) as ContactSubmissionRow[]
  return <MessagesClient rows={rows} />
}
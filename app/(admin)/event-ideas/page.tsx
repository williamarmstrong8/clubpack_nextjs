import { getAdminContext } from "@/lib/admin/get-admin-context"
import { createClient } from "@/lib/supabase/server"
import { EventIdeasClient, type EventIdeaRow } from "./event-ideas-client"

export const dynamic = "force-dynamic"

export default async function EventIdeasPage() {
  const { profile } = await getAdminContext()

  if (!profile.club_id) {
    return (
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Event ideas</h2>
        <p className="text-sm text-muted-foreground">
          Your admin account is not connected to a club yet.
        </p>
      </div>
    )
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("event_templates")
    .select("id, name, description, category, is_trending, tags, image_url")
    .order("is_trending", { ascending: false })

  if (error) {
    return (
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Event ideas</h2>
        <p className="text-sm text-destructive">{error.message}</p>
      </div>
    )
  }

  const ideas = (data ?? []) as EventIdeaRow[]

  return <EventIdeasClient ideas={ideas} />
}

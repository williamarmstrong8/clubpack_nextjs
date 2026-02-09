import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { getAdminContext } from "@/lib/admin/get-admin-context"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

type EventIdeaRow = {
  id: string
  name: string | null
  description: string | null
  category: string | null
  is_trending: boolean | null
  tags: string[] | null
  image_url: string | null
}

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

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Event ideas</h2>
        <p className="text-sm text-muted-foreground">
          Quick inspiration you can turn into real events.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ideas.map((idea) => (
          <Card key={idea.id} className="overflow-hidden">
            <div className="bg-muted/20 aspect-video w-full overflow-hidden border-b">
              {idea.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={idea.image_url}
                  alt={idea.name ?? "Event idea"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                  No image
                </div>
              )}
            </div>
            <CardHeader className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-base leading-tight">
                  {idea.name ?? "Untitled idea"}
                </CardTitle>
                {idea.is_trending ? <Badge>Trending</Badge> : null}
              </div>
              <div className="flex flex-wrap gap-2">
                {idea.category ? (
                  <Badge variant="secondary">{idea.category}</Badge>
                ) : null}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="line-clamp-3 text-sm text-muted-foreground">
                {idea.description ?? "—"}
              </p>
              {idea.tags?.length ? (
                <div className="flex flex-wrap gap-2">
                  {idea.tags.slice(0, 4).map((t) => (
                    <Badge key={t} variant="outline">
                      {t}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>
        ))}
        {ideas.length === 0 ? (
          <div className="text-sm text-muted-foreground sm:col-span-2 lg:col-span-3">
            No event ideas found.
          </div>
        ) : null}
      </div>
    </div>
  )
}
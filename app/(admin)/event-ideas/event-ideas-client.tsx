"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  CreateEventDialog,
  type CreateEventPrefill,
} from "@/app/(admin)/events/create-event-dialog"

export type EventIdeaRow = {
  id: string
  name: string | null
  description: string | null
  category: string | null
  is_trending: boolean | null
  tags: string[] | null
  image_url: string | null
}

export function EventIdeasClient({ ideas }: { ideas: EventIdeaRow[] }) {
  const [category, setCategory] = React.useState<string>("all")
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [prefill, setPrefill] = React.useState<CreateEventPrefill | undefined>(
    undefined,
  )

  const categories = React.useMemo(() => {
    const set = new Set<string>()
    ideas.forEach((i) => {
      if (i.category) set.add(i.category)
    })
    return Array.from(set).sort()
  }, [ideas])

  const filtered =
    category === "all"
      ? ideas
      : ideas.filter((i) => i.category === category)

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Event ideas</h2>
          <p className="text-sm text-muted-foreground">
            Quick inspiration you can turn into real events.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((idea) => (
          <button
            key={idea.id}
            type="button"
            className="group relative flex flex-col overflow-hidden rounded-lg border bg-card text-left shadow-sm transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => {
              setPrefill({
                title: idea.name ?? "",
                description: idea.description ?? "",
                image_url: idea.image_url ?? undefined,
              })
              setDialogOpen(true)
            }}
          >
            <div className="aspect-video w-full shrink-0 overflow-hidden bg-muted">
              {idea.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={idea.image_url}
                  alt={idea.name ?? "Event idea"}
                  className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                  No image
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold leading-tight line-clamp-2">
                  {idea.name ?? "Untitled idea"}
                </h3>
                {idea.is_trending ? <Badge>Trending</Badge> : null}
              </div>
              {idea.category ? (
                <Badge variant="secondary" className="w-fit">
                  {idea.category}
                </Badge>
              ) : null}
              <p className="line-clamp-3 text-sm text-muted-foreground">
                {idea.description ?? "—"}
              </p>
              {idea.tags?.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {idea.tags.slice(0, 4).map((t) => (
                    <Badge key={t} variant="outline">
                      {t}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>
          </button>
        ))}
        {filtered.length === 0 ? (
          <div className="py-10 text-sm text-muted-foreground sm:col-span-2 lg:col-span-3 text-center">
            No event ideas found.
          </div>
        ) : null}
      </div>

      <CreateEventDialog
        prefill={prefill}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}

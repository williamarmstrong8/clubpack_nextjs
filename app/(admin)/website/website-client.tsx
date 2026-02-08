"use client"

import * as React from "react"
import { ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
  createFaq,
  deleteFaq,
  updateClubSettings,
  updateClubWebsiteContent,
  updateFaq,
} from "./actions"

export type ClubWebsiteContent = {
  subdomain: string | null
  hero_headline: string | null
  hero_subtext: string | null
  tagline: string | null
  instagram: string | null
}

export type ClubSettings = {
  show_event_calendar: boolean
  show_contact_page: boolean
  show_explore_page: boolean
  require_login_to_rsvp: boolean
}

export type FaqRow = {
  id: string
  question: string
  answer: string
  order_index: number
}

export function WebsiteClient({
  initial,
  settings,
  faqs,
  rootDomain,
}: {
  initial: ClubWebsiteContent
  settings: ClubSettings
  faqs: FaqRow[]
  rootDomain: string
}) {
  const [isPending, startTransition] = React.useTransition()

  const [featureFlags, setFeatureFlags] = React.useState<ClubSettings>(settings)

  const [form, setForm] = React.useState({
    hero_headline: initial.hero_headline ?? "",
    hero_subtext: initial.hero_subtext ?? "",
    tagline: initial.tagline ?? "",
    instagram: initial.instagram ?? "",
  })

  const [newFaq, setNewFaq] = React.useState({
    question: "",
    answer: "",
  })

  const previewUrl =
    initial.subdomain && rootDomain
      ? `https://${initial.subdomain}.${rootDomain}`
      : null

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Website & App</h2>
          <p className="text-sm text-muted-foreground">
            Update content shown on your club site.
          </p>
        </div>
        <Button
          variant="outline"
          disabled={!previewUrl}
          onClick={() => {
            if (!previewUrl) return
            window.open(previewUrl, "_blank", "noreferrer")
          }}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Preview
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Content</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="hero_headline">Headline</Label>
              <Input
                id="hero_headline"
                value={form.hero_headline}
                onChange={(e) =>
                  setForm((f) => ({ ...f, hero_headline: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hero_subtext">Subheadline</Label>
              <Textarea
                id="hero_subtext"
                rows={4}
                value={form.hero_subtext}
                onChange={(e) =>
                  setForm((f) => ({ ...f, hero_subtext: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={form.tagline}
                onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={form.instagram}
                onChange={(e) =>
                  setForm((f) => ({ ...f, instagram: e.target.value }))
                }
              />
            </div>
            <Button
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  await updateClubWebsiteContent({
                    hero_headline: form.hero_headline,
                    hero_subtext: form.hero_subtext,
                    tagline: form.tagline,
                    instagram: form.instagram,
                  })
                })
              }}
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Toggles</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Show event calendar</div>
                <div className="text-xs text-muted-foreground">
                  Display the events section on the club site.
                </div>
              </div>
              <Switch
                checked={featureFlags.show_event_calendar}
                onCheckedChange={(v) =>
                  setFeatureFlags((s) => ({ ...s, show_event_calendar: v }))
                }
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Show contact page</div>
                <div className="text-xs text-muted-foreground">
                  Enable the contact form page.
                </div>
              </div>
              <Switch
                checked={featureFlags.show_contact_page}
                onCheckedChange={(v) =>
                  setFeatureFlags((s) => ({ ...s, show_contact_page: v }))
                }
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Show explore page</div>
                <div className="text-xs text-muted-foreground">
                  Enable an explore page (if present).
                </div>
              </div>
              <Switch
                checked={featureFlags.show_explore_page}
                onCheckedChange={(v) =>
                  setFeatureFlags((s) => ({ ...s, show_explore_page: v }))
                }
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Require login to RSVP</div>
                <div className="text-xs text-muted-foreground">
                  Users must authenticate before RSVPing.
                </div>
              </div>
              <Switch
                checked={featureFlags.require_login_to_rsvp}
                onCheckedChange={(v) =>
                  setFeatureFlags((s) => ({ ...s, require_login_to_rsvp: v }))
                }
              />
            </div>

            <Button
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  await updateClubSettings(featureFlags)
                })
              }}
            >
              {isPending ? "Saving..." : "Save toggles"}
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">FAQs</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-3 rounded-lg border p-3">
              <div className="text-sm font-medium">Add FAQ</div>
              <div className="grid gap-2">
                <Label htmlFor="newFaqQuestion">Question</Label>
                <Input
                  id="newFaqQuestion"
                  value={newFaq.question}
                  onChange={(e) =>
                    setNewFaq((f) => ({ ...f, question: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newFaqAnswer">Answer</Label>
                <Textarea
                  id="newFaqAnswer"
                  rows={3}
                  value={newFaq.answer}
                  onChange={(e) =>
                    setNewFaq((f) => ({ ...f, answer: e.target.value }))
                  }
                />
              </div>
              <Button
                disabled={isPending || !newFaq.question.trim() || !newFaq.answer.trim()}
                onClick={() => {
                  startTransition(async () => {
                    const nextIndex =
                      faqs.length > 0
                        ? Math.max(...faqs.map((f) => f.order_index ?? 0)) + 1
                        : 0
                    await createFaq({
                      question: newFaq.question.trim(),
                      answer: newFaq.answer.trim(),
                      order_index: nextIndex,
                    })
                    setNewFaq({ question: "", answer: "" })
                  })
                }}
              >
                Add FAQ
              </Button>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Order</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead>Answer</TableHead>
                    <TableHead className="w-[180px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faqs.map((f) => (
                    <FaqRowEditor key={f.id} row={f} disabled={isPending} />
                  ))}
                  {faqs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-10 text-center">
                        <div className="text-sm text-muted-foreground">
                          No FAQs yet.
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Preview (placeholder)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-10 w-32" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function FaqRowEditor({
  row,
  disabled,
}: {
  row: FaqRow
  disabled: boolean
}) {
  const [isPending, startTransition] = React.useTransition()
  const [local, setLocal] = React.useState(row)

  return (
    <TableRow>
      <TableCell>
        <Input
          value={String(local.order_index)}
          onChange={(e) =>
            setLocal((p) => ({ ...p, order_index: Number(e.target.value) || 0 }))
          }
          disabled={disabled || isPending}
        />
      </TableCell>
      <TableCell>
        <Input
          value={local.question}
          onChange={(e) => setLocal((p) => ({ ...p, question: e.target.value }))}
          disabled={disabled || isPending}
        />
      </TableCell>
      <TableCell>
        <Textarea
          rows={2}
          value={local.answer}
          onChange={(e) => setLocal((p) => ({ ...p, answer: e.target.value }))}
          disabled={disabled || isPending}
        />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            disabled={disabled || isPending}
            onClick={() => {
              startTransition(async () => {
                await updateFaq({
                  id: row.id,
                  question: local.question,
                  answer: local.answer,
                  order_index: local.order_index,
                })
              })
            }}
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
          <Button
            variant="destructive"
            disabled={disabled || isPending}
            onClick={() => {
              startTransition(async () => {
                await deleteFaq(row.id)
              })
            }}
          >
            Delete
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}


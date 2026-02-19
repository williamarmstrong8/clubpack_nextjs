"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronUp, ExternalLink, ImagePlus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  createFaq,
  deleteFaq,
  reorderFaqs,
  updateClubBranding,
  updateClubSettings,
  updateClubWebsiteContent,
  uploadClubHeroImage,
  uploadClubLogo,
  updateFaq,
} from "./actions"

export type ClubWebsiteContent = {
  subdomain: string | null
  name: string | null
  hero_headline: string | null
  hero_subtext: string | null
  tagline: string | null
  instagram: string | null
  primary_color?: string | null
  logo_url?: string | null
  hero_image_url?: string | null
  about_blurb?: string | null
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
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  const [reorderPending, setReorderPending] = React.useState(false)

  const handleMoveFaq = React.useCallback(
    (id: string, direction: "up" | "down") => {
      const idx = faqs.findIndex((f) => f.id === id)
      if (idx === -1) return
      if (direction === "up" && idx === 0) return
      if (direction === "down" && idx === faqs.length - 1) return
      const newOrder = [...faqs]
      const swap = direction === "up" ? idx - 1 : idx + 1
      ;[newOrder[idx], newOrder[swap]] = [newOrder[swap], newOrder[idx]]
      setReorderPending(true)
      reorderFaqs(newOrder.map((f) => f.id)).then(() => {
        router.refresh()
        setReorderPending(false)
      })
    },
    [faqs, router],
  )

  const [featureFlags, setFeatureFlags] = React.useState<ClubSettings>(settings)

  const [brandingForm, setBrandingForm] = React.useState({
    name: initial.name ?? "",
    primary_color: initial.primary_color ?? "#0ea5e9",
  })

  const [websiteForm, setWebsiteForm] = React.useState({
    hero_headline: initial.hero_headline ?? "",
    hero_subtext: initial.hero_subtext ?? "",
    tagline: initial.tagline ?? "",
    instagram: initial.instagram ?? "",
    about_blurb: initial.about_blurb ?? "",
  })

  const [logoFile, setLogoFile] = React.useState<File | null>(null)
  const [logoPreview, setLogoPreview] = React.useState<string | null>(
    initial.logo_url ?? null,
  )
  const [heroFile, setHeroFile] = React.useState<File | null>(null)
  const [heroPreview, setHeroPreview] = React.useState<string | null>(
    initial.hero_image_url ?? null,
  )

  React.useEffect(() => {
    return () => {
      if (logoPreview?.startsWith("blob:")) URL.revokeObjectURL(logoPreview)
      if (heroPreview?.startsWith("blob:")) URL.revokeObjectURL(heroPreview)
    }
  }, [logoPreview, heroPreview])

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
        {/* Left column: Branding + Website */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Club branding</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="club_name">Club name</Label>
                <Input
                  id="club_name"
                  value={brandingForm.name}
                  onChange={(e) =>
                    setBrandingForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Your club name"
                />
              </div>
              <div className="grid gap-2">
                <Label>Logo</Label>
                <input
                  id="logoUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null
                    if (!file) return
                    if (logoPreview?.startsWith("blob:")) URL.revokeObjectURL(logoPreview)
                    setLogoFile(file)
                    setLogoPreview(URL.createObjectURL(file))
                  }}
                />
                <button
                  type="button"
                  className="border-muted-foreground/25 hover:border-muted-foreground/40 bg-muted/20 hover:bg-muted/30 flex items-center justify-center rounded-lg border-2 border-dashed p-3 transition-colors"
                  onClick={() => document.getElementById("logoUpload")?.click()}
                >
                  <div className="flex w-full items-center gap-3">
                    <div className="bg-background aspect-square h-16 w-16 overflow-hidden rounded-md border">
                      {logoPreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <ImagePlus className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 text-left">
                      <div className="text-sm font-medium">Upload logo</div>
                      <div className="text-xs text-muted-foreground">
                        PNG/SVG recommended. Click to choose a file.
                      </div>
                    </div>
                  </div>
                </button>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="primary_color">Primary club color</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="primary_color"
                    type="color"
                    value={brandingForm.primary_color}
                    onChange={(e) =>
                      setBrandingForm((f) => ({ ...f, primary_color: e.target.value }))
                    }
                    className="h-9 w-14 p-1"
                  />
                  <Input
                    value={brandingForm.primary_color}
                    onChange={(e) =>
                      setBrandingForm((f) => ({ ...f, primary_color: e.target.value }))
                    }
                    className="font-mono"
                  />
                </div>
              </div>
              <Button
                disabled={isPending}
                onClick={() => {
                  startTransition(async () => {
                    await updateClubBranding({
                      name: brandingForm.name,
                      primary_color: brandingForm.primary_color,
                    })
                    if (logoFile) {
                      const fd = new FormData()
                      fd.set("file", logoFile)
                      await uploadClubLogo(fd)
                      setLogoFile(null)
                    }
                  })
                }}
              >
                {isPending ? "Saving..." : "Save branding"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Website</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="hero_headline">Headline</Label>
                <Input
                  id="hero_headline"
                  value={websiteForm.hero_headline}
                  onChange={(e) =>
                    setWebsiteForm((f) => ({ ...f, hero_headline: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hero_subtext">Subheadline</Label>
                <Input
                  id="hero_subtext"
                  value={websiteForm.hero_subtext}
                  onChange={(e) =>
                    setWebsiteForm((f) => ({ ...f, hero_subtext: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Hero image (16:9)</Label>
                <input
                  id="heroUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null
                    if (!file) return
                    if (heroPreview?.startsWith("blob:")) URL.revokeObjectURL(heroPreview)
                    setHeroFile(file)
                    setHeroPreview(URL.createObjectURL(file))
                  }}
                />
                <button
                  type="button"
                  className="border-muted-foreground/25 hover:border-muted-foreground/40 bg-muted/20 hover:bg-muted/30 aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed transition-colors"
                  onClick={() => document.getElementById("heroUpload")?.click()}
                >
                  {heroPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={heroPreview}
                      alt="Hero preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                      <ImagePlus className="h-5 w-5" />
                      <div className="text-sm font-medium">Upload hero image</div>
                      <div className="text-xs">Recommended: 16:9</div>
                    </div>
                  )}
                </button>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="about_blurb">About club</Label>
                <Textarea
                  id="about_blurb"
                  rows={5}
                  value={websiteForm.about_blurb}
                  onChange={(e) =>
                    setWebsiteForm((f) => ({ ...f, about_blurb: e.target.value }))
                  }
                  placeholder="A quick, friendly description of what your club is about."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={websiteForm.tagline}
                  onChange={(e) => setWebsiteForm((f) => ({ ...f, tagline: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={websiteForm.instagram}
                  onChange={(e) =>
                    setWebsiteForm((f) => ({ ...f, instagram: e.target.value }))
                  }
                />
              </div>
              <Button
                disabled={isPending}
                onClick={() => {
                  startTransition(async () => {
                    await updateClubWebsiteContent({
                      hero_headline: websiteForm.hero_headline,
                      hero_subtext: websiteForm.hero_subtext,
                      tagline: websiteForm.tagline,
                      instagram: websiteForm.instagram,
                      about_blurb: websiteForm.about_blurb,
                    })
                    if (heroFile) {
                      const fd = new FormData()
                      fd.set("file", heroFile)
                      await uploadClubHeroImage(fd)
                      setHeroFile(null)
                    }
                  })
                }}
              >
                {isPending ? "Saving..." : "Save"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Toggles + FAQs */}
        <div className="flex flex-col gap-4">
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

          <Card>
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

              <div className="flex flex-col gap-4">
                {faqs.map((f, index) => (
                  <FaqRowEditor
                    key={f.id}
                    row={f}
                    disabled={isPending}
                    reorderDisabled={reorderPending}
                    canMoveUp={index > 0}
                    canMoveDown={index < faqs.length - 1}
                    onMoveUp={() => handleMoveFaq(f.id, "up")}
                    onMoveDown={() => handleMoveFaq(f.id, "down")}
                  />
                ))}
                {faqs.length === 0 ? (
                  <div className="py-10 text-center text-sm text-muted-foreground rounded-lg border border-dashed">
                    No FAQs yet.
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function FaqRowEditor({
  row,
  disabled,
  reorderDisabled,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
}: {
  row: FaqRow
  disabled: boolean
  reorderDisabled: boolean
  canMoveUp: boolean
  canMoveDown: boolean
  onMoveUp: () => void
  onMoveDown: () => void
}) {
  const [isPending, startTransition] = React.useTransition()
  const [local, setLocal] = React.useState(row)

  return (
    <div className="grid gap-3 rounded-lg border p-3">
      <div className="grid gap-2">
        <Label>Question</Label>
        <Input
          value={local.question}
          onChange={(e) => setLocal((p) => ({ ...p, question: e.target.value }))}
          disabled={disabled || isPending}
        />
      </div>
      <div className="grid gap-2">
        <Label>Answer</Label>
        <Textarea
          rows={3}
          value={local.answer}
          onChange={(e) => setLocal((p) => ({ ...p, answer: e.target.value }))}
          disabled={disabled || isPending}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            disabled={reorderDisabled || !canMoveUp}
            onClick={onMoveUp}
            title="Move up"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={reorderDisabled || !canMoveDown}
            onClick={onMoveDown}
            title="Move down"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            disabled={disabled || isPending}
            onClick={() => {
              startTransition(async () => {
                await updateFaq({
                  id: row.id,
                  question: local.question,
                  answer: local.answer,
                  order_index: row.order_index,
                })
              })
            }}
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
          <Button
            variant="destructive"
            size="icon"
            disabled={disabled || isPending}
            onClick={() => {
              startTransition(async () => {
                await deleteFaq(row.id)
              })
            }}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}


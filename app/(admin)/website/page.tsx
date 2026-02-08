"use client"

import * as React from "react"
import { ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"

export default function WebsitePage() {
  const [form, setForm] = React.useState({
    headline: "Run with us every week",
    subheadline: "Weekly long runs, workouts, and a friendly community.",
    primaryCta: "Join the club",
    instagram: "@clubpackrunclub",
  })

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Website & App</h2>
          <p className="text-sm text-muted-foreground">
            Update content shown on your club site (mock UI).
          </p>
        </div>
        <Button variant="outline" onClick={() => console.log("Open preview (mock)")}>
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
              <Label htmlFor="headline">Headline</Label>
              <Input
                id="headline"
                value={form.headline}
                onChange={(e) =>
                  setForm((f) => ({ ...f, headline: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subheadline">Subheadline</Label>
              <Textarea
                id="subheadline"
                rows={4}
                value={form.subheadline}
                onChange={(e) =>
                  setForm((f) => ({ ...f, subheadline: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="primaryCta">Primary CTA</Label>
              <Input
                id="primaryCta"
                value={form.primaryCta}
                onChange={(e) =>
                  setForm((f) => ({ ...f, primaryCta: e.target.value }))
                }
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
            <Button onClick={() => console.log("Save website changes (mock)", form)}>
              Save
            </Button>
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
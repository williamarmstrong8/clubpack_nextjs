"use client"

import * as React from "react"
import { ExternalLink, FileUp, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { uploadWaiverTemplate, upsertWaiverSettings } from "./actions"

type WaiverSubmissionRow = {
  id: string
  created_at: string | null
  membership_id: string | null
  submitted_waiver_url: string | null
  full_name: string | null
  email: string | null
  photo_url: string | null
}

export function WaiversClient({
  initial,
}: {
  initial: {
    settings: {
      is_enabled: boolean
      waiver_url: string | null
      require_photo: boolean
      require_name: boolean
      require_email: boolean
      require_rsvp: boolean
    }
    submissions: WaiverSubmissionRow[]
  }
}) {
  const [isPending, startTransition] = React.useTransition()
  const [settings, setSettings] = React.useState(initial.settings)
  const [templateFile, setTemplateFile] = React.useState<File | null>(null)

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Waivers</h2>
          <p className="text-sm text-muted-foreground">
            Require waivers and review submissions.
          </p>
        </div>
        <Button
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await upsertWaiverSettings({
                is_enabled: settings.is_enabled,
                require_photo: settings.require_photo,
                require_name: settings.require_name,
                require_email: settings.require_email,
                require_rsvp: settings.require_rsvp,
              })
            })
          }}
        >
          <Save className="mr-2 h-4 w-4" />
          {isPending ? "Saving..." : "Save settings"}
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Waiver requirements</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Enable waivers</div>
                <div className="text-xs text-muted-foreground">
                  Turn waiver checks on for your club.
                </div>
              </div>
              <Switch
                checked={settings.is_enabled}
                onCheckedChange={(v) => setSettings((s) => ({ ...s, is_enabled: v }))}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Require waiver to RSVP</div>
                <div className="text-xs text-muted-foreground">
                  Block RSVPs until waiver is submitted.
                </div>
              </div>
              <Switch
                checked={settings.require_rsvp}
                onCheckedChange={(v) => setSettings((s) => ({ ...s, require_rsvp: v }))}
              />
            </div>

            <div className="grid gap-3 rounded-lg border p-3">
              <div className="text-sm font-medium">Required fields</div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Name</span>
                <Switch
                  checked={settings.require_name}
                  onCheckedChange={(v) => setSettings((s) => ({ ...s, require_name: v }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Email</span>
                <Switch
                  checked={settings.require_email}
                  onCheckedChange={(v) => setSettings((s) => ({ ...s, require_email: v }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Photo</span>
                <Switch
                  checked={settings.require_photo}
                  onCheckedChange={(v) =>
                    setSettings((s) => ({ ...s, require_photo: v }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Waiver template</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="rounded-lg border p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium">Current template</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {settings.waiver_url ?? "No template uploaded yet."}
                  </div>
                </div>
                {settings.waiver_url ? (
                  <Button asChild variant="outline" size="sm">
                    <a href={settings.waiver_url} target="_blank" rel="noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>

            <input
              id="waiverUpload"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => setTemplateFile(e.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              className="border-muted-foreground/25 hover:border-muted-foreground/40 bg-muted/20 hover:bg-muted/30 flex items-center justify-between gap-3 rounded-lg border-2 border-dashed p-3 text-left transition-colors"
              onClick={() => document.getElementById("waiverUpload")?.click()}
            >
              <div className="min-w-0">
                <div className="text-sm font-medium">Upload PDF</div>
                <div className="truncate text-xs text-muted-foreground">
                  {templateFile ? templateFile.name : "Choose a waiver template."}
                </div>
              </div>
              <FileUp className="h-5 w-5 text-muted-foreground" />
            </button>

            <Button
              variant="outline"
              disabled={isPending || !templateFile}
              onClick={() => {
                if (!templateFile) return
                startTransition(async () => {
                  const fd = new FormData()
                  fd.set("file", templateFile)
                  await uploadWaiverTemplate(fd)
                  setTemplateFile(null)
                })
              }}
            >
              {isPending ? "Uploading..." : "Upload"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Submitted</TableHead>
                  <TableHead className="text-right">Files</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initial.submissions.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">
                      {s.full_name ?? "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {s.email ?? "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {s.created_at ? new Date(s.created_at).toLocaleString() : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center justify-end gap-2">
                        {s.submitted_waiver_url ? (
                          <Button asChild variant="outline" size="sm">
                            <a
                              href={s.submitted_waiver_url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Waiver
                            </a>
                          </Button>
                        ) : null}
                        {s.photo_url ? (
                          <Button asChild variant="outline" size="sm">
                            <a href={s.photo_url} target="_blank" rel="noreferrer">
                              Photo
                            </a>
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {initial.submissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center">
                      <div className="text-sm text-muted-foreground">
                        No submissions yet.
                      </div>
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


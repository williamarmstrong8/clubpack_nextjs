"use client"

import * as React from "react"
import { Mail, Search, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { deleteContactSubmission } from "./actions"

export type ContactSubmissionRow = {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  phone_number: string | null
  message: string | null
  created_at: string
}

const CONFIRM_RESET_MS = 3000

export function MessagesClient({ rows }: { rows: ContactSubmissionRow[] }) {
  const [query, setQuery] = React.useState("")
  const [isPending, startTransition] = React.useTransition()
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const [viewing, setViewing] = React.useState<ContactSubmissionRow | null>(null)
  const [viewOpen, setViewOpen] = React.useState(false)
  const [confirmingId, setConfirmingId] = React.useState<string | null>(null)
  const confirmTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearConfirm = React.useCallback(() => {
    setConfirmingId(null)
    if (confirmTimeoutRef.current) {
      clearTimeout(confirmTimeoutRef.current)
      confirmTimeoutRef.current = null
    }
  }, [])

  const enterConfirmMode = React.useCallback((id: string) => {
    setConfirmingId(id)
    confirmTimeoutRef.current = setTimeout(() => {
      setConfirmingId(null)
      confirmTimeoutRef.current = null
    }, CONFIRM_RESET_MS)
  }, [])

  // Reset confirmation when modal closes
  React.useEffect(() => {
    if (!viewOpen) clearConfirm()
  }, [viewOpen, clearConfirm])

  // 3-second reset timer
  React.useEffect(() => {
    return () => {
      if (confirmTimeoutRef.current) clearTimeout(confirmTimeoutRef.current)
    }
  }, [])

  // Click anywhere else to cancel confirmation (but not on a delete/confirm button)
  React.useEffect(() => {
    if (confirmingId === null) return
    const onDocClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest?.("[data-delete-message-btn]") != null) return
      clearConfirm()
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [confirmingId, clearConfirm])

  const handleDeleteClick = React.useCallback(
    (id: string, onAfterDelete?: () => void) => {
      if (confirmingId === id) {
        clearConfirm()
        startTransition(async () => {
          setDeletingId(id)
          await deleteContactSubmission(id)
          setDeletingId(null)
          onAfterDelete?.()
        })
      } else {
        enterConfirmMode(id)
      }
    },
    [confirmingId, clearConfirm, enterConfirmMode],
  )

  const filtered = rows.filter((r) => {
    const q = query.toLowerCase()
    const haystack = [
      r.first_name ?? "",
      r.last_name ?? "",
      r.email ?? "",
      r.phone_number ?? "",
      r.message ?? "",
    ]
      .join(" ")
      .toLowerCase()
    return haystack.includes(q)
  })

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Messages</h2>
          <p className="text-sm text-muted-foreground">
            Contact form submissions for your club.
          </p>
        </div>

        <div className="relative sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search messages..."
            className="pl-9"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Inbox</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead className="w-[140px] text-right">Received</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => {
                  const from = `${r.first_name ?? ""} ${r.last_name ?? ""}`.trim() || "—"
                  const received = r.created_at
                    ? new Date(r.created_at).toLocaleDateString()
                    : "—"

                  return (
                    <TableRow
                      key={r.id}
                      className="cursor-pointer"
                      onClick={() => {
                        setViewing(r)
                        setViewOpen(true)
                      }}
                    >
                      <TableCell className="font-medium">{from}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {r.email ?? "—"}
                      </TableCell>
                      <TableCell className="max-w-[520px] truncate text-muted-foreground">
                        {r.message ?? "—"}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {received}
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <Button
                          data-delete-message-btn
                          size={confirmingId === r.id ? "sm" : "icon"}
                          variant={confirmingId === r.id ? "destructive" : "ghost"}
                          disabled={isPending && deletingId === r.id}
                          onClick={() => handleDeleteClick(r.id)}
                          className={confirmingId === r.id ? "min-w-[80px]" : undefined}
                        >
                          {confirmingId === r.id ? (
                            "Confirm?"
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center">
                      <div className="text-sm text-muted-foreground">
                        No messages found.
                      </div>
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={viewOpen}
        onOpenChange={(v) => {
          setViewOpen(v)
          if (!v) {
            // Clear viewing after close so content doesn't flash blank during exit animation
            setTimeout(() => setViewing(null), 200)
          }
        }}
      >
        <DialogContent className="sm:max-w-[720px] max-h-[85vh] flex flex-col gap-4 !grid-rows-none p-0">
          <DialogHeader className="shrink-0 px-6 pt-6">
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              {viewing
                ? `Message from ${[viewing.first_name, viewing.last_name].filter(Boolean).join(" ") || "Unknown"}`
                : "Message"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-y-auto px-6">
            {viewing && (
              <div className="grid gap-4">
                <div className="grid gap-2 text-sm">
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <span className="text-muted-foreground">From:</span>
                    <span className="font-medium">
                      {[viewing.first_name, viewing.last_name].filter(Boolean).join(" ") || "—"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <span className="text-muted-foreground">Email:</span>
                    <a
                      href={viewing.email ? `mailto:${viewing.email}` : undefined}
                      className="text-primary hover:underline"
                    >
                      {viewing.email ?? "—"}
                    </a>
                  </div>
                  {viewing.phone_number ? (
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      <span className="text-muted-foreground">Phone:</span>
                      <a
                        href={`tel:${viewing.phone_number}`}
                        className="text-primary hover:underline"
                      >
                        {viewing.phone_number}
                      </a>
                    </div>
                  ) : null}
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <span className="text-muted-foreground">Received:</span>
                    <span>
                      {viewing.created_at
                        ? new Date(viewing.created_at).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "—"}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Message</div>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {viewing.message ?? "No message content."}
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="shrink-0 px-6 pb-6">
            <Button variant="outline" onClick={() => setViewOpen(false)}>
              Close
            </Button>
            {viewing && (
              <Button
                data-delete-message-btn
                variant={confirmingId === viewing.id ? "destructive" : "outline"}
                disabled={isPending && deletingId === viewing.id}
                onClick={() =>
                  handleDeleteClick(viewing.id, () => {
                    setViewOpen(false)
                    setViewing(null)
                  })
                }
              >
                {confirmingId === viewing.id ? (
                  "Confirm?"
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-1.5" />
                    Delete
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


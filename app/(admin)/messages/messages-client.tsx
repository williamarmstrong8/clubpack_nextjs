"use client"

import * as React from "react"
import { Search, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

export function MessagesClient({ rows }: { rows: ContactSubmissionRow[] }) {
  const [query, setQuery] = React.useState("")
  const [isPending, startTransition] = React.useTransition()
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

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
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => {
                  const from = `${r.first_name ?? ""} ${r.last_name ?? ""}`.trim() || "—"
                  const received = r.created_at
                    ? new Date(r.created_at).toLocaleDateString()
                    : "—"

                  return (
                    <TableRow key={r.id}>
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
                      <TableCell className="text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          disabled={isPending && deletingId === r.id}
                          onClick={() => {
                            startTransition(async () => {
                              setDeletingId(r.id)
                              await deleteContactSubmission(r.id)
                              setDeletingId(null)
                            })
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
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
    </div>
  )
}


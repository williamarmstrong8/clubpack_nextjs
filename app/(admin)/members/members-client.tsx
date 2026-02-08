"use client"

import * as React from "react"
import { Copy, Search, UserPlus } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type MemberRow = {
  id: string
  name: string | null
  email: string | null
  joined_at: string | null
  status: string | null
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0]?.toUpperCase())
    .slice(0, 2)
    .join("")
}

export function MembersClient({
  members,
}: {
  members: MemberRow[]
}) {
  const [query, setQuery] = React.useState("")
  const [inviteOpen, setInviteOpen] = React.useState(false)
  const inviteLink = "https://example.joinclubpack.com/invite/club-123"

  const filtered = members.filter((m) => {
    const name = (m.name ?? "").toLowerCase()
    const email = (m.email ?? "").toLowerCase()
    const matchesQuery =
      name.includes(query.toLowerCase()) || email.includes(query.toLowerCase())
    return matchesQuery
  })

  const total = members.length

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Members</h2>
          <p className="text-sm text-muted-foreground">
            Search and manage your member list.
          </p>
        </div>

        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite members</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3">
              <div className="text-sm text-muted-foreground">
                Share this link with new members.
              </div>
              <div className="grid gap-2">
                <Label htmlFor="inviteLink">Invite link</Label>
                <Input id="inviteLink" readOnly value={inviteLink} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setInviteOpen(false)}>
                Close
              </Button>
              <Button
                onClick={async () => {
                  await navigator.clipboard.writeText(inviteLink)
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy link
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{total}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">Member directory</CardTitle>
            <p className="text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "result" : "results"}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search members..."
                className="pl-9 sm:w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden md:table-cell">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="text-xs">
                            {initials(m.name ?? "Member")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="truncate font-medium">{m.name ?? "—"}</div>
                          <div className="truncate text-xs text-muted-foreground md:hidden">
                            {m.email ?? "—"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {m.email ?? "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {m.joined_at
                        ? new Date(m.joined_at).toLocaleDateString()
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="py-10 text-center">
                      <div className="text-sm text-muted-foreground">
                        No members found.
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


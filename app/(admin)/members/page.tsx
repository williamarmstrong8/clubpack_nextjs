"use client"

import * as React from "react"
import { Copy, Search, UserPlus } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Member = {
  id: string
  name: string
  email: string
  role: "member" | "organizer" | "admin"
  joinedAt: string // ISO
}

const members: Member[] = [
  {
    id: "m1",
    name: "Avery Johnson",
    email: "avery@clubpack.dev",
    role: "admin",
    joinedAt: "2025-10-12",
  },
  {
    id: "m2",
    name: "Jordan Lee",
    email: "jordan@clubpack.dev",
    role: "organizer",
    joinedAt: "2025-12-03",
  },
  {
    id: "m3",
    name: "Sam Patel",
    email: "sam@clubpack.dev",
    role: "member",
    joinedAt: "2026-01-07",
  },
  {
    id: "m4",
    name: "Taylor Nguyen",
    email: "taylor@clubpack.dev",
    role: "member",
    joinedAt: "2026-02-02",
  },
]

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0]?.toUpperCase())
    .slice(0, 2)
    .join("")
}

function roleBadge(role: Member["role"]) {
  if (role === "admin") return <Badge>Admin</Badge>
  if (role === "organizer") return <Badge variant="secondary">Organizer</Badge>
  return <Badge variant="outline">Member</Badge>
}

export default function MembersPage() {
  const [query, setQuery] = React.useState("")
  const [tab, setTab] = React.useState<"all" | Member["role"]>("all")
  const [inviteOpen, setInviteOpen] = React.useState(false)
  const inviteLink = "https://example.joinclubpack.com/invite/club-123"

  const filtered = members.filter((m) => {
    const matchesQuery =
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.email.toLowerCase().includes(query.toLowerCase())
    const matchesRole = tab === "all" ? true : m.role === tab
    return matchesQuery && matchesRole
  })

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Members</h2>
          <p className="text-sm text-muted-foreground">
            Search, filter, and manage member roles.
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
              <Button
                variant="outline"
                onClick={() => setInviteOpen(false)}
              >
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
            <div className="text-3xl font-semibold">{members.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {members.filter((m) => m.role === "admin").length}
            </div>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Organizers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {members.filter((m) => m.role === "organizer").length}
            </div>
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
            <Tabs
              value={tab}
              onValueChange={(v) => {
                if (v === "member" || v === "organizer" || v === "admin") {
                  setTab(v)
                  return
                }
                setTab("all")
              }}
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="member">Members</TabsTrigger>
                <TabsTrigger value="organizer">Organizers</TabsTrigger>
                <TabsTrigger value="admin">Admins</TabsTrigger>
              </TabsList>
            </Tabs>
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
                  <TableHead className="text-right">Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="text-xs">
                            {initials(m.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="truncate font-medium">{m.name}</div>
                          <div className="truncate text-xs text-muted-foreground md:hidden">
                            {m.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {m.email}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {new Date(`${m.joinedAt}T00:00:00`).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">{roleBadge(m.role)}</TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center">
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
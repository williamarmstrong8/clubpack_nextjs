"use client"

import * as React from "react"
import { Send } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"

const messages = [
  {
    id: "msg1",
    title: "Saturday long run details",
    audience: "All members",
    status: "Sent",
    sentAt: "2026-02-06",
  },
  {
    id: "msg2",
    title: "Track workout reminder",
    audience: "Organizers",
    status: "Draft",
    sentAt: "—",
  },
]

export default function MessagesPage() {
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState({
    title: "",
    audience: "All members",
    body: "",
  })

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Messages</h2>
          <p className="text-sm text-muted-foreground">
            Broadcast updates to members (mock UI).
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Compose
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Compose message</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={draft.title}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, title: e.target.value }))
                  }
                  placeholder="What’s the update?"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="audience">Audience</Label>
                <Input
                  id="audience"
                  value={draft.audience}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, audience: e.target.value }))
                  }
                  placeholder="All members"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="body">Message</Label>
                <Textarea
                  id="body"
                  rows={8}
                  value={draft.body}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, body: e.target.value }))
                  }
                  placeholder="Write your message..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  console.log("Send message (mock)", draft)
                  setOpen(false)
                  setDraft({ title: "", audience: "All members", body: "" })
                }}
              >
                Send
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Audience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Sent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.title}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {m.audience}
                    </TableCell>
                    <TableCell>
                      {m.status === "Sent" ? (
                        <Badge>Sent</Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {m.sentAt}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
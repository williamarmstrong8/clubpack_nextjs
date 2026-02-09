"use client"

import * as React from "react"
import { Copy, Link2 } from "lucide-react"

import { Button } from "@/components/ui/button"
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

type InviteMembersDialogProps = {
  inviteUrl: string
  trigger?: React.ReactNode
  title?: string
}

function fallbackCopy(text: string) {
  try {
    const textarea = document.createElement("textarea")
    textarea.value = text
    textarea.setAttribute("readonly", "true")
    textarea.style.position = "fixed"
    textarea.style.top = "0"
    textarea.style.left = "0"
    textarea.style.opacity = "0"
    textarea.style.pointerEvents = "none"
    document.body.appendChild(textarea)
    textarea.select()
    textarea.setSelectionRange(0, textarea.value.length)
    const ok = document.execCommand("copy")
    document.body.removeChild(textarea)
    return ok
  } catch {
    return false
  }
}

export function InviteMembersDialog({
  inviteUrl,
  trigger,
  title = "Invite members",
}: InviteMembersDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!open) setCopied(false)
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline">
            <Link2 className="mr-2 h-4 w-4" />
            Invite members
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          <p className="text-sm text-muted-foreground">
            Share this link with new members.
          </p>

          <div className="grid gap-2">
            <Label htmlFor="inviteLink">Invite link</Label>
            <div className="flex gap-2">
              <Input id="inviteLink" readOnly value={inviteUrl} />
              <Button
                type="button"
                variant="outline"
                className="shrink-0"
                onClick={async () => {
                  try {
                    if (navigator.clipboard && window.isSecureContext) {
                      await navigator.clipboard.writeText(inviteUrl)
                      setCopied(true)
                      return
                    }
                    const ok = fallbackCopy(inviteUrl)
                    setCopied(ok)
                  } catch {
                    const ok = fallbackCopy(inviteUrl)
                    setCopied(ok)
                  }
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


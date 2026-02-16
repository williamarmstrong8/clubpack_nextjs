"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export type MemberModalMember = {
  id: string
  name: string | null
  email: string | null
  joined_at: string | null
  phone?: string | null
  role?: string | null
  avatar_url?: string | null
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0]?.toUpperCase())
    .slice(0, 2)
    .join("")
}

type MemberModalProps = {
  member: MemberModalMember | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MemberModal({ member, open, onOpenChange }: MemberModalProps) {
  if (!member) return null

  const joinedDate = member.joined_at
    ? new Date(member.joined_at).toLocaleDateString(undefined, {
        dateStyle: "medium",
      })
    : "—"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">Member details</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 pt-2">
          <Avatar className="h-20 w-20">
            {member.avatar_url ? (
              <AvatarImage src={member.avatar_url} alt={member.name ?? "Member"} />
            ) : null}
            <AvatarFallback className="text-2xl">
              {initials(member.name ?? "Member")}
            </AvatarFallback>
          </Avatar>
          <div className="text-center space-y-1">
            <p className="font-semibold text-lg">{member.name ?? "—"}</p>
            <p className="text-sm text-muted-foreground">{member.email ?? "—"}</p>
          </div>
          <dl className="w-full grid grid-cols-1 gap-3 text-sm">
            <div className="flex justify-between py-2 border-b">
              <dt className="text-muted-foreground">Joined</dt>
              <dd className="font-medium">{joinedDate}</dd>
            </div>
            {member.phone ? (
              <div className="flex justify-between py-2 border-b">
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="font-medium">{member.phone}</dd>
              </div>
            ) : null}
            {member.role ? (
              <div className="flex justify-between py-2 border-b">
                <dt className="text-muted-foreground">Role</dt>
                <dd className="font-medium capitalize">{member.role}</dd>
              </div>
            ) : null}
          </dl>
        </div>
      </DialogContent>
    </Dialog>
  )
}

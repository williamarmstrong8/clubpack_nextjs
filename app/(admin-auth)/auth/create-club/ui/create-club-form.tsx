"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

function toSubdomain(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)
}

export function CreateClubForm() {
  const [clubName, setClubName] = React.useState("")
  const [subdomain, setSubdomain] = React.useState("")
  const [subdomainEdited, setSubdomainEdited] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  function handleNameChange(value: string) {
    setClubName(value)
    if (!subdomainEdited) {
      setSubdomain(toSubdomain(value))
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const trimmedName = clubName.trim()
    const trimmedSubdomain = subdomain.trim().toLowerCase()

    if (!trimmedName) {
      setError("Club name is required.")
      setIsLoading(false)
      return
    }
    if (!trimmedSubdomain || !/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(trimmedSubdomain)) {
      setError("Subdomain must be lowercase letters, numbers, and hyphens only.")
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()

      const { data: user } = await supabase.auth.getUser()
      if (!user.user) {
        setError("You must be signed in. Please sign up first.")
        setIsLoading(false)
        return
      }

      const { data: existing } = await supabase
        .from("clubs")
        .select("id")
        .eq("subdomain", trimmedSubdomain)
        .maybeSingle()

      if (existing) {
        setError("That subdomain is already taken. Try a different one.")
        setIsLoading(false)
        return
      }

      const { data: club, error: clubError } = await supabase
        .from("clubs")
        .insert({ name: trimmedName, subdomain: trimmedSubdomain })
        .select("id")
        .single()

      if (clubError || !club) {
        throw new Error(clubError?.message ?? "Failed to create club.")
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ club_id: club.id })
        .eq("id", user.user.id)

      if (profileError) {
        throw new Error(profileError.message)
      }

      router.push("/home")
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Create your club</CardTitle>
        <CardDescription>
          Give your club a name and choose a URL for your site.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="clubName">Club name</Label>
            <Input
              id="clubName"
              value={clubName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Outdoor Adventure Club"
              autoFocus
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="subdomain">Site URL</Label>
            <div className="flex items-center gap-0">
              <Input
                id="subdomain"
                value={subdomain}
                onChange={(e) => {
                  setSubdomain(toSubdomain(e.target.value))
                  setSubdomainEdited(true)
                }}
                className="rounded-r-none border-r-0"
                required
              />
              <span className="flex h-9 items-center rounded-r-md border border-input bg-muted px-3 text-sm text-muted-foreground whitespace-nowrap">
                .joinclubpack.com
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              This will be your club&apos;s website address.
            </p>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create club"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

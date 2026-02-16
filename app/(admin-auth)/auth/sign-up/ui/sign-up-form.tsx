"use client"

import * as React from "react"
import Link from "next/link"
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

export function SignUpForm() {
  const [firstName, setFirstName] = React.useState("")
  const [lastName, setLastName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const origin = typeof window !== "undefined" ? window.location.origin : ""

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: origin
          ? { emailRedirectTo: `${origin}/auth/confirm?next=/auth/create-club` }
          : undefined,
      })
      if (error) throw error

      if (data.user) {
        type ProfileInsert = {
          id: string
          club_id: string | null
          role: string
          first_name: string
          last_name: string
        }

        const baseProfileData: ProfileInsert = {
          id: data.user.id,
          club_id: null,
          role: "admin",
          first_name: firstName,
          last_name: lastName,
        }

        const fullName = `${firstName} ${lastName}`.trim()
        const withLegacyName: ProfileInsert & { name: string } = {
          ...baseProfileData,
          name: fullName,
        }

        let profileError: unknown = null
        {
          const { error } = await supabase.from("profiles").insert(withLegacyName)
          profileError = error ?? null
        }

        const profileErrorMessage =
          profileError &&
          typeof (profileError as { message?: unknown }).message === "string"
            ? String((profileError as { message?: unknown }).message)
            : ""

        if (
          profileErrorMessage.toLowerCase().includes("column") &&
          profileErrorMessage.toLowerCase().includes("name")
        ) {
          const { error } = await supabase.from("profiles").insert(baseProfileData)
          profileError = error ?? null
        }
      }

      router.push("/auth/create-club")
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign up failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Create admin account</CardTitle>
        <CardDescription>Start managing your club in minutes.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="family-name"
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create account"}
          </Button>

          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";

export function OnboardingForm({ site, user }: { site: string; user: User }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const supabase = createClient();

    try {
      // Insert member profile into database
      const { error: insertError } = await supabase.from("members").insert({
        user_id: user.id,
        email: user.email,
        first_name: formData.get("firstName") as string,
        last_name: formData.get("lastName") as string,
        phone: formData.get("phone") as string,
        bio: formData.get("bio") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
      });

      if (insertError) {
        throw insertError;
      }

      // Redirect to club home page after successful onboarding
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete your profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name *</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="William"
                required
                disabled={loading}
                defaultValue={user.user_metadata?.first_name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name *</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Armstrong"
                required
                disabled={loading}
                defaultValue={user.user_metadata?.last_name}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="(555) 123-4567"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Optional. We'll only use this for important club updates.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                placeholder="Austin"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                placeholder="TX"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">About you</Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Tell us a bit about yourself... What brings you to this club?"
              rows={4}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Optional. Share your running experience, goals, or interests.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/")}
              disabled={loading}
            >
              Skip for now
            </Button>
            <Button type="submit" disabled={loading} className="sm:px-8">
              {loading ? "Saving..." : "Complete profile"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

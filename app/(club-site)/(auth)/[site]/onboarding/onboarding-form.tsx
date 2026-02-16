"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function OnboardingForm({
  site,
  clubId,
  user,
}: {
  site: string;
  clubId: string | null;
  user: User;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const supabase = createClient();

    try {
      let photoUrl: string | null = null;

      if (avatarFile && clubId) {
        const ext = avatarFile.name.split(".").pop()?.toLowerCase() || "jpg";
        const fileName = `${user.id}-avatar-${Date.now()}.${ext}`;
        const filePath = `${clubId}/photos/${fileName}`;
        const { error: uploadError } = await supabase.storage
          .from("waiver-submissions")
          .upload(filePath, avatarFile, {
            upsert: true,
            contentType: avatarFile.type,
          });
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage
          .from("waiver-submissions")
          .getPublicUrl(filePath);
        photoUrl = publicUrl ?? null;
      }

      if (!clubId) {
        throw new Error("Club not found. Please try again from the club signup link.");
      }

      const firstName = (formData.get("firstName") as string)?.trim() ?? "";
      const lastName = (formData.get("lastName") as string)?.trim() ?? "";
      const name = [firstName, lastName].filter(Boolean).join(" ") || null;
      const phone = (formData.get("phone") as string)?.trim() || null;

      const payload = {
        name,
        email: user.email ?? null,
        phone,
        avatar_url: photoUrl ?? null,
      };

      const { data: existing } = await supabase
        .from("memberships")
        .select("id")
        .eq("club_id", clubId)
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (existing?.id) {
        const { error: updateError } = await supabase
          .from("memberships")
          .update(payload)
          .eq("id", existing.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from("memberships").insert({
          club_id: clubId,
          auth_user_id: user.id,
          ...payload,
        });
        if (insertError) throw insertError;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (avatarPreview?.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
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

          <div className="flex flex-col items-center gap-4">
            <Label className="text-sm font-medium">Profile photo</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="rounded-full ring-2 ring-muted-foreground/20 transition hover:ring-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <Avatar className="size-24">
                <AvatarImage src={avatarPreview ?? undefined} alt="Avatar" />
                <AvatarFallback className="text-2xl">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
            </button>
            <p className="text-xs text-muted-foreground">
              Click to upload a photo. Optional.
            </p>
          </div>

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
              Optional. We&apos;ll only use this for important club updates.
            </p>
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto sm:px-8">
              {loading ? "Saving..." : "Complete profile"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

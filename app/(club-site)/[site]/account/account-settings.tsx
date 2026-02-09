"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { Upload, FileText, Check } from "lucide-react";
import { signout } from "../../(auth)/[site]/actions/auth";

type Member = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  bio: string | null;
  city: string | null;
  state: string | null;
  waiver_url: string | null;
  waiver_signed_at: string | null;
} | null;

export function AccountSettings({
  site,
  user,
  member,
}: {
  site: string;
  user: User;
  member: Member;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [waiverFile, setWaiverFile] = useState<File | null>(null);
  const [uploadingWaiver, setUploadingWaiver] = useState(false);

  async function handleProfileUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const supabase = createClient();

    try {
      const updates = {
        first_name: formData.get("firstName") as string,
        last_name: formData.get("lastName") as string,
        phone: formData.get("phone") as string,
        bio: formData.get("bio") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
      };

      if (member) {
        // Update existing member
        const { error: updateError } = await supabase
          .from("members")
          .update(updates)
          .eq("user_id", user.id);

        if (updateError) throw updateError;
      } else {
        // Create new member profile
        const { error: insertError } = await supabase.from("members").insert({
          user_id: user.id,
          email: user.email,
          ...updates,
        });

        if (insertError) throw insertError;
      }

      setSuccess("Profile updated successfully!");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleWaiverUpload() {
    if (!waiverFile) return;

    setError(null);
    setSuccess(null);
    setUploadingWaiver(true);

    const supabase = createClient();

    try {
      // Upload file to Supabase Storage
      const fileExt = waiverFile.name.split(".").pop();
      const fileName = `${user.id}-waiver-${Date.now()}.${fileExt}`;
      const filePath = `waivers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("club-documents")
        .upload(filePath, waiverFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("club-documents").getPublicUrl(filePath);

      // Update member record with waiver URL
      const { error: updateError } = await supabase
        .from("members")
        .update({
          waiver_url: publicUrl,
          waiver_signed_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      setSuccess("Waiver uploaded successfully!");
      setWaiverFile(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload waiver");
    } finally {
      setUploadingWaiver(false);
    }
  }

  async function handleSignOut() {
    await signout();
  }

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal information and bio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
                {success}
              </div>
            )}

            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user.email} disabled />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="William"
                  defaultValue={member?.first_name ?? ""}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Armstrong"
                  defaultValue={member?.last_name ?? ""}
                  disabled={loading}
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
                defaultValue={member?.phone ?? ""}
                disabled={loading}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="Austin"
                  defaultValue={member?.city ?? ""}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  placeholder="TX"
                  defaultValue={member?.state ?? ""}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Tell us about yourself..."
                rows={4}
                defaultValue={member?.bio ?? ""}
                disabled={loading}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Waiver Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Waiver</CardTitle>
          <CardDescription>
            Upload your signed club waiver. Most clubs require a waiver before
            participating in events.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {member?.waiver_url ? (
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-green-100">
                  <Check className="size-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Waiver uploaded</div>
                  <div className="text-sm text-muted-foreground">
                    Signed on{" "}
                    {member.waiver_signed_at
                      ? new Date(member.waiver_signed_at).toLocaleDateString()
                      : "Unknown date"}
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={member.waiver_url} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-6 text-center">
              <FileText className="mx-auto size-10 text-muted-foreground" />
              <div className="mt-4 text-sm font-medium">No waiver uploaded</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Upload a signed waiver to participate in club events
              </div>
            </div>
          )}

          <Separator />

          <div className="space-y-3">
            <Label htmlFor="waiver-file">
              {member?.waiver_url ? "Upload a new waiver" : "Upload waiver"}
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="waiver-file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setWaiverFile(e.target.files?.[0] || null)}
                disabled={uploadingWaiver}
                className="flex-1"
              />
              <Button
                onClick={handleWaiverUpload}
                disabled={!waiverFile || uploadingWaiver}
                size="sm"
              >
                <Upload className="mr-2 size-4" />
                {uploadingWaiver ? "Uploading..." : "Upload"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Accepted formats: PDF, JPG, PNG (max 10MB)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleSignOut}>
            Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, FileText, Check } from "lucide-react";
import { signout } from "../../(auth)/[site]/actions/auth";

type Membership = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  waiver_url?: string | null;
  waiver_signed_at?: string | null;
} | null;

function nameToFirstLast(name: string | null): [string, string] {
  if (!name?.trim()) return ["", ""];
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return [parts[0] ?? "", ""];
  return [parts[0] ?? "", parts.slice(1).join(" ")];
}

export function AccountSettings({
  site,
  clubId,
  user,
  membership,
  waiversEnabled = false,
  requirePhoto = false,
}: {
  site: string;
  clubId: string | null;
  user: User;
  membership: Membership;
  waiversEnabled?: boolean;
  requirePhoto?: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [waiverFile, setWaiverFile] = useState<File | null>(null);
  const [firstName, setFirstName] = useState(() => nameToFirstLast(membership?.name ?? null)[0]);
  const [lastName, setLastName] = useState(() => nameToFirstLast(membership?.name ?? null)[1]);
  const [phone, setPhone] = useState(membership?.phone ?? "");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploadingSubmission, setUploadingSubmission] = useState(false);

  useEffect(() => {
    const [first, last] = nameToFirstLast(membership?.name ?? null);
    setFirstName(first);
    setLastName(last);
    setPhone(membership?.phone ?? "");
  }, [membership?.name, membership?.phone]);

  const canSubmit = useMemo(() => {
    return !requirePhoto || !!membership?.avatar_url;
  }, [requirePhoto, membership?.avatar_url]);

  async function handleProfileUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const supabase = createClient();
    const first = (formData.get("firstName") as string)?.trim() ?? "";
    const last = (formData.get("lastName") as string)?.trim() ?? "";
    const name = [first, last].filter(Boolean).join(" ") || null;
    const phoneValue = (formData.get("phone") as string)?.trim() || null;

    try {
      if (requirePhoto && !membership?.avatar_url) {
        throw new Error("Profile photo is required.");
      }

      if (membership?.id) {
        const { error: updateError } = await supabase
          .from("memberships")
          .update({ name, phone: phoneValue })
          .eq("id", membership.id);
        if (updateError) throw updateError;
      } else if (clubId) {
        const { error: insertError } = await supabase.from("memberships").insert({
          club_id: clubId,
          auth_user_id: user.id,
          name,
          email: user.email ?? null,
          phone: phoneValue,
        });
        if (insertError) throw insertError;
      } else {
        throw new Error("Club not found.");
      }

      setSuccess("Profile updated successfully!");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmissionUpload() {
    setError(null);
    setSuccess(null);
    setUploadingSubmission(true);

    const supabase = createClient();

    try {
      if (!clubId) throw new Error("Missing club context.");
      if (!photoFile && !waiverFile) return;

      let photoUrl: string | null = null;
      let waiverUrl: string | null = null;
      let waiverSignedAt: string | null = null;

      if (photoFile) {
        const fileExt = photoFile.name.split(".").pop()?.toLowerCase() || "jpg";
        const fileName = `${user.id}-photo-${Date.now()}.${fileExt}`;
        const filePath = `${clubId}/photos/${fileName}`;
        const { error: uploadError } = await supabase.storage
          .from("waiver-submissions")
          .upload(filePath, photoFile, {
            upsert: true,
            contentType: photoFile.type,
          });
        if (uploadError) throw uploadError;
        const {
          data: { publicUrl },
        } = supabase.storage.from("waiver-submissions").getPublicUrl(filePath);
        photoUrl = publicUrl ?? null;
      }

      if (waiverFile) {
        const fileExt = waiverFile.name.split(".").pop()?.toLowerCase() || "pdf";
        const fileName = `${user.id}-waiver-${Date.now()}.${fileExt}`;
        const filePath = `${clubId}/waivers/${fileName}`;
        const { error: uploadError } = await supabase.storage
          .from("waiver-submissions")
          .upload(filePath, waiverFile, {
            upsert: true,
            contentType: waiverFile.type,
          });
        if (uploadError) throw uploadError;
        const {
          data: { publicUrl },
        } = supabase.storage.from("waiver-submissions").getPublicUrl(filePath);
        waiverUrl = publicUrl ?? null;
        waiverSignedAt = new Date().toISOString();
      }

      const updates: Record<string, unknown> = {};
      if (photoUrl) updates.avatar_url = photoUrl;
      if (waiverUrl) updates.waiver_url = waiverUrl;
      if (waiverSignedAt) updates.waiver_signed_at = waiverSignedAt;

      if (Object.keys(updates).length > 0 && membership?.id) {
        const { error: updateError } = await supabase
          .from("memberships")
          .update(updates)
          .eq("id", membership.id);
        if (updateError) throw updateError;
      } else if (Object.keys(updates).length > 0 && clubId) {
        const { error: insertError } = await supabase.from("memberships").insert({
          club_id: clubId,
          auth_user_id: user.id,
          name: [firstName, lastName].filter(Boolean).join(" ") || null,
          email: user.email ?? null,
          phone: phone.trim() || null,
          ...updates,
        });
        if (insertError) throw insertError;
      }

      const msg = [photoUrl && "Photo", waiverUrl && "Waiver"].filter(Boolean).join(" and ");
      setSuccess(msg ? `${msg} uploaded successfully!` : "Nothing to upload.");
      setPhotoFile(null);
      setWaiverFile(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingSubmission(false);
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
            Update your name and contact details for this club.
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

            <div className="space-y-3">
              <Label className="text-sm font-medium">Profile photo</Label>
              <div className="flex flex-wrap items-center gap-4">
                <Avatar className="size-16">
                  <AvatarImage src={membership?.avatar_url ?? undefined} alt="" />
                  <AvatarFallback className="text-lg">
                    {[firstName, lastName].filter(Boolean).map((s) => s[0]).join("").toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <input
                    id="profile-photo-file"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    className="hidden"
                    onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                    disabled={uploadingSubmission}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploadingSubmission}
                    onClick={() => {
                      if (photoFile) handleSubmissionUpload();
                      else document.getElementById("profile-photo-file")?.click();
                    }}
                  >
                    <Upload className="mr-2 size-4" />
                    {photoFile ? "Upload photo" : "Choose photo"}
                  </Button>
                  {photoFile && (
                    <p className="text-xs text-muted-foreground">
                      {photoFile.name} — click &quot;Upload photo&quot; to save.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user.email ?? ""} disabled />
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
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading || !canSubmit}>
                {loading ? "Saving..." : "Save changes"}
              </Button>
            </div>
            {!canSubmit && (requirePhoto || waiversEnabled) && (
              <p className="text-xs text-muted-foreground">
                Complete all required fields and uploads (marked with *) to save.
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Waiver document upload - separate from profile photo */}
      {waiversEnabled && (
        <Card>
          <CardHeader>
            <CardTitle>Waiver submission</CardTitle>
            <CardDescription>
              Upload your signed waiver to RSVP and participate in events.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {waiversEnabled && (
              <div className="space-y-3">
                <div className="text-sm font-medium">Signed waiver *</div>
                {membership?.waiver_url ? (
                  <div className="rounded-lg border bg-muted/50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-green-100">
                        <Check className="size-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Waiver uploaded</div>
                        <div className="text-sm text-muted-foreground">
                          Signed on{" "}
                          {membership.waiver_signed_at
                            ? new Date(membership.waiver_signed_at).toLocaleDateString()
                            : "Unknown date"}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={membership.waiver_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </a>
                      </Button>
                    </div>
                  </div>
                ) : null}

                <input
                  id="waiver-file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => setWaiverFile(e.target.files?.[0] || null)}
                  disabled={uploadingSubmission}
                />
                <button
                  type="button"
                  className="border-muted-foreground/25 hover:border-muted-foreground/40 bg-muted/20 hover:bg-muted/30 flex w-full items-center justify-between gap-3 rounded-lg border-2 border-dashed p-4 text-left transition-colors"
                  onClick={() => document.getElementById("waiver-file")?.click()}
                  disabled={uploadingSubmission}
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    const f = e.dataTransfer.files?.[0]
                    if (f) setWaiverFile(f)
                  }}
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium">
                      {waiverFile ? "Ready to upload" : "Drag & drop your waiver"}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {waiverFile
                        ? waiverFile.name
                        : membership?.waiver_url
                          ? "Replace your waiver"
                          : "PDF, JPG, or PNG"}
                    </div>
                  </div>
                  <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
                </button>
              </div>
            )}

            {/* Single upload button (especially when both are enabled) */}
            {waiversEnabled && (
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmissionUpload}
                  disabled={
                    uploadingSubmission ||
                    ((waiversEnabled && !membership?.waiver_url) && !waiverFile) ||
                    !waiverFile
                  }
                >
                  <Upload className="mr-2 size-4" />
                  {uploadingSubmission ? "Uploading..." : "Upload waiver"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

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

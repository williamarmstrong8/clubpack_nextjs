"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { Upload, FileText, Check, User as UserIcon } from "lucide-react";
import { signout } from "../../(auth)/[site]/actions/auth";

type Member = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  bio: string | null;
  city: string | null;
  state: string | null;
  photo_url: string | null;
  waiver_url: string | null;
  waiver_signed_at: string | null;
} | null;

export function AccountSettings({
  site,
  clubId,
  user,
  member,
  waiversEnabled = false,
  requirePhoto = false,
}: {
  site: string;
  clubId: string | null;
  user: User;
  member: Member;
  waiversEnabled?: boolean;
  requirePhoto?: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [waiverFile, setWaiverFile] = useState<File | null>(null);
  const [firstName, setFirstName] = useState(member?.first_name ?? "");
  const [lastName, setLastName] = useState(member?.last_name ?? "");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploadingSubmission, setUploadingSubmission] = useState(false);

  useEffect(() => {
    setFirstName(member?.first_name ?? "");
    setLastName(member?.last_name ?? "");
  }, [member?.first_name, member?.last_name]);

  const canSubmit = useMemo(() => {
    const photoOk = !requirePhoto || !!member?.photo_url;
    const waiverOk = !waiversEnabled || !!member?.waiver_url;
    return photoOk && waiverOk;
  }, [requirePhoto, waiversEnabled, member?.photo_url, member?.waiver_url]);

  async function handleProfileUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const supabase = createClient();
    const first = (formData.get("firstName") as string)?.trim() ?? "";
    const last = (formData.get("lastName") as string)?.trim() ?? "";

    try {
      if (requirePhoto && !member?.photo_url) {
        throw new Error("Profile photo is required.");
      }
      if (waiversEnabled && !member?.waiver_url) {
        throw new Error("Waiver upload is required.");
      }

      const updates = {
        first_name: first,
        last_name: last,
        phone: (formData.get("phone") as string) ?? "",
        bio: (formData.get("bio") as string) ?? "",
        city: (formData.get("city") as string) ?? "",
        state: (formData.get("state") as string) ?? "",
      };

      if (member) {
        const { error: updateError } = await supabase
          .from("members")
          .update(updates)
          .eq("user_id", user.id);

        if (updateError) throw updateError;
      } else {
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

  async function handleSubmissionUpload() {
    setError(null);
    setSuccess(null);
    setUploadingSubmission(true);

    const supabase = createClient();

    try {
      if (!clubId) throw new Error("Missing club context.");

      const needsPhoto = requirePhoto && !member?.photo_url;
      const needsWaiver = waiversEnabled && !member?.waiver_url;

      // If required and missing, we must have a file selected for that item.
      if (needsPhoto && !photoFile) throw new Error("Please add a profile photo to upload.");
      if (needsWaiver && !waiverFile) throw new Error("Please add a waiver file to upload.");

      // Upload any newly-selected files (also used for replacements).
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
        const fileExt = waiverFile.name.split(".").pop() || "pdf";
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

      // After uploading, ensure required items are satisfied.
      const finalPhotoOk = !requirePhoto || !!(member?.photo_url || photoUrl);
      const finalWaiverOk = !waiversEnabled || !!(member?.waiver_url || waiverUrl);
      if (!finalPhotoOk || !finalWaiverOk) {
        throw new Error("Please upload all required items before continuing.");
      }

      const updatePayload: Record<string, unknown> = {};
      if (photoUrl) updatePayload.photo_url = photoUrl;
      if (waiverUrl) updatePayload.waiver_url = waiverUrl;
      if (waiverSignedAt) updatePayload.waiver_signed_at = waiverSignedAt;

      if (Object.keys(updatePayload).length > 0) {
        if (member) {
          const { error: updateError } = await supabase
            .from("members")
            .update(updatePayload)
            .eq("user_id", user.id);
          if (updateError) throw updateError;
        } else {
          const { error: insertError } = await supabase.from("members").insert({
            user_id: user.id,
            email: user.email,
            first_name: firstName.trim() || null,
            last_name: lastName.trim() || null,
            ...updatePayload,
          });
          if (insertError) throw insertError;
        }
      }

      setSuccess(
        requirePhoto && waiversEnabled
          ? "Photo and waiver uploaded successfully!"
          : requirePhoto
            ? "Photo uploaded successfully!"
            : "Waiver uploaded successfully!",
      );
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
                  placeholder="William"
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
                  placeholder="Armstrong"
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

      {/* Waiver/photo uploads - conditional on waiver settings */}
      {(requirePhoto || waiversEnabled) && (
        <Card>
          <CardHeader>
            <CardTitle>Waiver submission</CardTitle>
            <CardDescription>
              Upload any required items to RSVP and participate in events.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {requirePhoto && (
              <div className="space-y-3">
                <div className="text-sm font-medium">Profile photo *</div>
                {member?.photo_url ? (
                  <div className="rounded-lg border bg-muted/50 p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.photo_url}
                        alt="Profile"
                        className="size-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="font-medium">Photo uploaded</div>
                      </div>
                    </div>
                  </div>
                ) : null}

                <input
                  id="photo-file"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                  disabled={uploadingSubmission}
                />
                <button
                  type="button"
                  className="border-muted-foreground/25 hover:border-muted-foreground/40 bg-muted/20 hover:bg-muted/30 flex w-full items-center justify-between gap-3 rounded-lg border-2 border-dashed p-4 text-left transition-colors"
                  onClick={() => document.getElementById("photo-file")?.click()}
                  disabled={uploadingSubmission}
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    const f = e.dataTransfer.files?.[0]
                    if (f) setPhotoFile(f)
                  }}
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium">
                      {photoFile ? "Ready to upload" : "Drag & drop a photo"}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {photoFile
                        ? photoFile.name
                        : member?.photo_url
                          ? "Replace your photo"
                          : "JPG, PNG, or WebP"}
                    </div>
                  </div>
                  <UserIcon className="h-5 w-5 shrink-0 text-muted-foreground" />
                </button>
              </div>
            )}

            {requirePhoto && waiversEnabled ? <Separator /> : null}

            {waiversEnabled && (
              <div className="space-y-3">
                <div className="text-sm font-medium">Signed waiver *</div>
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
                        <a
                          href={member.waiver_url}
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
                        : member?.waiver_url
                          ? "Replace your waiver"
                          : "PDF, JPG, or PNG"}
                    </div>
                  </div>
                  <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
                </button>
              </div>
            )}

            {/* Single upload button (especially when both are enabled) */}
            <div className="flex justify-end">
              <Button
                onClick={handleSubmissionUpload}
                disabled={
                  uploadingSubmission ||
                  ((requirePhoto && !member?.photo_url) && !photoFile) ||
                  ((waiversEnabled && !member?.waiver_url) && !waiverFile) ||
                  (!photoFile && !waiverFile)
                }
              >
                <Upload className="mr-2 size-4" />
                {uploadingSubmission ? "Uploading..." : "Upload"}
              </Button>
            </div>
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

"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, FileText, Check, Download, Camera, X } from "lucide-react";
import { signout } from "../../(auth)/[site]/actions/auth";
import { uploadMemberAvatar, uploadWaiverSubmission } from "./actions";

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

const WAIVER_MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const PHOTO_MAX_BYTES = 5 * 1024 * 1024;  // 5 MB
function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AccountSettings({
  site,
  clubId,
  user,
  membership,
  waiversEnabled = false,
  requirePhoto = false,
  waiverTemplateUrl = null,
  effectiveWaiverUrl = null,
  effectiveWaiverSignedAt = null,
}: {
  site: string;
  clubId: string | null;
  user: User;
  membership: Membership;
  waiversEnabled?: boolean;
  requirePhoto?: boolean;
  waiverTemplateUrl?: string | null;
  /** Waiver on file from either memberships or waiver_submissions (so legacy submissions count) */
  effectiveWaiverUrl?: string | null;
  effectiveWaiverSignedAt?: string | null;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [waiverFile, setWaiverFile] = useState<File | null>(null);
  const [waiverPhotoFile, setWaiverPhotoFile] = useState<File | null>(null);
  const [waiverSizeError, setWaiverSizeError] = useState<string | null>(null);
  const [photoSizeError, setPhotoSizeError] = useState<string | null>(null);
  const [waiverError, setWaiverError] = useState<string | null>(null);
  const [waiverSuccess, setWaiverSuccess] = useState<string | null>(null);
  const [replacingWaiver, setReplacingWaiver] = useState(false);
  const [firstName, setFirstName] = useState(() => nameToFirstLast(membership?.name ?? null)[0]);
  const [lastName, setLastName] = useState(() => nameToFirstLast(membership?.name ?? null)[1]);
  const [phone, setPhone] = useState(membership?.phone ?? "");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [uploadingSubmission, setUploadingSubmission] = useState(false);

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(photoFile);
    setPhotoPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

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
      if (requirePhoto && !membership?.avatar_url && !photoFile) {
        throw new Error("Profile photo is required.");
      }

      // Upload avatar first if a new photo was selected
      if (photoFile && clubId) {
        const fd = new FormData();
        fd.set("clubId", clubId);
        if (membership?.id) fd.set("membershipId", membership.id);
        if (membership?.avatar_url) fd.set("oldAvatarUrl", membership.avatar_url);
        fd.set("file", photoFile);
        const avatarResult = await uploadMemberAvatar(fd);
        if (!avatarResult.ok) throw new Error(avatarResult.error);
        setPhotoFile(null);
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

  async function handleAvatarUpload() {
    if (!photoFile || !clubId) return;
    setAvatarError(null);
    setUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.set("clubId", clubId);
      if (membership?.id) fd.set("membershipId", membership.id);
      if (membership?.avatar_url) fd.set("oldAvatarUrl", membership.avatar_url);
      fd.set("file", photoFile);

      const result = await uploadMemberAvatar(fd);
      if (result.ok) {
        setPhotoFile(null);
        router.refresh();
      } else {
        setAvatarError(result.error);
      }
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploadingAvatar(false);
    }
  }

  function friendlyUploadError(raw: string): string {
    const lower = raw.toLowerCase();
    if (lower.includes("body exceeded") || lower.includes("size limit") || lower.includes("413")) {
      return "Your file is too large to submit. Keep the waiver under 10 MB and the photo under 5 MB, then try again.";
    }
    if (lower.includes("unexpected response") || lower.includes("unexpected response was received")) {
      return "The upload was too large or the server couldn’t process it. Use a waiver under 10 MB and a photo under 5 MB, then try again.";
    }
    return raw;
  }

  async function handleSubmissionUpload() {
    setWaiverError(null);
    setWaiverSuccess(null);
    setUploadingSubmission(true);

    try {
      if (!clubId) throw new Error("Missing club context.");
      if (!waiverFile && !waiverPhotoFile) return;

      const formData = new FormData();
      formData.set("clubId", clubId);
      if (membership?.id) formData.set("membershipId", membership.id);
      formData.set("firstName", firstName);
      formData.set("lastName", lastName);
      formData.set("phone", phone);
      if (waiverPhotoFile) formData.set("photo", waiverPhotoFile);
      if (waiverFile) formData.set("waiver", waiverFile);

      const result = await uploadWaiverSubmission(formData);

      if (result.ok) {
        setWaiverSuccess(result.message);
        setWaiverError(null);
        setPhotoFile(null);
        setWaiverFile(null);
        setWaiverPhotoFile(null);
        setWaiverSizeError(null);
        setPhotoSizeError(null);
        setReplacingWaiver(false);
        router.refresh();
      } else {
        setWaiverError(friendlyUploadError(result.error));
      }
    } catch (err) {
      const raw = err instanceof Error ? err.message : "Upload failed";
      setWaiverError(friendlyUploadError(raw));
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
                  <AvatarImage
                    src={photoPreviewUrl ?? membership?.avatar_url ?? undefined}
                    alt=""
                  />
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
                    onChange={(e) => {
                      setPhotoFile(e.target.files?.[0] ?? null);
                      setAvatarError(null);
                    }}
                    disabled={uploadingAvatar}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploadingAvatar}
                    onClick={() => {
                      if (photoFile) handleAvatarUpload();
                      else document.getElementById("profile-photo-file")?.click();
                    }}
                  >
                    <Upload className="mr-2 size-4" />
                    {uploadingAvatar ? "Uploading…" : photoFile ? "Save photo" : "Choose photo"}
                  </Button>
                  {photoFile && !uploadingAvatar && (
                    <p className="text-xs text-muted-foreground">
                      {photoFile.name} — click &quot;Save photo&quot; to save.
                    </p>
                  )}
                  {avatarError && (
                    <p className="text-xs text-destructive">{avatarError}</p>
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

      {/* Waiver document upload */}
      {waiversEnabled && (
        <Card>
          <CardHeader>
            <CardTitle>Waiver submission</CardTitle>
            <CardDescription>
              {effectiveWaiverUrl
                ? "Your waiver is on file. You can replace it below if needed."
                : "Download the waiver template, fill it out, then upload your signed waiver to RSVP and participate in events."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {waiverError && (
              <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <X className="mt-0.5 size-5 shrink-0 text-destructive" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-destructive">Upload failed</p>
                  <p className="text-sm text-destructive/90">{waiverError}</p>
                </div>
              </div>
            )}
            {waiverSuccess && (
              <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <Check className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                <p className="text-sm text-emerald-800">{waiverSuccess}</p>
              </div>
            )}
            {/* Download template */}
            {waiverTemplateUrl && (
              <div className="flex flex-wrap items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="size-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground">Waiver template</p>
                  <p className="text-xs text-muted-foreground">Download, fill out, sign, then upload below.</p>
                </div>
                <Button variant="default" size="sm" asChild>
                  <a href={waiverTemplateUrl} target="_blank" rel="noopener noreferrer" download>
                    <Download className="mr-2 size-4" />
                    Download
                  </a>
                </Button>
              </div>
            )}

            {/* ── Confirmed state: waiver on file ── */}
            {effectiveWaiverUrl && !replacingWaiver ? (
              <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50/80 p-5">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <Check className="size-7 text-emerald-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-emerald-900">Waiver on file</p>
                    <p className="text-sm text-emerald-800/90">
                      Completed{" "}
                      {effectiveWaiverSignedAt
                        ? new Date(effectiveWaiverSignedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
                        : "—"}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-100" asChild>
                      <a href={effectiveWaiverUrl} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-100"
                      onClick={() => setReplacingWaiver(true)}
                    >
                      Replace
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              /* ── Upload state: no waiver on file OR replacing ── */
              <div className="space-y-4">
                {replacingWaiver && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Upload new waiver</p>
                    <Button variant="ghost" size="sm" onClick={() => { setReplacingWaiver(false); setWaiverFile(null); setWaiverPhotoFile(null); setWaiverSizeError(null); setPhotoSizeError(null); }}>
                      Cancel
                    </Button>
                  </div>
                )}

                {/* Waiver + Photo: side-by-side when both required, full width when waiver only */}
                <div className={requirePhoto ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "space-y-4"}>
                {/* Waiver PDF/image upload */}
                <div className="space-y-2 min-w-0">
                  <Label className="text-sm font-medium">Signed waiver {!effectiveWaiverUrl && "*"}</Label>
                  <input
                    id="waiver-file"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) { setWaiverFile(null); setWaiverSizeError(null); return; }
                      if (f.size > WAIVER_MAX_BYTES) {
                        setWaiverFile(null);
                        setWaiverSizeError(`File is ${formatSize(f.size)}. Maximum size is ${formatSize(WAIVER_MAX_BYTES)}.`);
                        e.target.value = "";
                        return;
                      }
                      setWaiverSizeError(null);
                      setWaiverFile(f);
                    }}
                    disabled={uploadingSubmission}
                  />
                  {waiverFile ? (
                    <div className="flex items-center gap-3 rounded-lg border-2 border-emerald-200 bg-emerald-50/80 p-3">
                      <FileText className="size-5 shrink-0 text-emerald-600" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-emerald-900">{waiverFile.name}</p>
                        <p className="text-xs text-emerald-700">{formatSize(waiverFile.size)}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="size-8 shrink-0 p-0 text-emerald-700 hover:bg-emerald-100" onClick={() => setWaiverFile(null)} aria-label="Remove file">
                        <X className="size-4" />
                      </Button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="border-muted-foreground/25 hover:border-primary/30 flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed bg-muted/20 px-4 py-6 text-center transition-colors hover:bg-muted/30 hover:border-primary/40"
                      onClick={() => document.getElementById("waiver-file")?.click()}
                      disabled={uploadingSubmission}
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const f = e.dataTransfer.files?.[0];
                        if (!f) return;
                        if (f.size > WAIVER_MAX_BYTES) {
                          setWaiverSizeError(`File is ${formatSize(f.size)}. Maximum size is ${formatSize(WAIVER_MAX_BYTES)}.`);
                          return;
                        }
                        setWaiverSizeError(null);
                        setWaiverFile(f);
                      }}
                    >
                      <FileText className="size-8 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Drop your signed waiver here or click to browse</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">PDF, JPG, or PNG · max {formatSize(WAIVER_MAX_BYTES)}</p>
                      </div>
                    </button>
                  )}
                  {waiverSizeError && (
                    <p className="flex items-center gap-1.5 text-sm text-destructive" role="alert">
                      <X className="size-4 shrink-0" />
                      {waiverSizeError}
                    </p>
                  )}
                </div>

                {/* Photo upload (when require_photo is on) */}
                {requirePhoto && (
                  <div className="space-y-2 min-w-0">
                    <Label className="text-sm font-medium">Photo *</Label>
                    <input
                      id="waiver-photo-file"
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) { setWaiverPhotoFile(null); setPhotoSizeError(null); return; }
                        if (f.size > PHOTO_MAX_BYTES) {
                          setWaiverPhotoFile(null);
                          setPhotoSizeError(`Image is ${formatSize(f.size)}. Maximum size is ${formatSize(PHOTO_MAX_BYTES)}.`);
                          e.target.value = "";
                          return;
                        }
                        setPhotoSizeError(null);
                        setWaiverPhotoFile(f);
                      }}
                      disabled={uploadingSubmission}
                    />
                    {waiverPhotoFile ? (
                      <div className="flex items-center gap-3 rounded-lg border-2 border-emerald-200 bg-emerald-50/80 p-3">
                        <Camera className="size-5 shrink-0 text-emerald-600" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-emerald-900">{waiverPhotoFile.name}</p>
                          <p className="text-xs text-emerald-700">{formatSize(waiverPhotoFile.size)}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="size-8 shrink-0 p-0 text-emerald-700 hover:bg-emerald-100" onClick={() => setWaiverPhotoFile(null)} aria-label="Remove photo">
                          <X className="size-4" />
                        </Button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="border-muted-foreground/25 hover:border-primary/30 flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed bg-muted/20 px-4 py-6 text-center transition-colors hover:bg-muted/30 hover:border-primary/40"
                        onClick={() => document.getElementById("waiver-photo-file")?.click()}
                        disabled={uploadingSubmission}
                      >
                        <Camera className="size-8 shrink-0 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Upload a photo of yourself</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">JPG, PNG, or WebP · max {formatSize(PHOTO_MAX_BYTES)}</p>
                        </div>
                      </button>
                    )}
                    {photoSizeError && (
                      <p className="flex items-center gap-1.5 text-sm text-destructive" role="alert">
                        <X className="size-4 shrink-0" />
                        {photoSizeError}
                      </p>
                    )}
                  </div>
                )}
                </div>

                {/* Submit button */}
                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  {(waiverSizeError || photoSizeError) && (
                    <p className="text-sm text-destructive">Fix file size errors above to continue.</p>
                  )}
                  <Button
                    onClick={handleSubmissionUpload}
                    disabled={
                      uploadingSubmission ||
                      !waiverFile ||
                      (requirePhoto && !waiverPhotoFile && !membership?.avatar_url) ||
                      !!waiverSizeError ||
                      !!photoSizeError
                    }
                  >
                    <Upload className="mr-2 size-4" />
                    {uploadingSubmission ? "Uploading…" : "Submit"}
                  </Button>
                </div>
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

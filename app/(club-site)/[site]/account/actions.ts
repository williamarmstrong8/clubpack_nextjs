"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type UploadWaiverResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

const WAIVER_MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const PHOTO_MAX_BYTES = 5 * 1024 * 1024;   // 5 MB

/**
 * Upload waiver and/or photo to storage and update membership.
 * Runs on the server so auth is from request cookies (avoids client/proxy issues).
 */
export async function uploadWaiverSubmission(
  formData: FormData
): Promise<UploadWaiverResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { ok: false, error: "You must be signed in to upload." };
    }

    const clubId = (formData.get("clubId") as string)?.trim();
    if (!clubId) {
      return { ok: false, error: "Missing club context." };
    }

    const photoFile = formData.get("photo") as File | null;
    const waiverFile = formData.get("waiver") as File | null;
    if (!photoFile?.size && !waiverFile?.size) {
      return { ok: false, error: "Select a photo and/or waiver to upload." };
    }

    if (waiverFile?.size && waiverFile.size > WAIVER_MAX_BYTES) {
      return { ok: false, error: `Waiver file is too large. Maximum size is 10 MB.` };
    }
    if (photoFile?.size && photoFile.size > PHOTO_MAX_BYTES) {
      return { ok: false, error: `Photo is too large. Maximum size is 5 MB.` };
    }

    const membershipId = (formData.get("membershipId") as string)?.trim() || null;
    const firstName = (formData.get("firstName") as string)?.trim() ?? "";
    const lastName = (formData.get("lastName") as string)?.trim() ?? "";
    const phone = (formData.get("phone") as string)?.trim() || null;
    const name = [firstName, lastName].filter(Boolean).join(" ") || null;

    let photoUrl: string | null = null;
    let waiverUrl: string | null = null;
    let waiverSignedAt: string | null = null;

    const bucket = "waiver-submissions";
    const opts = { cacheControl: "3600", upsert: true } as const;

    // Storage keys must not contain spaces or special chars — keep extension, sanitize rest
    const safeFileName = (name: string) => {
      const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")) : "";
      const base = name.includes(".") ? name.slice(0, name.lastIndexOf(".")) : name;
      const safe = base.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "") || "file";
      return safe + ext;
    };

    if (photoFile?.size) {
      const safeName = safeFileName(photoFile.name);
      const filePath = `${clubId}/${user.id}/photos/${Date.now()}_${safeName}`;
      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, photoFile, { ...opts, contentType: photoFile.type });
      if (error) {
        return { ok: false, error: error.message || "Photo upload failed." };
      }
      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      photoUrl = data?.publicUrl ?? null;
    }

    if (waiverFile?.size) {
      const safeName = safeFileName(waiverFile.name);
      const filePath = `${clubId}/${user.id}/waiver/${Date.now()}_${safeName}`;
      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, waiverFile, { ...opts, contentType: waiverFile.type });
      if (error) {
        return { ok: false, error: error.message || "Waiver upload failed." };
      }
      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      waiverUrl = data?.publicUrl ?? null;
      waiverSignedAt = new Date().toISOString();
    }

    const updates: Record<string, unknown> = {};
    if (waiverUrl) updates.waiver_url = waiverUrl;
    if (waiverSignedAt) updates.waiver_signed_at = waiverSignedAt;

    if (Object.keys(updates).length === 0) {
      return { ok: true, message: "Nothing to upload." };
    }

    let resolvedMembershipId = membershipId;
    if (membershipId) {
      const { error } = await supabase
        .from("memberships")
        .update(updates)
        .eq("id", membershipId);
      if (error) return { ok: false, error: error.message };
    } else {
      const { data: inserted, error } = await supabase
        .from("memberships")
        .insert({
          club_id: clubId,
          auth_user_id: user.id,
          name,
          email: user.email ?? null,
          phone,
          ...updates,
        })
        .select("id")
        .single();
      if (error) return { ok: false, error: error.message };
      resolvedMembershipId = (inserted as { id: string })?.id ?? null;
    }

    // Keep waiver_submissions in sync so legacy reads (and admin views) see the submission
    if (resolvedMembershipId && (waiverUrl || photoUrl)) {
      await supabase.from("waiver_submissions").insert({
        club_id: clubId,
        membership_id: resolvedMembershipId,
        submitted_waiver_url: waiverUrl ?? null,
        full_name: name ?? null,
        email: user.email ?? null,
        photo_url: photoUrl ?? null,
      });
      // Ignore insert error (e.g. RLS or duplicate); memberships is source of truth for "has waiver"
    }

    revalidatePath("/account");
    const parts = [photoUrl && "Photo", waiverUrl && "Waiver"].filter(Boolean);
    return { ok: true, message: `${parts.join(" and ")} uploaded successfully!` };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed. Please try again.";
    return { ok: false, error: message };
  }
}

export type AvatarUploadResult =
  | { ok: true; avatarUrl: string }
  | { ok: false; error: string };

/**
 * Upload a new member profile photo, delete the old one from storage,
 * and save the URL to memberships.avatar_url.
 */
export async function uploadMemberAvatar(
  formData: FormData
): Promise<AvatarUploadResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "You must be signed in." };

    const clubId = (formData.get("clubId") as string)?.trim();
    if (!clubId) return { ok: false, error: "Missing club context." };

    const membershipId = (formData.get("membershipId") as string)?.trim() || null;
    const oldAvatarUrl = (formData.get("oldAvatarUrl") as string)?.trim() || null;
    const file = formData.get("file") as File | null;

    if (!file?.size) return { ok: false, error: "No file selected." };
    if (file.size > 5 * 1024 * 1024) return { ok: false, error: "Photo must be under 5 MB." };

    const bucket = "waiver-submissions";
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filePath = `${clubId}/${user.id}/photos/avatar-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { upsert: true, contentType: file.type });
    if (uploadError) return { ok: false, error: uploadError.message };

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);

    // Remove old avatar from storage (non-fatal)
    if (oldAvatarUrl) {
      try {
        const marker = `/object/public/${bucket}/`;
        const idx = oldAvatarUrl.indexOf(marker);
        if (idx !== -1) {
          const oldPath = decodeURIComponent(oldAvatarUrl.slice(idx + marker.length));
          await supabase.storage.from(bucket).remove([oldPath]);
        }
      } catch {
        // continue — deletion failure is non-fatal
      }
    }

    // Persist to memberships
    if (membershipId) {
      const { error } = await supabase
        .from("memberships")
        .update({ avatar_url: publicUrl })
        .eq("id", membershipId);
      if (error) return { ok: false, error: error.message };
    } else {
      const { error } = await supabase.from("memberships").insert({
        club_id: clubId,
        auth_user_id: user.id,
        email: user.email ?? null,
        avatar_url: publicUrl,
      });
      if (error) return { ok: false, error: error.message };
    }

    revalidatePath("/account");
    return { ok: true, avatarUrl: publicUrl };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Photo upload failed. Please try again.";
    return { ok: false, error: message };
  }
}

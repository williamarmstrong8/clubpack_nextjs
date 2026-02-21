"use server";

import { createClient } from "@/lib/supabase/server";

export type RecordTourLeadResult = { ok: true } | { ok: false; error: string };

/**
 * Record a tour lead (name + email) from the welcome step.
 * Call when the user clicks "Begin tour". Only inserts if email is provided.
 */
export async function recordTourLead(
  name: string | null,
  email: string | null
): Promise<RecordTourLeadResult> {
  const trimmedEmail = (email ?? "").trim();
  if (!trimmedEmail) return { ok: true }; // advance tour without recording

  const supabase = await createClient();
  const { error } = await supabase.from("tour_leads").insert({
    name: (name ?? "").trim() || null,
    email: trimmedEmail,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

import { cache } from "react"

import { createClient } from "@/lib/supabase/server"

// Minimal (best-effort) shape of `clubs` row used by the club-site UI.
// We intentionally select `*` in queries so this can evolve without code changes.
export type ClubRow = {
  id: string
  subdomain: string | null
  name?: string | null
  description?: string | null
  location?: string | null
  tagline?: string | null
  hero_image?: string | null
  hero_image_url?: string | null
  hero_headline?: string | null
  hero_subtext?: string | null
  instagram?: string | null
  primary_color?: string | null
  // Allow additional columns without failing type-check.
  [key: string]: unknown
}

export type EventRow = {
  id: string
  club_id: string | null
  title: string | null
  description?: string | null
  event_date: string | null
  event_time: string | null
  location_name?: string | null
  status?: string | null
  [key: string]: unknown
}

/** FAQ row from `faqs` table (same schema as clubpack_code website template). */
export type FaqRow = {
  id: string
  club_id: string | null
  question: string | null
  answer: string | null
  order_index?: number | null
  created_at?: string | null
  [key: string]: unknown
}

/**
 * Fetch the club row for a given subdomain.
 *
 * - Selects `*` from `clubs`
 * - Returns `null` when not found (so callers can `notFound()`)
 * - Cached per-request via React's `cache()` (Next will also memoize fetches)
 */
export const getClubBySubdomain = cache(async (subdomain: string): Promise<ClubRow | null> => {
  const supabase = await createClient()
  const s = (subdomain ?? "").trim()
  if (!s) return null

  // 1) Exact match first (canonical behavior)
  const exact = await supabase.from("clubs").select("*").eq("subdomain", s).maybeSingle()
  if (exact.error) throw new Error(exact.error.message)
  if (exact.data) return exact.data as ClubRow

  // 2) Fallback: tolerate dash/no-dash mismatches (e.g. "happy-mile" vs "happymile")
  const normalized = s.toLowerCase().replace(/-/g, "")
  if (normalized && normalized !== s) {
    const alt = await supabase.from("clubs").select("*").eq("subdomain", normalized).maybeSingle()
    if (alt.error) throw new Error(alt.error.message)
    if (alt.data) return alt.data as ClubRow
  }

  return null
})

export const getUpcomingEventsByClubId = cache(async (clubId: string, limit = 6): Promise<EventRow[]> => {
  const supabase = await createClient()
  const id = (clubId ?? "").trim()
  if (!id) return []

  const todayIso = new Date().toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("club_id", id)
    .gte("event_date", todayIso)
    .order("event_date", { ascending: true })
    .limit(limit)

  if (error) throw new Error(error.message)
  return (data as EventRow[]) ?? []
})

export const getEventById = cache(async (clubId: string, eventId: string): Promise<EventRow | null> => {
  const supabase = await createClient()
  const cId = (clubId ?? "").trim()
  const eId = (eventId ?? "").trim()
  if (!cId || !eId) return null

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("club_id", cId)
    .eq("id", eId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return (data as EventRow | null) ?? null
})

/**
 * Fetch FAQs for a club from the `faqs` table (same as clubpack_code website template).
 * Ordered by order_index ascending.
 */
export const getFaqsByClubId = cache(async (clubId: string): Promise<FaqRow[]> => {
  const supabase = await createClient()
  const id = (clubId ?? "").trim()
  if (!id) return []

  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("club_id", id)
    .order("order_index", { ascending: true })

  if (error) throw new Error(error.message)
  return (data as FaqRow[]) ?? []
})


import { cache } from "react"
import { createClient as createSupabaseJsClient, type SupabaseClient } from "@supabase/supabase-js"

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

let serviceClient: SupabaseClient | null = null
function getServiceClient(): SupabaseClient | null {
  if (serviceClient) return serviceClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SECRET_KEY

  if (!url || !key) return null

  serviceClient = createSupabaseJsClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })

  return serviceClient
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
  const sLower = s.toLowerCase()

  // Guard: avoid treating asset paths / filenames as "subdomains"
  // e.g. "/apple-touch-icon.png" matches `/:site` and passes "apple-touch-icon.png".
  if (!/^[a-z0-9-]+$/.test(sLower)) return null

  const { data, error } = await supabase
    .from("clubs")
    .select("*")
    .ilike("subdomain", sLower)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (data) return (data as ClubRow) ?? null

  // Fallback: if RLS blocks anon reads, allow server-side service role reads (optional).
  const svc = getServiceClient()
  if (!svc) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[ClubSite] No club found for subdomain "${sLower}". If the club exists, check RLS on "clubs" or set SUPABASE_SERVICE_ROLE_KEY for server-side reads.`,
      )
    }
    return null
  }

  const svcRes = await svc.from("clubs").select("*").ilike("subdomain", sLower).maybeSingle()
  if (svcRes.error) throw new Error(svcRes.error.message)
  return (svcRes.data as ClubRow | null) ?? null
})

export const getUpcomingEventsByClubId = cache(async (clubId: string, limit = 6): Promise<EventRow[]> => {
  const supabase = await createClient()
  const id = (clubId ?? "").trim()
  if (!id) return []

  const todayIso = new Date().toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from("events")
    .select("id, club_id, title, description, event_date, event_time, location_name, status")
    .eq("club_id", id)
    .gte("event_date", todayIso)
    .order("event_date", { ascending: true })
    .limit(limit)

  if (error) throw new Error(error.message)
  if (data) return (data as EventRow[]) ?? []

  const svc = getServiceClient()
  if (!svc) return []

  const svcRes = await svc
    .from("events")
    .select("id, club_id, title, description, event_date, event_time, location_name, status")
    .eq("club_id", id)
    .gte("event_date", todayIso)
    .order("event_date", { ascending: true })
    .limit(limit)

  if (svcRes.error) throw new Error(svcRes.error.message)
  return (svcRes.data as EventRow[]) ?? []
})

export const getEventById = cache(async (clubId: string, eventId: string): Promise<EventRow | null> => {
  const supabase = await createClient()
  const cId = (clubId ?? "").trim()
  const eId = (eventId ?? "").trim()
  if (!cId || !eId) return null

  const { data, error } = await supabase
    .from("events")
    .select("id, club_id, title, description, event_date, event_time, location_name, status")
    .eq("club_id", cId)
    .eq("id", eId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (data) return (data as EventRow) ?? null

  const svc = getServiceClient()
  if (!svc) return null

  const svcRes = await svc
    .from("events")
    .select("id, club_id, title, description, event_date, event_time, location_name, status")
    .eq("club_id", cId)
    .eq("id", eId)
    .maybeSingle()

  if (svcRes.error) throw new Error(svcRes.error.message)
  return (svcRes.data as EventRow | null) ?? null
})


import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

type UpdateSessionResult = {
  /** Response carrying any refreshed cookies */
  supabaseResponse: NextResponse
  /** JWT claims (validated) if authenticated */
  claims: Record<string, unknown> | null
}

function envConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  )
}

/**
 * Refreshes the Supabase session (if present) and returns validated JWT claims.
 * Do not add logic between `createServerClient` and `supabase.auth.getClaims()`.
 */
export async function updateSession(request: NextRequest): Promise<UpdateSessionResult> {
  let supabaseResponse = NextResponse.next({ request })

  if (!envConfigured()) {
    return { supabaseResponse, claims: null }
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))

          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    },
  )

  const { data } = await supabase.auth.getClaims()
  const claims = (data?.claims as Record<string, unknown> | null) ?? null

  return { supabaseResponse, claims }
}

export function copySupabaseCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach(({ name, value, ...cookie }) => {
    // NextResponse cookie shape: { name, value, path?, expires?, maxAge?, httpOnly?, secure?, sameSite?, domain? }
    to.cookies.set(name, value, cookie)
  })
}


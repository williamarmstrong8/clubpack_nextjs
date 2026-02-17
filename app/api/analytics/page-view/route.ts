import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const site = typeof body.site === "string" ? body.site.trim() : ""
    const path = typeof body.path === "string" ? body.path.trim() : null

    if (!site) {
      return NextResponse.json({ error: "Missing site" }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase.rpc("record_club_page_view", {
      p_subdomain: site,
      p_path: path,
    })

    if (error) {
      console.error("[page-view] RPC error:", error)
      return NextResponse.json({ error: "Failed to record" }, { status: 500 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (e) {
    console.error("[page-view]", e)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

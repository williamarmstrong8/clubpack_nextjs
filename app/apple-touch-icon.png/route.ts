import { NextResponse } from "next/server"

export function GET(req: Request) {
  // Avoid `/:site` catching this request in dev/production.
  // Redirect to the app favicon (Next serves `app/favicon.ico`).
  return NextResponse.redirect(new URL("/favicon.ico", req.url))
}


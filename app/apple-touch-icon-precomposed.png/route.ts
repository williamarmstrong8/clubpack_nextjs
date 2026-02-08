import { NextResponse } from "next/server"

export function GET(req: Request) {
  return NextResponse.redirect(new URL("/favicon.ico", req.url))
}


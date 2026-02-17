"use client"

import { useEffect } from "react"

export function PageViewTracker({ site }: { site: string }) {
  useEffect(() => {
    if (!site) return
    const path = typeof window !== "undefined" ? window.location.pathname : ""
    fetch("/api/analytics/page-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ site, path }),
    }).catch(() => {})
  }, [site])
  return null
}

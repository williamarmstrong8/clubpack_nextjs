import path from "node:path"
import type { NextConfig } from "next"

const appDir = path.resolve(__dirname)

const nextConfig: NextConfig = {
  outputFileTracingRoot: appDir,
  // Next.js 16 uses Turbopack by default; empty config acknowledges we're ok with that
  // (custom webpack above is for workspace resolution and may not apply to Turbopack).
  turbopack: {},
  experimental: {
    // Cache visited admin (and other dynamic) pages on the client so navigating
    // between them doesn't refetch until stale (5 min).
    staleTimes: {
      dynamic: 300,
      static: 300,
    },
    // Allow waiver (10 MB) + photo (5 MB) uploads in account settings (default is 1 MB).
    serverActions: {
      bodySizeLimit: "16mb",
    },
  },
  images: {
    // Allow Supabase Storage signed/public URLs for club hero images.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  // Resolve from app node_modules first, then parent workspace (for hoisted deps).
  webpack: (config) => {
    config.resolve ??= {}
    const existing = Array.isArray(config.resolve.modules) ? config.resolve.modules : ["node_modules"]
    config.resolve.modules = [
      path.join(appDir, "node_modules"),
      path.join(appDir, "..", "node_modules"),
      ...existing,
    ]
    return config
  },
}

export default nextConfig

import path from "node:path"
import type { NextConfig } from "next"

const appDir = path.resolve(__dirname)

const nextConfig: NextConfig = {
  turbopack: {
    root: appDir,
  },
  outputFileTracingRoot: appDir,
  // Pin resolution to this app so "tailwindcss" and other deps resolve from clubpack-nextjs/node_modules
  // when the toolchain runs with a parent workspace root (e.g. CLUBPACK WORKSPACE).
  webpack: (config) => {
    config.resolve ??= {}
    config.resolve.modules = [
      path.join(appDir, "node_modules"),
      ...(Array.isArray(config.resolve.modules) ? config.resolve.modules : ["node_modules"]),
    ]
    return config
  },
}

export default nextConfig

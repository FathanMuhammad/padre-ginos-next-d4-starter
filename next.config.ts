import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    // Day 3: unauthorized() → 401 page, forbidden() → 403 page
    authInterrupts: true,
  },
};

export default nextConfig;

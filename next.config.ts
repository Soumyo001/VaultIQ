import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // cacheComponents: true, // disable cache components to disable suspense warning
  experimental: {
    turbopackFileSystemCacheForDev: true,
  }
};

export default nextConfig;

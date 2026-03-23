import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This tells Vercel to ignore ESLint errors and deploy anyway
  eslint: {
    ignoreDuringBuilds: true,
  },
  // This tells Vercel to ignore TypeScript errors and deploy anyway
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
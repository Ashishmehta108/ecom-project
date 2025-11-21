import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // 🚀 Ignore build errors from TypeScript
  typescript: {
    ignoreBuildErrors: true,
  },



  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
    serverActions: {
      allowedOrigins: ["*"],
    },
  },
};

export default nextConfig;

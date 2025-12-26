import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // 🚀 Ignore build errors from TypeScript
  typescript: {
    ignoreBuildErrors: true,
  },
  i18n: {
    locales: ["en", "pt"], // English + Portuguese (Portugal)
    defaultLocale: "en",
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
      allowedOrigins: [
        "https://xtt5m66l-3000.inc1.devtunnels.ms",
        "http://localhost:3000",
      ],
    },
  },
};

export default nextConfig;

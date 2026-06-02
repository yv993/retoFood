import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma is loaded lazily by src/lib/db.ts (only when DATABASE_URL is set);
  // keep it external so it's never bundled into server output.
  serverExternalPackages: ["@prisma/client", "prisma", "@prisma/extension-accelerate"],
  images: {
    // Allow optimization of the original Unsplash photos (preserves the exact look)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    qualities: [60, 70, 75, 80, 90],
  },
};

export default nextConfig;

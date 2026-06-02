import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

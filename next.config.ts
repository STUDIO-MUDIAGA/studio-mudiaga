import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "pub-2ddf02e2e1654b72808b735601463baf.r2.dev" }, // Cloudflare R2
    ],
  },
};

export default nextConfig;

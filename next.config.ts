import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Navbar renders the logo at quality 100; keep Next's default 75 too.
    qualities: [75, 100],
  },
};

export default nextConfig;

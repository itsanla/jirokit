import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: [
      "@heroicons/react/24/solid",
      "@heroicons/react/24/outline",
      "@tabler/icons-react",
      "lucide-react",
      "motion",
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";
import path from "path";

const pandocCorePath = path.resolve(
  __dirname,
  "node_modules/pandoc-wasm/src/core.js"
);

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
      "@imgly/background-removal",
    ],
  },
  // Allow importing pandoc-wasm's core module (not exported via package.json "exports")
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "pandoc-wasm-core": pandocCorePath,
    };
    return config;
  },
  // Turbopack equivalent — must use relative path from project root
  turbopack: {
    resolveAlias: {
      "pandoc-wasm-core": "./node_modules/pandoc-wasm/src/core.js",
    },
  },
  // Enable COOP/COEP headers in dev so FFmpeg.wasm SharedArrayBuffer works locally
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

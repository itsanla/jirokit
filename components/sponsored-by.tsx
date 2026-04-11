"use client";

import Image from "next/image";

const SPONSORS = [
  "next",
  "openai",
  "onnx",
  "transformers",
  "ffmpeg",
  "cloudflare",
];

export default function SponsoredBy() {
  return (
    <section className="py-8 px-4 md:px-6 lg:px-12 lg:py-20 xl:px-16">
      <div className="container mx-auto text-center">
        <p className="mb-8 text-sm font-semibold uppercase tracking-wider text-blue-gray-700">
          Powered by
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {SPONSORS.map((logo, key) => (
            <Image
              width={256}
              height={256}
              key={key}
              src={`/logos/logo-${logo}.webp`}
              alt={logo}
              className="w-40"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

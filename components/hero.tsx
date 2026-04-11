"use client";

import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { HyperText } from "@/components/ui/hyper-text"

export default function Hero() {
  return (
    <div className="relative min-h-screen w-full bg-[url('/image/event.webp')] bg-cover bg-no-repeat bg-center">
      <div className="absolute inset-0 h-full w-full bg-gray-900/60" />
      <div className="grid min-h-screen px-4 md:px-6 lg:px-12 xl:px-16">
        <div className="container relative z-10 my-auto mx-auto grid place-items-center text-center">
          <div className="mb-2 text-md font-medium uppercase tracking-wider text-white/80 md:text-xl">
            <HyperText >
              ruangstudio
            </HyperText>
          </div>
          <h1 className="text-3xl font-bold leading-tight text-white md:text-4xl lg:max-w-3xl lg:text-5xl">
            Alat Digital Serba Bisa – Semua Proses di Perangkat Anda Sendiri
          </h1>
          <p className="mt-4 mb-12 w-full text-lg font-normal leading-relaxed text-white/90 md:max-w-full lg:max-w-2xl lg:text-xl">
            Konversi file, transkripsi audio, dan hapus background foto — semua
            dilakukan langsung di browser Anda. Cepat, aman, dan 100% gratis
            tanpa batasan.
          </p>
            <a
              href="/converter"
              className="inline-flex items-center min-h-[48px]"
              aria-label="Coba Sekarang - Mulai konversi file"
            >
              <InteractiveHoverButton>
                <span className="px-6 py-3 text-lg">Coba Sekarang</span>
              </InteractiveHoverButton>
            </a>
        </div>
      </div>
    </div>
  );
}

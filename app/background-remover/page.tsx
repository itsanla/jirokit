"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ShieldCheckIcon,
  BoltIcon,
  CpuChipIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/solid";

// Lazy load the heavy remover panel — only loads when user reaches the page
const RemoverPanel = dynamic(
  () => import("@/components/background-remover/remover-panel"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    ),
  }
);

const FEATURES = [
  {
    icon: <ShieldCheckIcon className="h-6 w-6 text-green-500" />,
    title: "100% Privat",
    desc: "Foto diproses di perangkat Anda. Tidak pernah dikirim ke server manapun.",
  },
  {
    icon: <CpuChipIcon className="h-6 w-6 text-purple-500" />,
    title: "AI di Browser",
    desc: "Menggunakan ONNX Runtime & WebAssembly. Mendukung akselerasi WebGPU.",
  },
  {
    icon: <BoltIcon className="h-6 w-6 text-orange-500" />,
    title: "Gratis & Tanpa Batas",
    desc: "Tidak ada registrasi, watermark, atau batasan jumlah pemakaian.",
  },
];

export default function BackgroundRemoverPage() {
  // Preload model on page mount (warm up)
  useEffect(() => {
    // Prefetch the model after initial render to speed up first use
    const timer = setTimeout(async () => {
      try {
        const { preloadModel } = await import(
          "@/lib/background-remover/engine"
        );
        await preloadModel("fast");
      } catch {
        // Ignore preload failures — will retry when user clicks process
      }
    }, 2000); // Delay 2s so it doesn't compete with initial page render

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav bar */}
      <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Beranda</span>
            </Link>
            <div className="h-5 w-px bg-gray-200" />
            <span className="text-lg font-bold text-gray-900">
              ruang.studio
            </span>
          </div>
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            100% Lokal & Gratis
          </span>
        </div>
      </nav>

      {/* Hero mini */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 px-4 py-12 text-center md:py-16">
        <div className="container mx-auto max-w-3xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-orange-400">
            Penghapus Latar Belakang
          </p>
          <h1 className="text-3xl font-bold leading-tight text-white md:text-4xl">
            Hapus Background Foto — Otomatis{" "}
            <br className="hidden md:block" />
            dengan AI, Langsung di Browser
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-gray-300">
            Hapus latar belakang foto secara instan menggunakan kecerdasan
            buatan. Tanpa upload, tanpa watermark, tanpa batasan — 100%
            gratis dan privat.
          </p>
        </div>
      </section>

      {/* Feature badges */}
      <section className="border-b border-gray-200 bg-white px-4 py-6">
        <div className="container mx-auto flex flex-col items-center justify-center gap-6 md:flex-row md:gap-12">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50">
                {f.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{f.title}</p>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main remover area */}
      <section className="px-4 py-10 md:py-16">
        <div className="container mx-auto max-w-4xl">
          <RemoverPanel />
        </div>
      </section>

      {/* Info section */}
      <section className="border-t border-gray-200 bg-white px-4 py-12">
        <div className="container mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
            Cara Kerja
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-6 text-center">
              <div className="mb-3 text-3xl">📷</div>
              <h3 className="mb-2 font-semibold text-gray-900">
                1. Upload Foto
              </h3>
              <p className="text-sm text-gray-600">
                Seret & lepas atau klik untuk memilih foto dari perangkat Anda.
                Mendukung PNG, JPG, WEBP, dan BMP.
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-6 text-center">
              <div className="mb-3 text-3xl">🤖</div>
              <h3 className="mb-2 font-semibold text-gray-900">
                2. AI Memproses
              </h3>
              <p className="text-sm text-gray-600">
                Model AI (ISNet) berjalan langsung di browser menggunakan ONNX
                Runtime WebAssembly. Tidak ada data yang dikirim ke server.
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-6 text-center">
              <div className="mb-3 text-3xl">✨</div>
              <h3 className="mb-2 font-semibold text-gray-900">
                3. Download Hasil
              </h3>
              <p className="text-sm text-gray-600">
                Bandingkan hasilnya, lalu download dalam format PNG, JPG, atau
                WebP. Tanpa watermark dan tanpa batasan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tips note */}
      <section className="px-4 pb-8">
        <div className="container mx-auto max-w-3xl space-y-3">
          <div className="rounded-xl bg-orange-50 p-4 text-center ring-1 ring-orange-100">
            <p className="text-sm text-orange-800">
              💡 <strong>Tips:</strong> Penggunaan pertama kali akan mengunduh
              model AI (~40 MB untuk mode cepat). Setelah itu model akan
              di-cache oleh browser sehingga proses selanjutnya jauh lebih
              cepat. Gunakan mode &quot;Kualitas Tinggi&quot; untuk hasil terbaik
              pada foto kompleks.
            </p>
          </div>
          <div className="rounded-xl bg-blue-50 p-4 text-center ring-1 ring-blue-100">
            <p className="text-sm text-blue-800">
              🖼️ <strong>Performa:</strong> Gambar akan dikecilkan otomatis
              sebelum diproses (default maks 2048px). Ini mempercepat proses
              secara signifikan karena model AI bekerja di resolusi 1024×1024.
              Pilih &quot;Kecil (1024px)&quot; untuk hasil tercepat, atau
              &quot;Asli&quot; jika butuh resolusi penuh.
            </p>
          </div>
        </div>
      </section>

      {/* Footer mini */}
      <footer className="border-t border-gray-200 bg-white px-4 py-6 text-center">
        <p className="text-sm text-gray-500">
          © 2026{" "}
          <Link
            href="/"
            className="font-medium text-gray-900 hover:text-orange-500"
          >
            ruang.studio
          </Link>{" "}
          — Alat Digital Serba Bisa. Developed by{" "}
          <a
            href="https://anla.my.id"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-gray-900 hover:text-orange-500"
          >
            Anla Harpanda
          </a>
        </p>
      </footer>
    </div>
  );
}

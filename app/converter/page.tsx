"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  PhotoIcon,
  DocumentTextIcon,
  FilmIcon,
  ShieldCheckIcon,
  BoltIcon,
  GlobeAltIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/solid";
import CategoryTabs from "@/components/converter/category-tabs";

// Lazy load the heavy converter panel — only loads when user interacts
const ConverterPanel = dynamic(
  () => import("@/components/converter/converter-panel"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    ),
  }
);

const TABS = [
  { key: "image", label: "Gambar", icon: <PhotoIcon className="h-5 w-5" /> },
  { key: "document", label: "Dokumen", icon: <DocumentTextIcon className="h-5 w-5" /> },
  { key: "media", label: "Media", icon: <FilmIcon className="h-5 w-5" /> },
];

const CATEGORY_LABELS: Record<string, string> = {
  image: "gambar",
  document: "dokumen",
  media: "audio/video",
};

const FEATURES = [
  {
    icon: <ShieldCheckIcon className="h-6 w-6 text-green-500" />,
    title: "100% Privat",
    desc: "File tidak pernah meninggalkan perangkat Anda. Semua proses di browser.",
  },
  {
    icon: <BoltIcon className="h-6 w-6 text-orange-500" />,
    title: "Super Cepat",
    desc: "Menggunakan Canvas API, WebAssembly & WebCodecs untuk performa maksimal.",
  },
  {
    icon: <GlobeAltIcon className="h-6 w-6 text-blue-500" />,
    title: "Tanpa Install",
    desc: "Cukup buka browser — tidak perlu download atau registrasi apapun.",
  },
];

export default function ConverterPage() {
  const [activeTab, setActiveTab] = useState("image");

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
            <span className="text-lg font-bold text-gray-900">ruang.studio</span>
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
            Pengubah File Universal
          </p>
          <h1 className="text-3xl font-bold leading-tight text-white md:text-4xl">
            Konversi File Apapun — 100% Privat,{" "}
            <br className="hidden md:block" />
            Langsung di Perangkat Anda
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-gray-300">
            Gambar, dokumen, audio, dan video — ubah ke format apapun dalam
            hitungan detik. Tanpa upload ke server, tanpa batasan, tanpa biaya.
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

      {/* Main converter area */}
      <section className="px-4 py-10 md:py-16">
        <div className="container mx-auto max-w-4xl space-y-8">
          {/* Category tabs */}
          <CategoryTabs
            tabs={TABS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Converter panel */}
          <ConverterPanel
            key={activeTab}
            category={activeTab as "image" | "document" | "media"}
            categoryLabel={CATEGORY_LABELS[activeTab]}
          />
        </div>
      </section>

      {/* Format support info */}
      <section className="border-t border-gray-200 bg-white px-4 py-12">
        <div className="container mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
            Format yang Didukung
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Image */}
            <div className="rounded-xl bg-gray-50 p-6">
              <div className="mb-3 flex items-center gap-2">
                <PhotoIcon className="h-5 w-5 text-orange-500" />
                <h3 className="font-semibold text-gray-900">Gambar</h3>
              </div>
              <p className="text-sm text-gray-600">
                PNG, JPG/JPEG, WEBP, BMP, GIF — konversi antar format dengan
                kualitas tinggi menggunakan Canvas API native browser.
              </p>
            </div>
            {/* Document */}
            <div className="rounded-xl bg-gray-50 p-6">
              <div className="mb-3 flex items-center gap-2">
                <DocumentTextIcon className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-gray-900">Dokumen</h3>
              </div>
              <p className="text-sm text-gray-600">
                DOCX, TXT, HTML, Markdown — konversi berkualitas tinggi
                menggunakan Pandoc WebAssembly. PDF hanya dapat dikonversi
                ke JPG (per halaman).
              </p>
            </div>
            {/* Media */}
            <div className="rounded-xl bg-gray-50 p-6">
              <div className="mb-3 flex items-center gap-2">
                <FilmIcon className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold text-gray-900">Audio & Video</h3>
              </div>
              <p className="text-sm text-gray-600">
                MP4, WEBM, MP3, WAV, OGG, GIF — konversi media menggunakan
                FFmpeg WebAssembly langsung di browser Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Warning note */}
      <section className="px-4 pb-8">
        <div className="container mx-auto max-w-3xl">
          <div className="rounded-xl bg-orange-50 p-4 text-center ring-1 ring-orange-100">
            <p className="text-sm text-orange-800">
              💡 <strong>Tips:</strong> Kecepatan konversi tergantung pada
              spesifikasi perangkat Anda. File berukuran besar ({">"}50 MB)
              mungkin memakan waktu lebih lama pada perangkat mobile.
            </p>
          </div>
        </div>
      </section>

      {/* Footer mini */}
      <footer className="border-t border-gray-200 bg-white px-4 py-6 text-center">
        <p className="text-sm text-gray-500">
          © 2026{" "}
          <Link href="/" className="font-medium text-gray-900 hover:text-orange-500">
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

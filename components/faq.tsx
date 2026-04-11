"use client";

import React from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const FAQS = [
  {
    title: "1. Apakah file saya aman di ruang.studio?",
    desc: "Ya, 100% aman! Semua proses konversi, transkripsi, dan editing dilakukan langsung di perangkat Anda (browser). File Anda tidak pernah dikirim atau diunggah ke server kami. Ini berarti tidak ada risiko kebocoran data — privasi Anda sepenuhnya terjaga.",
  },
  {
    title: "2. Apakah ruang.studio benar-benar gratis?",
    desc: "Ya, sepenuhnya gratis dan tanpa batasan! Karena semua pemrosesan dilakukan di perangkat pengguna, kami tidak memerlukan server yang mahal untuk memproses file. Artinya, tidak ada alasan bagi kami untuk memungut biaya. Gunakan sebanyak yang Anda butuhkan, kapan saja.",
  },
  {
    title: "3. Apakah saya perlu menginstall aplikasi atau membuat akun?",
    desc: "Tidak perlu sama sekali. Cukup buka ruang.studio di browser favorit Anda (Chrome, Safari, Firefox, Edge) dan langsung gunakan semua alatnya. Tidak perlu download, tidak perlu registrasi, tidak perlu login.",
  },
  {
    title: "4. Format file apa saja yang didukung untuk konversi?",
    desc: "Kami mendukung puluhan format populer, termasuk: Dokumen (PDF, DOCX, TXT, XLSX, PPTX), Gambar (PNG, JPG, WEBP, SVG, GIF, BMP), Audio (MP3, WAV, OGG, FLAC), dan Video (MP4, WEBM, AVI). Kami terus menambahkan dukungan format baru secara berkala.",
  },
  {
    title: "5. Siapa saja yang cocok menggunakan ruang.studio?",
    desc: "ruang.studio dirancang untuk semua orang: mahasiswa yang butuh konversi tugas dan transkrip wawancara, pekerja kantoran yang sering berurusan dengan berbagai format file, pedagang online/UMKM yang butuh hapus background foto produk, dan konten kreator yang memerlukan alat editing cepat.",
  },
  {
    title: "6. Apakah kualitas hasil konversi dan editing terjaga?",
    desc: "Ya! Kami menggunakan teknologi WebAssembly dan AI model ringan yang berjalan langsung di browser Anda. Hasilnya tetap berkualitas tinggi — file konversi akurat, transkripsi presisi, dan penghapusan background rapi dan detail.",
  },
];

export default function Faq() {
  const [open, setOpen] = React.useState(0);
  const handleOpen = (value: number) => setOpen(open === value ? 0 : value);

  return (
    <section id="faq" className="py-8 px-4 md:px-6 lg:px-12 lg:py-20 xl:px-16">
      <div className="container mx-auto">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold text-blue-gray-900 lg:text-4xl">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="mx-auto mb-24 text-lg text-gray-500 lg:w-3/5">
            Berikut jawaban untuk pertanyaan yang paling sering ditanyakan
            tentang ruang.studio. Jika masih ada pertanyaan lain, jangan ragu
            menghubungi kami.
          </p>
        </div>

        <div className="mx-auto lg:max-w-screen-lg lg:px-20">
          {FAQS.map(({ title, desc }, key) => (
            <div
              key={key}
              className="border-b border-blue-gray-100"
            >
              <button
                onClick={() => handleOpen(key + 1)}
                className="flex w-full items-center justify-between py-4 text-left text-base font-medium text-gray-900 transition-colors hover:text-blue-gray-700 md:text-lg"
              >
                {title}
                <ChevronDownIcon
                  className={`h-5 w-5 shrink-0 transition-transform duration-300 ${
                    open === key + 1 ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  open === key + 1 ? "max-h-96 pb-4" : "max-h-0"
                }`}
              >
                <p className="text-base font-normal text-gray-500">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

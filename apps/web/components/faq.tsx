"use client";

import React from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const FAQS = [
  {
    title: "1. Apa saja layanan yang ditawarkan jirokit?",
    desc: "Kami menyediakan layanan pembuatan website (landing page, company profile, e-commerce), aplikasi web custom, aplikasi mobile (iOS & Android), sistem manajemen internal, API development, dan konsultasi teknologi. Kami juga menyediakan layanan maintenance dan support setelah proyek selesai.",
  },
  {
    title: "2. Berapa lama waktu pengerjaan proyek?",
    desc: "Waktu pengerjaan bervariasi tergantung kompleksitas proyek. Landing page sederhana bisa selesai dalam 2-3 minggu, website dengan fitur lengkap sekitar 1-2 bulan, dan aplikasi kompleks bisa memakan waktu 3-6 bulan. Kami akan memberikan timeline detail setelah diskusi kebutuhan proyek.",
  },
  {
    title: "3. Apakah ada biaya maintenance setelah proyek selesai?",
    desc: "Setiap paket sudah termasuk maintenance gratis (1-6 bulan tergantung paket). Setelah periode gratis berakhir, Anda bisa berlangganan paket maintenance mulai dari Rp 500rb/bulan yang mencakup bug fixing, update konten, dan technical support.",
  },
  {
    title: "4. Teknologi apa yang digunakan?",
    desc: "Kami menggunakan teknologi modern dan terbukti seperti Next.js, React, Node.js, Python, Flutter untuk mobile app, PostgreSQL/MongoDB untuk database, dan cloud infrastructure seperti AWS atau Google Cloud. Teknologi dipilih berdasarkan kebutuhan spesifik proyek Anda.",
  },
  {
    title: "5. Apakah saya bisa request fitur khusus di luar paket?",
    desc: "Tentu saja! Semua paket kami bersifat fleksibel dan bisa disesuaikan dengan kebutuhan Anda. Kami akan memberikan quotation tambahan untuk fitur-fitur khusus yang Anda inginkan. Hubungi kami untuk konsultasi gratis.",
  },
  {
    title: "6. Bagaimana proses pembayaran?",
    desc: "Pembayaran dilakukan secara bertahap: 30% di awal (DP), 40% saat development selesai, dan 30% sisanya saat proyek sudah live dan diterima klien. Kami menerima pembayaran via transfer bank, e-wallet, atau payment gateway.",
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
            tentang layanan jirokit. Jika masih ada pertanyaan lain, jangan ragu
            menghubungi kami untuk konsultasi gratis.
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

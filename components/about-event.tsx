"use client";

import PricingCard from "@/components/pricing-card";

const PRICING_PLANS = [
  {
    title: "Starter",
    price: "Rp 5 juta",
    period: "/ proyek",
    description: "Cocok untuk bisnis kecil atau startup yang baru memulai",
    features: [
      "Landing Page Profesional (5 halaman)",
      "Desain Responsif (Mobile & Desktop)",
      "SEO Basic Optimization",
      "Form Kontak & Integrasi Email",
      "Google Analytics Setup",
      "Hosting & Domain (1 tahun)",
      "Revisi hingga 3x",
      "Maintenance 1 bulan gratis",
    ],
    ctaText: "Mulai Sekarang",
    ctaHref: "#kontak",
  },
  {
    title: "Professional",
    price: "Rp 15 juta",
    period: "/ proyek",
    description: "Untuk bisnis yang membutuhkan fitur lebih lengkap dan kompleks",
    features: [
      "Website Full Custom (10-15 halaman)",
      "Admin Panel / CMS",
      "Database Integration",
      "User Authentication & Authorization",
      "Payment Gateway Integration",
      "API Development",
      "Advanced SEO & Performance Optimization",
      "Hosting & Domain (1 tahun)",
      "Revisi hingga 5x",
      "Maintenance 3 bulan gratis",
      "Training & Dokumentasi",
    ],
    popular: true,
    ctaText: "Pilih Paket Ini",
    ctaHref: "#kontak",
  },
  {
    title: "Enterprise",
    price: "Rp 30 juta+",
    period: "/ proyek",
    description: "Solusi lengkap untuk perusahaan dengan kebutuhan kompleks",
    features: [
      "Full-Stack Web Application",
      "Mobile App (iOS & Android)",
      "Advanced Admin Dashboard",
      "Multi-user Role Management",
      "Third-party API Integration",
      "Real-time Features (Chat, Notification)",
      "Cloud Infrastructure Setup",
      "Security & Compliance",
      "Load Balancing & Scalability",
      "Hosting & Domain (1 tahun)",
      "Revisi unlimited",
      "Maintenance 6 bulan gratis",
      "Dedicated Support Team",
      "Training & Full Documentation",
    ],
    ctaText: "Konsultasi Gratis",
    ctaHref: "#kontak",
  },
];

export default function AboutEvent() {
  return (
    <section
      id="tentang"
      className="container mx-auto flex flex-col items-center px-4 md:px-6 lg:px-12 xl:px-16 py-10"
    >
      <p className="mb-2 text-center text-sm font-semibold uppercase tracking-wider text-orange-700">
        Tentang Kami
      </p>
      <h2 className="text-center text-3xl font-bold text-blue-gray-900">
        Kenapa Memilih ruang.studio?
      </h2>
      <p className="mt-2 mb-8 w-full text-center text-lg font-normal text-gray-500 lg:max-w-4xl">
        Kami adalah software house yang berfokus pada pembuatan website dan aplikasi berkualitas tinggi. 
        Dengan tim developer berpengalaman, kami siap mengubah ide bisnis Anda menjadi solusi digital yang powerful dan scalable.
      </p>
      <p className="mb-8 w-full text-center text-base font-normal text-gray-500 lg:max-w-3xl">
        Dari startup hingga enterprise, kami telah membantu berbagai klien mewujudkan visi digital mereka dengan teknologi terkini dan best practices.
      </p>
      <div id="layanan" className="w-full mt-8">
        <p className="mb-6 text-center text-sm font-semibold uppercase tracking-wider text-orange-700">
          Paket Layanan Kami
        </p>
        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {PRICING_PLANS.map((plan, idx) => (
            <PricingCard key={idx} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
}

export interface Event {
  slug: string;
  title: string;
  emoji: string;
  target: string;
  description: string;
  benefits: string[];
  totalSlots: number;
  remainingSlots: number;
  promoCode: string;
  normalPrice: number;
  eventPrice: number;
  isActive: boolean;
}

const EVENTS: Event[] = [
  {
    slug: "digitalisasi-kuliner-nusantara",
    title: "Digitalisasi Kuliner Nusantara",
    emoji: "🍵",
    target: "Cafe, warung, restoran, catering",
    description:
      "Program eksklusif untuk pelaku kuliner Indonesia agar punya website profesional, muncul di Google, dan menjangkau lebih banyak pelanggan.",
    benefits: [
      "Landing page profesional khusus bisnis kuliner",
      "Subdomain .jirokit.com gratis",
      "Hosting 6 bulan gratis",
      "Section menu makanan & galeri foto",
      "Tombol pesan via WhatsApp & GoFood/GrabFood",
      "SEO basic (muncul di pencarian Google)",
      "Google Analytics terpasang",
      "Desain responsif Mobile & Desktop",
      "2x revisi desain",
    ],
    totalSlots: 3,
    remainingSlots: 2,
    promoCode: "KULINER2025",
    normalPrice: 399000,
    eventPrice: 299000,
    isActive: true,
  },
  {
    slug: "digitalisasi-kecantikan-nusantara",
    title: "Digitalisasi Kecantikan Nusantara",
    emoji: "💇",
    target: "Salon, barbershop, spa, skincare",
    description:
      "Buka cabang digital untuk bisnis kecantikan Anda. Tampilkan layanan, portofolio, dan harga di website yang elegan.",
    benefits: [
      "Landing page profesional khusus bisnis kecantikan",
      "Subdomain .jirokit.com gratis",
      "Hosting 6 bulan gratis",
      "Section layanan & price list",
      "Galeri portofolio before/after",
      "Booking via WhatsApp",
      "SEO basic (muncul di pencarian Google)",
      "Google Analytics terpasang",
      "Desain responsif Mobile & Desktop",
      "2x revisi desain",
    ],
    totalSlots: 3,
    remainingSlots: 3,
    promoCode: "CANTIK2025",
    normalPrice: 399000,
    eventPrice: 299000,
    isActive: true,
  },
  {
    slug: "digitalisasi-kesehatan-nusantara",
    title: "Digitalisasi Kesehatan Nusantara",
    emoji: "🏥",
    target: "Klinik, apotek, dokter praktik",
    description:
      "Solusi digital untuk fasilitas kesehatan agar pasien lebih mudah menemukan informasi layanan, jadwal, dan kontak Anda.",
    benefits: [
      "Landing page profesional khusus bisnis kesehatan",
      "Subdomain .jirokit.com gratis",
      "Hosting 6 bulan gratis",
      "Section layanan medis & jadwal praktik",
      "Form konsultasi via WhatsApp",
      "Info lokasi dengan Google Maps",
      "SEO basic (muncul di pencarian Google)",
      "Google Analytics terpasang",
      "Desain responsif Mobile & Desktop",
      "2x revisi desain",
    ],
    totalSlots: 3,
    remainingSlots: 3,
    promoCode: "SEHAT2025",
    normalPrice: 399000,
    eventPrice: 299000,
    isActive: true,
  },
  {
    slug: "digitalisasi-fashion-nusantara",
    title: "Digitalisasi Fashion Nusantara",
    emoji: "👗",
    target: "Toko baju, konveksi, thrift store",
    description:
      "Tampilkan koleksi produk fashion Anda dengan website yang stylish dan siap jualan ke seluruh Indonesia.",
    benefits: [
      "Landing page profesional khusus bisnis fashion",
      "Subdomain .jirokit.com gratis",
      "Hosting 6 bulan gratis",
      "Galeri katalog produk",
      "Tombol checkout via WhatsApp",
      "Integrasi link marketplace (Tokopedia, Shopee)",
      "SEO basic (muncul di pencarian Google)",
      "Google Analytics terpasang",
      "Desain responsif Mobile & Desktop",
      "2x revisi desain",
    ],
    totalSlots: 3,
    remainingSlots: 3,
    promoCode: "FASHION2025",
    normalPrice: 399000,
    eventPrice: 299000,
    isActive: true,
  },
  {
    slug: "digitalisasi-pendidikan-nusantara",
    title: "Digitalisasi Pendidikan Nusantara",
    emoji: "🏫",
    target: "Les privat, bimbel, kursus",
    description:
      "Bantu lembaga pendidikan Anda dipercaya dan ditemukan calon murid dengan website profesional yang informatif.",
    benefits: [
      "Landing page profesional khusus bisnis pendidikan",
      "Subdomain .jirokit.com gratis",
      "Hosting 6 bulan gratis",
      "Section program & jadwal kelas",
      "Form pendaftaran via WhatsApp",
      "Testimoni murid & orang tua",
      "SEO basic (muncul di pencarian Google)",
      "Google Analytics terpasang",
      "Desain responsif Mobile & Desktop",
      "2x revisi desain",
    ],
    totalSlots: 3,
    remainingSlots: 3,
    promoCode: "BELAJAR2025",
    normalPrice: 399000,
    eventPrice: 299000,
    isActive: true,
  },
];

export function getAllEvents(): Event[] {
  return EVENTS.filter((e) => e.isActive);
}

export function getAllEventSlugs(): string[] {
  return EVENTS.filter((e) => e.isActive).map((e) => e.slug);
}

export function getEventBySlug(slug: string): Event | undefined {
  return EVENTS.find((e) => e.slug === slug && e.isActive);
}

export function getRelatedEvents(currentSlug: string, limit = 3): Event[] {
  return getAllEvents()
    .filter((e) => e.slug !== currentSlug)
    .slice(0, limit);
}

export function formatIDR(value: number): string {
  if (value === 0) return "Rp 0";
  return `Rp ${value.toLocaleString("id-ID")}`;
}

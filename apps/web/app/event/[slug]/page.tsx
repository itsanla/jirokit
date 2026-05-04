import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowLeft } from "lucide-react";

const EVENT_HERO: Record<string, string> = {
  "digitalisasi-kuliner-nusantara": "/event/umkm-kuliner.webp",
  "digitalisasi-kecantikan-nusantara": "/event/umkm-kecantikan.webp",
  "digitalisasi-kesehatan-nusantara": "/event/umkm-kesehatan.webp",
  "digitalisasi-fashion-nusantara": "/event/umkm-fashion.webp",
  "digitalisasi-pendidikan-nusantara": "/event/umkm-pendidikan.webp",
};
import Navbar from "@/components/navbar";
import MobileFloatingNav from "@/components/mobile-floating-nav";
import Footer from "@/components/footer";
import EventDetailClient from "@/components/EventDetailClient";
import {
  getAllEventSlugs,
  getEventBySlug,
  getRelatedEvents,
  formatIDR,
} from "@/lib/events";

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

const FALLBACK_SLUGS = [
  "digitalisasi-kuliner-nusantara",
  "digitalisasi-kecantikan-nusantara",
  "digitalisasi-kesehatan-nusantara",
  "digitalisasi-fashion-nusantara",
  "digitalisasi-pendidikan-nusantara",
];

export async function generateStaticParams() {
  try {
    const slugs = await getAllEventSlugs();
    if (slugs.length > 0) return slugs.map((slug) => ({ slug }));
  } catch {
    // API unavailable at build time — use known slugs so build doesn't crash
  }
  return FALLBACK_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event Tidak Ditemukan" };

  const title = `${event.title} — Website Profesional Gratis untuk UMKM`;
  return {
    title,
    description: event.description,
    alternates: { canonical: `/event/${slug}` },
    openGraph: {
      type: "website",
      title,
      description: event.description,
      url: `/event/${slug}`,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: event.description,
      images: ["/og-image.png"],
    },
  };
}

function StatusBadge({ remaining }: { remaining: number }) {
  if (remaining <= 1) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600 ring-1 ring-red-100">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        {remaining === 0 ? "Slot Habis" : `Sisa ${remaining} Slot`}
      </span>
    );
  }
  if (remaining === 2) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-100">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Sisa 2 Slot
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-[#16A34A] ring-1 ring-green-100">
      <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
      {remaining} Slot Tersedia
    </span>
  );
}

function QuotaBar({ remaining, total }: { remaining: number; total: number }) {
  const filled = total - remaining;
  const percent = total > 0 ? (filled / total) * 100 : 0;
  const urgent = remaining <= 1;
  const warn = remaining === 2;
  const color = urgent ? "bg-red-500" : warn ? "bg-amber-500" : "bg-[#16A34A]";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-[#6E6E73]">
        <span>Kuota terisi</span>
        <span className="tabular-nums font-medium text-[#1D1D1F]">
          {filled}/{total}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#F5F5F7]">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const relatedEvents = await getRelatedEvents(event.slug, 3);
  const heroImage = EVENT_HERO[event.slug] ?? "/event/event.webp";

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    organizer: {
      "@type": "Organization",
      name: "Jirokit",
      url: "https://jirokit.com",
    },
    offers: {
      "@type": "Offer",
      price: event.eventPrice,
      priceCurrency: "IDR",
      availability:
        event.remainingSlots > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
      url: `https://jirokit.com/event/${event.slug}`,
    },
  };

  return (
    <main className="min-h-screen bg-[#F5F5F7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <Navbar />
      <MobileFloatingNav />

      {/* Hero */}
      <div className="relative h-[50vh] min-h-[320px] w-full overflow-hidden sm:h-[55vh]">
        <img
          src={heroImage}
          alt={event.title}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/85" />
        <div className="absolute inset-0 flex flex-col items-start justify-end px-5 pb-8 sm:px-8 sm:pb-10 lg:px-16 lg:pb-12 xl:px-20">
          <Link
            href="/event"
            className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm transition-colors hover:bg-white/25"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Semua Event
          </Link>
          <p className="text-xs font-medium uppercase tracking-widest text-white/60">
            Program Spesial · {event.target}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
            {event.title}
          </h1>
        </div>
      </div>

      <section className="container mx-auto px-4 pt-8 pb-12 sm:px-6 sm:pt-10 lg:px-12 lg:pt-12 xl:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
            <div className="lg:col-span-2">
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8 lg:p-10">
                <div className="flex items-start justify-between gap-4">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5F5F7] text-3xl sm:h-20 sm:w-20 sm:text-4xl"
                    aria-hidden="true"
                  >
                    {event.emoji}
                  </div>
                  <StatusBadge remaining={event.remainingSlots} />
                </div>

                <p className="mt-6 text-base text-[#6E6E73] sm:text-lg">
                  Untuk: {event.target}
                </p>

                <p className="mt-5 text-base leading-relaxed text-[#1D1D1F]">
                  {event.description}
                </p>

                <div className="mt-8">
                  <QuotaBar
                    remaining={event.remainingSlots}
                    total={event.totalSlots}
                  />
                </div>
              </div>

              <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8 lg:p-10">
                <h2 className="text-xl font-semibold tracking-tight text-[#1D1D1F] sm:text-2xl">
                  Yang Anda Dapatkan
                </h2>
                <ul className="mt-5 space-y-3">
                  {event.benefits.map((benefit, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-[#1D1D1F] sm:text-base"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#16A34A]" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8 lg:p-10">
                <h2 className="text-xl font-semibold tracking-tight text-[#1D1D1F] sm:text-2xl">
                  Cara Klaim
                </h2>
                <ol className="mt-5 space-y-4">
                  {[
                    "Hubungi tim Jirokit untuk mendapatkan kode undangan eksklusif (jika belum punya).",
                    "Masukkan kode pada kolom di samping untuk verifikasi otomatis.",
                    "Klik tombol WhatsApp untuk klaim dan tim kami akan menghubungi Anda dalam 24 jam.",
                  ].map((step, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-[#1D1D1F] sm:text-base"
                    >
                      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#2563EB]/10 text-xs font-semibold text-[#2563EB]">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="lg:col-span-1">
              <EventDetailClient event={event} />
            </div>
          </div>
        </div>
      </section>

      {relatedEvents.length > 0 && (
        <section className="border-t border-black/5 bg-white">
          <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-20 lg:px-12 xl:px-16">
            <div className="mx-auto max-w-6xl">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-semibold tracking-tight text-[#1D1D1F] sm:text-3xl">
                  Event Serupa
                </h2>
                <p className="mt-2 text-sm text-[#6E6E73] sm:text-base">
                  Lihat program digitalisasi lain yang mungkin cocok untuk
                  bisnis Anda
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedEvents.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/event/${related.slug}`}
                    className="group flex flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F5F7] text-2xl"
                        aria-hidden="true"
                      >
                        {related.emoji}
                      </div>
                      <StatusBadge remaining={related.remainingSlots} />
                    </div>
                    <h3 className="text-base font-semibold tracking-tight text-[#1D1D1F]">
                      {related.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-[#6E6E73]">
                      {related.target}
                    </p>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-xs text-[#6E6E73] line-through">
                        {formatIDR(related.normalPrice)}
                      </span>
                      <span className="text-sm font-semibold text-[#1D1D1F]">
                        {formatIDR(related.eventPrice)}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm font-medium text-[#2563EB] transition-colors group-hover:text-[#1d4fd8]">
                      <span>Lihat detail</span>
                      <span aria-hidden="true">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}

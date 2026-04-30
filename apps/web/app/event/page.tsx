import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar";
import MobileFloatingNav from "@/components/mobile-floating-nav";
import Footer from "@/components/footer";
import { getAllEvents, formatIDR } from "@/lib/events";
import type { Event } from "@/lib/events";

export const metadata: Metadata = {
  title: "Event Digitalisasi UMKM Nusantara — Website Profesional GRATIS",
  description:
    "Program eksklusif digitalisasi UMKM Indonesia. Dapatkan landing page profesional gratis dengan kode undangan untuk bisnis kuliner, kecantikan, kesehatan, fashion, dan pendidikan.",
  alternates: { canonical: "/event" },
  openGraph: {
    type: "website",
    title: "Event Digitalisasi UMKM Nusantara — Jirokit",
    description:
      "Website profesional gratis untuk UMKM Indonesia terpilih. Hubungi kami untuk mendapatkan kode undangan eksklusif.",
    url: "/event",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Event Digitalisasi UMKM Nusantara",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Event Digitalisasi UMKM Nusantara — Jirokit",
    description:
      "Website profesional gratis untuk UMKM Indonesia terpilih.",
    images: ["/og-image.png"],
  },
};

function StatusBadge({ remaining }: { remaining: number }) {
  if (remaining <= 1) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 ring-1 ring-red-100">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        {remaining === 0 ? "Slot Habis" : `Sisa ${remaining} Slot`}
      </span>
    );
  }
  if (remaining === 2) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-100">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Sisa 2 Slot
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-[#16A34A] ring-1 ring-green-100">
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
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs text-[#6E6E73]">
        <span>Kuota terisi</span>
        <span className="tabular-nums">
          {filled}/{total}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F5F5F7]">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  return (
    <Link
      href={`/event/${event.slug}`}
      className="group flex flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
    >
      <div className="mb-4 flex items-start justify-between">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F5F7] text-2xl"
          aria-hidden="true"
        >
          {event.emoji}
        </div>
        <StatusBadge remaining={event.remainingSlots} />
      </div>

      <h2 className="text-lg font-semibold tracking-tight text-[#1D1D1F]">
        {event.title}
      </h2>
      <p className="mt-1.5 text-sm text-[#6E6E73]">{event.target}</p>

      <div className="mt-5">
        <QuotaBar
          remaining={event.remainingSlots}
          total={event.totalSlots}
        />
      </div>

      <div className="mt-5 rounded-2xl bg-[#F5F5F7] px-4 py-3">
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-[#6E6E73] line-through">
            {formatIDR(event.normalPrice)}
          </span>
          <span className="text-base font-semibold text-[#1D1D1F]">
            {formatIDR(event.eventPrice)}
          </span>
        </div>
        <div className="mt-1 text-xs font-medium text-[#16A34A]">
          atau GRATIS dengan kode undangan
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm font-medium text-[#2563EB] transition-colors group-hover:text-[#1d4fd8]">
        <span>Lihat detail program</span>
        <span aria-hidden="true">→</span>
      </div>
    </Link>
  );
}

export default async function EventPage() {
  const events = await getAllEvents();

  return (
    <main className="min-h-screen bg-[#F5F5F7]">
      <Navbar />
      <MobileFloatingNav />

      <section className="container mx-auto px-4 pt-28 pb-12 sm:px-6 sm:pt-32 lg:px-12 lg:pt-36 xl:px-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-[#2563EB]">
            Program Spesial
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#1D1D1F] sm:text-4xl lg:text-5xl">
            Digitalisasi UMKM Nusantara
          </h1>
          <p className="mt-4 text-base text-[#6E6E73] sm:text-lg">
            Website profesional gratis untuk bisnis Indonesia terpilih.
            Hubungi kami untuk mendapatkan kode undangan eksklusif.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20 sm:px-6 lg:px-12 xl:px-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-2xl rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-black/5 sm:p-8">
          <h2 className="text-xl font-semibold tracking-tight text-[#1D1D1F]">
            Belum punya kode undangan?
          </h2>
          <p className="mt-2 text-sm text-[#6E6E73]">
            Hubungi kami via WhatsApp untuk konsultasi gratis dan informasi
            kode undangan eksklusif.
          </p>
          <a
            href="https://wa.me/6285122359597?text=Halo%20Jirokit!%20Saya%20ingin%20info%20kode%20undangan%20Digitalisasi%20UMKM%20Nusantara."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center justify-center rounded-2xl bg-[#1D1D1F] px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:bg-black"
          >
            Hubungi via WhatsApp →
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}

"use client";

interface EventCard {
  id: string;
  emoji: string;
  title: string;
  target: string;
  totalSlots: number;
  remainingSlots: number;
}

const EVENTS: EventCard[] = [
  {
    id: "kuliner",
    emoji: "🍵",
    title: "Digitalisasi Kuliner Nusantara",
    target: "Cafe, warung, restoran, catering",
    totalSlots: 3,
    remainingSlots: 2,
  },
  {
    id: "kecantikan",
    emoji: "💇",
    title: "Digitalisasi Kecantikan Nusantara",
    target: "Salon, barbershop, spa, skincare",
    totalSlots: 3,
    remainingSlots: 3,
  },
  {
    id: "kesehatan",
    emoji: "🏥",
    title: "Digitalisasi Kesehatan Nusantara",
    target: "Klinik, apotek, dokter praktik",
    totalSlots: 3,
    remainingSlots: 3,
  },
  {
    id: "fashion",
    emoji: "👗",
    title: "Digitalisasi Fashion Nusantara",
    target: "Toko baju, konveksi, thrift store",
    totalSlots: 3,
    remainingSlots: 3,
  },
  {
    id: "pendidikan",
    emoji: "🏫",
    title: "Digitalisasi Pendidikan Nusantara",
    target: "Les privat, bimbel, kursus",
    totalSlots: 3,
    remainingSlots: 3,
  },
];

function scrollToForm() {
  const el = document.getElementById("daftar");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function StatusBadge({ remaining }: { remaining: number }) {
  const urgent = remaining <= 2;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        urgent
          ? "bg-red-50 text-red-600 ring-1 ring-red-100"
          : "bg-green-50 text-[#16A34A] ring-1 ring-green-100"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          urgent ? "bg-red-500" : "bg-[#16A34A]"
        }`}
      />
      {urgent ? `Sisa ${remaining} Slot` : `${remaining} Slot Tersedia`}
    </span>
  );
}

function QuotaBar({ remaining, total }: { remaining: number; total: number }) {
  const filled = total - remaining;
  const percent = total > 0 ? (filled / total) * 100 : 0;
  const urgent = remaining <= 2;
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
          className={`h-full rounded-full transition-all duration-500 ${
            urgent ? "bg-red-500" : "bg-[#16A34A]"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default function EventSection() {
  return (
    <section
      id="event"
      className="bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-[#2563EB]">
            Program Spesial
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#1D1D1F] sm:text-4xl lg:text-5xl">
            Digitalisasi UMKM Nusantara
          </h2>
          <p className="mt-3 text-base text-[#6E6E73] sm:text-lg">
            Website profesional gratis untuk bisnis Indonesia terpilih
          </p>
          <p className="mt-2 text-sm text-[#6E6E73]">
            Hubungi kami untuk mendapatkan kode undangan eksklusif
          </p>
        </div>

        <div
          className="mt-12 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {EVENTS.map((event) => (
            <article
              key={event.id}
              className="group flex w-[80vw] max-w-sm flex-shrink-0 snap-start flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:scale-[1.02] hover:shadow-md sm:w-[60vw] md:w-[40vw] lg:w-auto lg:max-w-none"
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

              <h3 className="text-lg font-semibold tracking-tight text-[#1D1D1F]">
                {event.title}
              </h3>
              <p className="mt-1.5 text-sm text-[#6E6E73]">{event.target}</p>

              <div className="mt-5">
                <QuotaBar
                  remaining={event.remainingSlots}
                  total={event.totalSlots}
                />
              </div>

              <div className="mt-5 rounded-2xl bg-[#F5F5F7] px-4 py-3">
                <div className="text-xs text-[#6E6E73] line-through">
                  Rp 299.000
                </div>
                <div className="text-sm font-semibold text-[#16A34A]">
                  GRATIS dengan kode undangan
                </div>
              </div>

              <button
                type="button"
                onClick={scrollToForm}
                className="mt-6 w-full rounded-2xl bg-[#1D1D1F] px-4 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:bg-black active:scale-[0.98]"
              >
                Lihat Program
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

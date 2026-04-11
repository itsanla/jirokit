"use client";

import StatsCard from "@/components/stats-card";
import { NumberTicker } from "@/components/ui/number-ticker";

const STATS = [
  {
    count: (
      <>
        <NumberTicker
          value={1000}
          className="text-inherit dark:text-inherit"
        />
        +
      </>
    ),
    title: "Pengguna",
  },
  {
    count: (
      <>
        <NumberTicker
          value={5000}
          className="text-inherit dark:text-inherit"
        />
        +
      </>
    ),
    title: "File Diproses",
  },
  {
    count: (
      <>
        <NumberTicker
          value={100}
          className="text-inherit dark:text-inherit"
        />
        %
      </>
    ),
    title: "Privasi Terjamin",
  },
  {
    count: (
      <>
        Rp{" "}
        <NumberTicker
          value={0}
          startValue={100000}
          direction="up"
          className="text-inherit dark:text-inherit"
        />
      </>
    ),
    title: "Gratis Tanpa Batas",
  },
];

export default function OurStats() {
  return (
    <section className="container mx-auto grid gap-10 px-4 md:px-6 lg:px-12 xl:px-16 py-15 lg:grid-cols-1 lg:gap-20 xl:grid-cols-2 xl:place-items-center">
      <div>
        <p className="mb-6 text-sm font-semibold uppercase tracking-wider text-orange-700">
          Statistik Kami
        </p>
        <h2 className="text-4xl font-bold leading-tight text-blue-gray-900 lg:w-3/4 lg:text-5xl">
          Angka yang Berbicara
        </h2>
        <p className="mt-3 w-full text-lg text-gray-500 lg:w-9/12">
          ruang.studio telah membantu ribuan pengguna menyelesaikan pekerjaan
          digital mereka dengan cepat dan aman — semuanya gratis, langsung dari
          browser.
        </p>
      </div>
      <div>
        <div className="grid grid-cols-2 gap-8 gap-x-28">
          {STATS.map((props, key) => (
            <StatsCard key={key} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import PricingToggle from "./PricingToggle";

type PlanId = "standar" | "starter" | "professional";

interface PricingPlan {
  id: PlanId;
  title: string;
  description: string;
  normalPrice: number;
  eventPrice: number | null;
  withCodeFree: boolean;
  features: string[];
  upgradePath?: string;
  ctaText: string;
  ctaHref?: string;
  featured?: boolean;
}

const PLANS: PricingPlan[] = [
  {
    id: "standar",
    title: "Standar",
    description: "Cocok untuk yang baru mulai online",
    normalPrice: 399000,
    eventPrice: 299000,
    withCodeFree: true,
    features: [
      "Subdomain .jirokit.com",
      "Hosting 6 bulan gratis",
      "1 halaman landing page profesional",
      "SEO basic (muncul di Google)",
      "Google Analytics",
      "Desain responsif Mobile & Desktop",
      "2x revisi",
    ],
    upgradePath: "Bisa upgrade ke Starter +Rp 350.000",
    ctaText: "Daftar Sekarang",
    ctaHref: "/event",
  },
  {
    id: "starter",
    title: "Starter",
    description: "Pilihan paling populer untuk UMKM",
    normalPrice: 650000,
    eventPrice: 499000,
    withCodeFree: false,
    features: [
      "Domain .com gratis 1 tahun",
      "Hosting gratis 1 tahun",
      "Landing page profesional",
      "5 halaman blog/artikel (static)",
      "Desain responsif Mobile & Desktop",
      "SEO - Muncul di pencarian Google",
      "Google Analytics",
      "3x revisi",
    ],
    upgradePath: "Bisa upgrade ke Professional +Rp 650.000",
    ctaText: "Pilih Paket Ini",
    featured: true,
  },
  {
    id: "professional",
    title: "Professional",
    description: "Solusi lengkap dengan database & CRUD",
    normalPrice: 1300000,
    eventPrice: null,
    withCodeFree: false,
    features: [
      "Domain .com gratis 1 tahun",
      "Hosting gratis 1 tahun",
      "Database gratis 1 tahun",
      "Landing page profesional",
      "Blog/artikel halaman unlimited",
      "CRUD Blog & User Management",
      "Authentication & Login System",
      "Desain responsif Mobile & Desktop",
      "SEO Advanced",
      "Google Analytics",
      "5x revisi",
      "Maintenance 1x sebulan",
    ],
    ctaText: "Pilih Paket Ini",
  },
];

function formatIDR(value: number): string {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function scrollToForm() {
  const el = document.getElementById("daftar");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.704 5.29a1 1 0 010 1.42l-7.997 8a1 1 0 01-1.42 0l-3.99-4a1 1 0 011.42-1.41l3.28 3.29 7.287-7.3a1 1 0 011.42 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function PricingSection() {
  const [showEventPrice, setShowEventPrice] = useState(true);

  return (
    <section
      id="paket"
      className="bg-[#F5F5F7] py-16 sm:py-20 lg:py-24"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-[#1D1D1F] sm:text-4xl lg:text-5xl">
            Pilih Paket yang Sesuai
          </h2>
          <p className="mt-3 text-base text-[#6E6E73] sm:text-lg">
            Mulai gratis, berkembang bersama Jirokit
          </p>
          <div className="mt-8 flex justify-center">
            <PricingToggle
              showEventPrice={showEventPrice}
              onToggle={setShowEventPrice}
            />
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3 md:items-stretch lg:gap-8">
          {PLANS.map((plan) => {
            const hasEvent = plan.eventPrice !== null;
            const showCrossedOut = showEventPrice && hasEvent;
            const displayPrice = showCrossedOut
              ? plan.eventPrice!
              : plan.normalPrice;

            return (
              <div
                key={plan.id}
                className={`group relative flex flex-col rounded-3xl p-6 transition-all duration-300 sm:p-8 ${
                  plan.featured
                    ? "bg-white/80 shadow-md ring-1 ring-[#2563EB]/30 backdrop-blur-xl hover:scale-[1.02] hover:shadow-lg md:-my-2"
                    : "bg-white shadow-sm ring-1 ring-black/5 hover:scale-[1.01] hover:shadow-md"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-[#2563EB] px-3 py-1 text-xs font-medium text-white shadow-sm">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <h3 className="text-xl font-semibold tracking-tight text-[#1D1D1F]">
                    {plan.title}
                  </h3>
                  <p className="mt-1 text-sm text-[#6E6E73]">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6">
                  {showCrossedOut && (
                    <div className="mb-1 text-sm text-[#6E6E73] line-through">
                      {formatIDR(plan.normalPrice)}
                    </div>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-semibold tracking-tight text-[#1D1D1F] sm:text-5xl">
                      {formatIDR(displayPrice)}
                    </span>
                  </div>
                  {showEventPrice && plan.withCodeFree && (
                    <div className="mt-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#16A34A]/10 px-3 py-1 text-xs font-medium text-[#16A34A]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
                        atau GRATIS dengan kode undangan
                      </span>
                    </div>
                  )}
                </div>

                <ul className="mb-6 flex-1 space-y-3">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-[#1D1D1F]"
                    >
                      <CheckIcon
                        className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                          plan.featured ? "text-[#2563EB]" : "text-[#16A34A]"
                        }`}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.upgradePath && (
                  <p className="mb-5 rounded-2xl bg-[#F5F5F7] px-3 py-2 text-xs text-[#6E6E73]">
                    {plan.upgradePath}
                  </p>
                )}

                {plan.ctaHref ? (
                  <a
                    href={plan.ctaHref}
                    className={`block w-full rounded-2xl px-4 py-3 text-center text-sm font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                      plan.featured
                        ? "bg-[#2563EB] text-white shadow-sm hover:bg-[#1d4fd8] hover:shadow-md"
                        : "bg-[#1D1D1F] text-white hover:bg-black"
                    }`}
                  >
                    {plan.ctaText}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={scrollToForm}
                    className={`w-full rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                      plan.featured
                        ? "bg-[#2563EB] text-white shadow-sm hover:bg-[#1d4fd8] hover:shadow-md"
                        : "bg-[#1D1D1F] text-white hover:bg-black"
                    }`}
                  >
                    {plan.ctaText}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

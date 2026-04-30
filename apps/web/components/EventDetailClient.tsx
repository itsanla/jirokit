"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, XCircle, MessageCircle, Sparkles } from "lucide-react";
import type { Event } from "@/lib/events";
import { formatIDR } from "@/lib/events";

const WHATSAPP_NUMBER = "6285122359597";

interface EventDetailClientProps {
  event: Event;
}

type CodeStatus = "idle" | "verified" | "invalid";

function buildWaUrl(event: Event, status: CodeStatus, code: string): string {
  const lines = [
    `Halo Jirokit! Saya tertarik dengan program *${event.title}*.`,
    "",
    `*Target:* ${event.target}`,
  ];

  if (status === "verified") {
    lines.push(
      "",
      `*Kode Undangan:* ${code} ✅`,
      "Saya ingin klaim website *GRATIS* sesuai program.",
    );
  } else {
    lines.push(
      "",
      `Saya ingin daftar dengan harga event *${formatIDR(event.eventPrice)}*.`,
      "Mohon info kode undangan jika tersedia.",
    );
  }

  lines.push("", "Terima kasih!");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export default function EventDetailClient({ event }: EventDetailClientProps) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<CodeStatus>("idle");
  const [displayPrice, setDisplayPrice] = useState(event.eventPrice);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const animatePriceTo = (target: number) => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    const start = displayPrice;
    const duration = 900;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = Math.round(start + (target - start) * eased);
      setDisplayPrice(next);
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(tick);
      }
    };
    animationRef.current = requestAnimationFrame(tick);
  };

  const handleVerify = () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    if (trimmed === event.promoCode) {
      setStatus("verified");
      animatePriceTo(0);
    } else {
      setStatus("invalid");
      animatePriceTo(event.eventPrice);
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setCode("");
    animatePriceTo(event.eventPrice);
  };

  const verified = status === "verified";

  return (
    <div className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-black/5 sm:p-7 lg:sticky lg:top-24">
      <div className="mb-2 text-sm text-[#6E6E73] line-through">
        {formatIDR(event.normalPrice)}
      </div>
      <div className="flex items-baseline gap-2">
        <span
          className={`text-4xl font-semibold tracking-tight transition-colors duration-500 sm:text-5xl ${
            verified ? "text-[#16A34A]" : "text-[#1D1D1F]"
          }`}
        >
          {verified && displayPrice === 0 ? "GRATIS" : formatIDR(displayPrice)}
        </span>
      </div>

      {!verified && (
        <p className="mt-2 text-sm text-[#6E6E73]">
          atau{" "}
          <span className="font-medium text-[#16A34A]">
            GRATIS dengan kode undangan
          </span>
        </p>
      )}

      {verified && (
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-[#16A34A]/10 px-3 py-2 text-sm font-medium text-[#16A34A]">
          <Sparkles className="h-4 w-4" />
          Kode valid! Anda mendapat slot gratis.
        </div>
      )}

      <div className="mt-6">
        <label
          htmlFor="promo-code"
          className="mb-1.5 block text-sm font-medium text-[#1D1D1F]"
        >
          Kode Undangan
        </label>
        <div className="flex gap-2">
          <input
            id="promo-code"
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (status !== "idle") setStatus("idle");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleVerify();
              }
            }}
            placeholder="Masukkan kode"
            disabled={verified}
            className={`flex-1 rounded-xl border-0 px-4 py-3 text-sm uppercase tracking-wide text-[#1D1D1F] placeholder:text-[#6E6E73] focus:outline-none focus:ring-2 transition-all duration-200 ${
              status === "invalid"
                ? "bg-red-50 ring-2 ring-red-300 focus:ring-red-400"
                : verified
                  ? "bg-[#16A34A]/10 ring-2 ring-[#16A34A]/30"
                  : "bg-[#F5F5F7] focus:ring-[#2563EB]"
            } disabled:cursor-not-allowed`}
          />
          {verified ? (
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl bg-[#F5F5F7] px-4 py-3 text-sm font-medium text-[#1D1D1F] transition-colors hover:bg-[#ECECEE]"
            >
              Reset
            </button>
          ) : (
            <button
              type="button"
              onClick={handleVerify}
              className="rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#1d4fd8] active:scale-[0.98]"
            >
              Cek
            </button>
          )}
        </div>

        {status === "invalid" && (
          <div className="mt-2 flex items-start gap-1.5 text-xs text-red-600">
            <XCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
            <span>
              Kode tidak valid. Pastikan ejaan benar atau hubungi kami untuk
              mendapatkan kode undangan.
            </span>
          </div>
        )}
        {verified && (
          <div className="mt-2 flex items-start gap-1.5 text-xs text-[#16A34A]">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
            <span>Kode terverifikasi. Lanjutkan via WhatsApp untuk klaim.</span>
          </div>
        )}
      </div>

      <a
        href={buildWaUrl(event, status, code.trim().toUpperCase())}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] ${
          verified
            ? "bg-[#16A34A] hover:bg-[#15803d]"
            : "bg-[#1D1D1F] hover:bg-black"
        }`}
      >
        <MessageCircle className="h-4 w-4" />
        {verified ? "Klaim GRATIS via WhatsApp" : "Daftar via WhatsApp"}
      </a>

      <p className="mt-3 text-center text-xs text-[#6E6E73]">
        Kami akan menghubungi Anda dalam 24 jam
      </p>
    </div>
  );
}

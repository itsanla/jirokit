"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  CheckCircle2,
  XCircle,
  MessageCircle,
  Sparkles,
  ArrowLeft,
  Loader2,
  Send,
} from "lucide-react";
import type { Event } from "@/lib/events";
import { formatIDR } from "@/lib/events";
import { apiFetch, ApiError } from "@/lib/api";

const WHATSAPP_NUMBER = "6285122359597";

interface EventDetailClientProps {
  event: Event;
}

type CodeStatus = "idle" | "checking" | "verified" | "invalid";
type View = "card" | "payment" | "form" | "success";

interface ValidateResponse {
  valid: boolean;
  code: string;
  event_slug: string;
  discount_type: string;
  discount_value: number;
  remaining_uses: number | null;
}

interface FormData {
  customer_name: string;
  customer_whatsapp: string;
  customer_email: string;
  customer_city: string;
  business_name: string;
  business_type: string;
  business_description: string;
  products: string;
  website_style: string;
  website_colors: string;
  website_reference: string;
  business_address: string;
  business_hours: string;
  business_instagram: string;
  notes: string;
}

const EMPTY_FORM: FormData = {
  customer_name: "",
  customer_whatsapp: "",
  customer_email: "",
  customer_city: "",
  business_name: "",
  business_type: "",
  business_description: "",
  products: "",
  website_style: "",
  website_colors: "",
  website_reference: "",
  business_address: "",
  business_hours: "",
  business_instagram: "",
  notes: "",
};

const BUSINESS_TYPES = [
  "Kuliner & Makanan",
  "Kecantikan & Perawatan",
  "Kesehatan & Kebugaran",
  "Fashion & Pakaian",
  "Pendidikan & Pelatihan",
  "Retail & Toko",
  "Jasa & Layanan",
  "Lainnya",
];

const WEBSITE_STYLES = [
  "Modern & Minimalis",
  "Colorful & Vibrant",
  "Professional & Corporate",
  "Traditional & Etnik",
  "Fun & Playful",
  "Luxury & Premium",
];

function buildPaymentWaUrl(event: Event): string {
  const lines = [
    `Halo Jirokit! Saya ingin mendaftar program *${event.title}*.`,
    "",
    `*Target:* ${event.target}`,
    `*Harga Event:* ${formatIDR(event.eventPrice)}`,
    "",
    "Mohon info detail pembayaran. Terima kasih!",
  ];
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}

function buildSuccessWaUrl(event: Event, name: string): string {
  const lines = [
    `Halo Jirokit! Saya *${name}* sudah mengisi form pendaftaran program *${event.title}*.`,
    "",
    "Mohon info lebih lanjut mengenai proses selanjutnya. Terima kasih!",
  ];
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}

function InputField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[#1D1D1F]">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
          <XCircle className="h-3 w-3 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border-0 bg-[#F5F5F7] px-4 py-3 text-sm text-[#1D1D1F] placeholder:text-[#6E6E73] focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all duration-200";
const inputErrorClass =
  "w-full rounded-xl border-0 bg-red-50 px-4 py-3 text-sm text-[#1D1D1F] placeholder:text-[#6E6E73] focus:outline-none ring-2 ring-red-300 focus:ring-red-400 transition-all duration-200";

export default function EventDetailClient({ event }: EventDetailClientProps) {
  const [code, setCode] = useState("");
  const [codeStatus, setCodeStatus] = useState<CodeStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [displayPrice, setDisplayPrice] = useState(event.eventPrice);
  const [view, setView] = useState<View>("card");
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const animationRef = useRef<number | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (view !== "card") {
      document.body.style.overflow = "hidden";
      overlayRef.current?.scrollTo({ top: 0 });
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [view]);

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
      setDisplayPrice(Math.round(start + (target - start) * eased));
      if (progress < 1) animationRef.current = requestAnimationFrame(tick);
    };
    animationRef.current = requestAnimationFrame(tick);
  };

  const handleVerify = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    setCodeStatus("checking");
    setErrorMsg(null);
    try {
      const data = await apiFetch<ValidateResponse>("/api/promo/validate", {
        method: "POST",
        body: JSON.stringify({ code: trimmed, event_slug: event.slug }),
      });
      const targetPrice =
        data.discount_type === "free"
          ? 0
          : data.discount_type === "percentage"
            ? Math.max(
                0,
                Math.round(event.eventPrice * (1 - data.discount_value / 100)),
              )
            : Math.max(0, event.eventPrice - data.discount_value);
      setCodeStatus("verified");
      animatePriceTo(targetPrice);
    } catch (e) {
      setCodeStatus("invalid");
      setErrorMsg(
        e instanceof ApiError
          ? e.message
          : "Gagal memverifikasi kode. Coba lagi.",
      );
      animatePriceTo(event.eventPrice);
    }
  };

  const handleReset = () => {
    setCodeStatus("idle");
    setCode("");
    setErrorMsg(null);
    animatePriceTo(event.eventPrice);
  };

  const handleDaftar = () => {
    if (codeStatus === "verified" && displayPrice === 0) {
      setView("form");
    } else {
      setView("payment");
    }
  };

  const setField = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (formErrors[key]) {
      setFormErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validateForm = (): Partial<FormData> => {
    const errors: Partial<FormData> = {};
    if (!formData.customer_name.trim())
      errors.customer_name = "Nama lengkap wajib diisi";
    if (!formData.customer_whatsapp.trim())
      errors.customer_whatsapp = "Nomor WhatsApp wajib diisi";
    if (!formData.customer_city.trim())
      errors.customer_city = "Kota wajib diisi";
    if (!formData.business_name.trim())
      errors.business_name = "Nama bisnis wajib diisi";
    if (!formData.business_type)
      errors.business_type = "Jenis bisnis wajib dipilih";
    if (!formData.products.trim())
      errors.products = "Produk yang dijual wajib diisi";
    if (!formData.business_description.trim())
      errors.business_description = "Deskripsi bisnis wajib diisi";
    if (!formData.website_style)
      errors.website_style = "Style website wajib dipilih";
    return errors;
  };

  const handleSubmitForm = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      overlayRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const notesParts = [
        `Produk yang Dijual:\n${formData.products.trim()}`,
        formData.website_style && `Style Website: ${formData.website_style}`,
        formData.website_colors && `Warna/Tema: ${formData.website_colors}`,
        formData.website_reference &&
          `Referensi Website: ${formData.website_reference}`,
        formData.notes && `Catatan Tambahan:\n${formData.notes}`,
      ]
        .filter(Boolean)
        .join("\n\n");

      await apiFetch("/api/registrations", {
        method: "POST",
        body: JSON.stringify({
          event_slug: event.slug,
          promo_code: code.trim().toUpperCase() || undefined,
          customer_name: formData.customer_name.trim(),
          customer_whatsapp: formData.customer_whatsapp.trim(),
          customer_email: formData.customer_email.trim() || undefined,
          customer_city: formData.customer_city.trim(),
          business_name: formData.business_name.trim(),
          business_type: formData.business_type,
          business_description: formData.business_description.trim(),
          business_address: formData.business_address.trim() || undefined,
          business_hours: formData.business_hours.trim() || undefined,
          business_instagram: formData.business_instagram.trim() || undefined,
          notes: notesParts || undefined,
        }),
      });

      setView("success");
    } catch (e) {
      setSubmitError(
        e instanceof ApiError
          ? e.message
          : "Terjadi kesalahan. Silahkan coba lagi.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const verified = codeStatus === "verified";
  const checking = codeStatus === "checking";

  return (
    <>
      {/* ── Sidebar card ─────────────────────────────────────── */}
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
            {verified && displayPrice === 0
              ? "GRATIS"
              : formatIDR(displayPrice)}
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
                if (codeStatus !== "idle" && codeStatus !== "checking") {
                  setCodeStatus("idle");
                  setErrorMsg(null);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleVerify();
                }
              }}
              placeholder="Masukkan kode"
              disabled={verified || checking}
              className={`flex-1 rounded-xl border-0 px-4 py-3 text-sm uppercase tracking-wide text-[#1D1D1F] placeholder:text-[#6E6E73] focus:outline-none focus:ring-2 transition-all duration-200 ${
                codeStatus === "invalid"
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
                disabled={checking}
                className="rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#1d4fd8] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {checking ? "Cek…" : "Cek"}
              </button>
            )}
          </div>

          {codeStatus === "invalid" && (
            <div className="mt-2 flex items-start gap-1.5 text-xs text-red-600">
              <XCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
              <span>
                {errorMsg ??
                  "Kode tidak valid. Pastikan ejaan benar atau hubungi kami."}
              </span>
            </div>
          )}
          {verified && (
            <div className="mt-2 flex items-start gap-1.5 text-xs text-[#16A34A]">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
              <span>Kode terverifikasi. Klik Daftar untuk melanjutkan.</span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleDaftar}
          className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] ${
            verified
              ? "bg-[#16A34A] hover:bg-[#15803d]"
              : "bg-[#1D1D1F] hover:bg-black"
          }`}
        >
          <MessageCircle className="h-4 w-4" />
          {verified ? "Daftar GRATIS" : "Daftar Sekarang"}
        </button>

        <p className="mt-3 text-center text-xs text-[#6E6E73]">
          Kami akan menghubungi Anda dalam 24 jam
        </p>
      </div>

      {/* ── Overlay ──────────────────────────────────────────── */}
      {view !== "card" && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/50 backdrop-blur-sm">
          <div
            ref={overlayRef}
            className="mx-auto flex h-full w-full max-w-2xl flex-col overflow-y-auto bg-[#F5F5F7]"
          >
            {/* ── Payment confirmation ── */}
            {view === "payment" && (
              <>
                <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-black/5 bg-white/90 px-5 py-4 backdrop-blur-sm">
                  <button
                    type="button"
                    onClick={() => setView("card")}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F5F7] text-[#1D1D1F] transition-colors hover:bg-[#ECECEE]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <h2 className="text-base font-semibold text-[#1D1D1F]">
                    Konfirmasi Pendaftaran
                  </h2>
                </div>

                <div className="flex flex-1 flex-col gap-4 p-5">
                  <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{event.emoji}</span>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-[#2563EB]">
                          Program Spesial
                        </p>
                        <h3 className="text-base font-semibold text-[#1D1D1F]">
                          {event.title}
                        </h3>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3 border-t border-black/5 pt-5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6E6E73]">Harga Normal</span>
                        <span className="text-[#6E6E73] line-through">
                          {formatIDR(event.normalPrice)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6E6E73]">Harga Event</span>
                        <span className="font-semibold text-[#1D1D1F]">
                          {formatIDR(event.eventPrice)}
                        </span>
                      </div>
                      <div className="rounded-2xl bg-[#F5F5F7] px-4 py-3 text-sm text-[#6E6E73]">
                        Punya kode undangan? Kembali dan masukkan kode untuk
                        mendapatkan slot{" "}
                        <span className="font-semibold text-[#16A34A]">
                          GRATIS
                        </span>
                        .
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                    <h4 className="text-sm font-semibold text-[#1D1D1F]">
                      Cara Pembayaran
                    </h4>
                    <ol className="mt-4 space-y-3">
                      {[
                        "Klik tombol di bawah untuk membuka WhatsApp.",
                        "Tim kami akan memandu proses pembayaran dan konfirmasi.",
                        "Setelah pembayaran terkonfirmasi, Anda akan diarahkan untuk mengisi form detail bisnis.",
                      ].map((step, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm text-[#1D1D1F]"
                        >
                          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#2563EB]/10 text-xs font-semibold text-[#2563EB]">
                            {i + 1}
                          </span>
                          <span className="text-[#6E6E73]">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <a
                    href={buildPaymentWaUrl(event)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#16A34A] px-4 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#15803d] hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Lanjutkan Pembayaran via WhatsApp
                  </a>

                  <p className="text-center text-xs text-[#6E6E73]">
                    Kami akan membalas dalam 24 jam kerja
                  </p>
                </div>
              </>
            )}

            {/* ── UMKM Form ── */}
            {view === "form" && (
              <>
                <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-black/5 bg-white/90 px-5 py-4 backdrop-blur-sm">
                  <button
                    type="button"
                    onClick={() => setView("card")}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F5F7] text-[#1D1D1F] transition-colors hover:bg-[#ECECEE]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <div>
                    <h2 className="text-base font-semibold text-[#1D1D1F]">
                      Form Pendaftaran
                    </h2>
                    <p className="text-xs text-[#16A34A]">
                      Slot GRATIS · {event.title}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-5 p-5">
                  {submitError && (
                    <div className="flex items-start gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">
                      <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      {submitError}
                    </div>
                  )}

                  {/* Informasi Diri */}
                  <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                    <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-[#2563EB]">
                      Informasi Diri
                    </h3>
                    <div className="space-y-4">
                      <InputField
                        label="Nama Lengkap"
                        required
                        error={formErrors.customer_name}
                      >
                        <input
                          type="text"
                          value={formData.customer_name}
                          onChange={(e) =>
                            setField("customer_name", e.target.value)
                          }
                          placeholder="Nama sesuai identitas"
                          className={
                            formErrors.customer_name
                              ? inputErrorClass
                              : inputClass
                          }
                        />
                      </InputField>

                      <InputField
                        label="Nomor WhatsApp"
                        required
                        error={formErrors.customer_whatsapp}
                      >
                        <input
                          type="tel"
                          value={formData.customer_whatsapp}
                          onChange={(e) =>
                            setField("customer_whatsapp", e.target.value)
                          }
                          placeholder="08xxxxxxxxxx"
                          className={
                            formErrors.customer_whatsapp
                              ? inputErrorClass
                              : inputClass
                          }
                        />
                      </InputField>

                      <div className="grid grid-cols-2 gap-4">
                        <InputField
                          label="Kota"
                          required
                          error={formErrors.customer_city}
                        >
                          <input
                            type="text"
                            value={formData.customer_city}
                            onChange={(e) =>
                              setField("customer_city", e.target.value)
                            }
                            placeholder="Contoh: Surabaya"
                            className={
                              formErrors.customer_city
                                ? inputErrorClass
                                : inputClass
                            }
                          />
                        </InputField>

                        <InputField label="Email" error={formErrors.customer_email}>
                          <input
                            type="email"
                            value={formData.customer_email}
                            onChange={(e) =>
                              setField("customer_email", e.target.value)
                            }
                            placeholder="email@contoh.com"
                            className={
                              formErrors.customer_email
                                ? inputErrorClass
                                : inputClass
                            }
                          />
                        </InputField>
                      </div>
                    </div>
                  </div>

                  {/* Informasi Bisnis */}
                  <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                    <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-[#2563EB]">
                      Informasi Bisnis UMKM
                    </h3>
                    <div className="space-y-4">
                      <InputField
                        label="Nama Bisnis / Usaha"
                        required
                        error={formErrors.business_name}
                      >
                        <input
                          type="text"
                          value={formData.business_name}
                          onChange={(e) =>
                            setField("business_name", e.target.value)
                          }
                          placeholder="Contoh: Warung Makan Bu Siti"
                          className={
                            formErrors.business_name
                              ? inputErrorClass
                              : inputClass
                          }
                        />
                      </InputField>

                      <InputField
                        label="Jenis Bisnis UMKM"
                        required
                        error={formErrors.business_type}
                      >
                        <select
                          value={formData.business_type}
                          onChange={(e) =>
                            setField("business_type", e.target.value)
                          }
                          className={
                            formErrors.business_type
                              ? inputErrorClass
                              : inputClass
                          }
                        >
                          <option value="">Pilih jenis bisnis…</option>
                          {BUSINESS_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </InputField>

                      <InputField
                        label="Produk yang Dijual"
                        required
                        error={formErrors.products}
                      >
                        <textarea
                          rows={3}
                          value={formData.products}
                          onChange={(e) =>
                            setField("products", e.target.value)
                          }
                          placeholder="Sebutkan produk atau layanan utama yang Anda jual…"
                          className={`${formErrors.products ? inputErrorClass : inputClass} resize-none`}
                        />
                      </InputField>

                      <InputField
                        label="Deskripsi Bisnis"
                        required
                        error={formErrors.business_description}
                      >
                        <textarea
                          rows={3}
                          value={formData.business_description}
                          onChange={(e) =>
                            setField("business_description", e.target.value)
                          }
                          placeholder="Ceritakan singkat tentang bisnis Anda, keunggulan, dan target pelanggan…"
                          className={`${formErrors.business_description ? inputErrorClass : inputClass} resize-none`}
                        />
                      </InputField>

                      <div className="grid grid-cols-2 gap-4">
                        <InputField
                          label="Alamat Bisnis"
                          error={formErrors.business_address}
                        >
                          <input
                            type="text"
                            value={formData.business_address}
                            onChange={(e) =>
                              setField("business_address", e.target.value)
                            }
                            placeholder="Jalan, Kecamatan…"
                            className={
                              formErrors.business_address
                                ? inputErrorClass
                                : inputClass
                            }
                          />
                        </InputField>

                        <InputField
                          label="Jam Operasional"
                          error={formErrors.business_hours}
                        >
                          <input
                            type="text"
                            value={formData.business_hours}
                            onChange={(e) =>
                              setField("business_hours", e.target.value)
                            }
                            placeholder="Contoh: 08.00–21.00"
                            className={
                              formErrors.business_hours
                                ? inputErrorClass
                                : inputClass
                            }
                          />
                        </InputField>
                      </div>

                      <InputField
                        label="Instagram Bisnis"
                        error={formErrors.business_instagram}
                      >
                        <input
                          type="text"
                          value={formData.business_instagram}
                          onChange={(e) =>
                            setField("business_instagram", e.target.value)
                          }
                          placeholder="@namabisnis"
                          className={
                            formErrors.business_instagram
                              ? inputErrorClass
                              : inputClass
                          }
                        />
                      </InputField>
                    </div>
                  </div>

                  {/* Preferensi Website */}
                  <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                    <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-[#2563EB]">
                      Preferensi Website
                    </h3>
                    <div className="space-y-4">
                      <InputField
                        label="Style Website yang Diinginkan"
                        required
                        error={formErrors.website_style}
                      >
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                          {WEBSITE_STYLES.map((style) => (
                            <button
                              key={style}
                              type="button"
                              onClick={() => setField("website_style", style)}
                              className={`rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-200 ${
                                formData.website_style === style
                                  ? "bg-[#2563EB] text-white shadow-sm"
                                  : "bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#ECECEE]"
                              }`}
                            >
                              {style}
                            </button>
                          ))}
                        </div>
                      </InputField>

                      <InputField
                        label="Warna / Tema Utama Brand"
                        error={formErrors.website_colors}
                      >
                        <input
                          type="text"
                          value={formData.website_colors}
                          onChange={(e) =>
                            setField("website_colors", e.target.value)
                          }
                          placeholder="Contoh: Hijau & Putih, Merah & Emas…"
                          className={
                            formErrors.website_colors
                              ? inputErrorClass
                              : inputClass
                          }
                        />
                      </InputField>

                      <InputField
                        label="Referensi Website"
                        error={formErrors.website_reference}
                      >
                        <input
                          type="text"
                          value={formData.website_reference}
                          onChange={(e) =>
                            setField("website_reference", e.target.value)
                          }
                          placeholder="Link website yang Anda sukai (opsional)"
                          className={
                            formErrors.website_reference
                              ? inputErrorClass
                              : inputClass
                          }
                        />
                      </InputField>
                    </div>
                  </div>

                  {/* Catatan Tambahan */}
                  <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                    <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-[#2563EB]">
                      Catatan Tambahan
                    </h3>
                    <InputField label="Catatan" error={formErrors.notes}>
                      <textarea
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setField("notes", e.target.value)}
                        placeholder="Ada hal lain yang ingin kami ketahui? (opsional)"
                        className={`${formErrors.notes ? inputErrorClass : inputClass} resize-none`}
                      />
                    </InputField>
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmitForm}
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#16A34A] px-4 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#15803d] hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                    {submitting ? "Mengirim…" : "Kirim Pendaftaran"}
                  </button>

                  <p className="pb-4 text-center text-xs text-[#6E6E73]">
                    Data Anda aman dan hanya digunakan untuk pembuatan website
                  </p>
                </div>
              </>
            )}

            {/* ── Success ── */}
            {view === "success" && (
              <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#16A34A]/10">
                  <CheckCircle2 className="h-10 w-10 text-[#16A34A]" />
                </div>

                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-[#1D1D1F]">
                    Pendaftaran Berhasil!
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#6E6E73]">
                    Data Anda sudah kami terima. Tim Jirokit akan segera
                    memproses dan menghubungi Anda.
                  </p>
                </div>

                <div className="w-full rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{event.emoji}</span>
                    <div className="text-left">
                      <p className="text-xs text-[#6E6E73]">Program terdaftar</p>
                      <p className="text-sm font-semibold text-[#1D1D1F]">
                        {event.title}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between rounded-xl bg-[#F5F5F7] px-3 py-2 text-sm">
                    <span className="text-[#6E6E73]">Total Pembayaran</span>
                    <span className="font-semibold text-[#16A34A]">GRATIS</span>
                  </div>
                </div>

                <div className="w-full rounded-3xl bg-[#F5F5F7] p-5">
                  <p className="text-sm font-medium text-[#1D1D1F]">
                    Langkah Selanjutnya
                  </p>
                  <ol className="mt-3 space-y-2">
                    {[
                      "Tim kami akan meninjau data bisnis Anda",
                      "Proses desain website dimulai (estimasi 3–5 hari kerja)",
                      "Hubungi WhatsApp kami untuk info lebih lanjut",
                    ].map((step, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-sm text-[#6E6E73]"
                      >
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-[#2563EB] shadow-sm">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <a
                  href={buildSuccessWaUrl(event, formData.customer_name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#16A34A] px-4 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#15803d] hover:scale-[1.01] active:scale-[0.99]"
                >
                  <MessageCircle className="h-5 w-5" />
                  Hubungi WhatsApp untuk Info Lanjut
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

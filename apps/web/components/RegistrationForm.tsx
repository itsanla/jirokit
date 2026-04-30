"use client";

import { useState, FormEvent } from "react";

const WHATSAPP_NUMBER = "6285122359597";

type BusinessType =
  | "Kuliner"
  | "Kecantikan"
  | "Kesehatan"
  | "Fashion"
  | "Pendidikan"
  | "Lainnya";

type PackageChoice = "Standar" | "Starter" | "Professional";

interface FormState {
  fullName: string;
  businessName: string;
  businessType: BusinessType | "";
  city: string;
  whatsapp: string;
  inviteCode: string;
  packageChoice: PackageChoice | "";
  story: string;
}

const BUSINESS_TYPES: { value: BusinessType; label: string }[] = [
  { value: "Kuliner", label: "Kuliner (cafe, warung, restoran)" },
  { value: "Kecantikan", label: "Kecantikan (salon, barbershop, spa)" },
  { value: "Kesehatan", label: "Kesehatan (klinik, apotek)" },
  { value: "Fashion", label: "Fashion (toko baju, konveksi)" },
  { value: "Pendidikan", label: "Pendidikan (les, bimbel, kursus)" },
  { value: "Lainnya", label: "Lainnya" },
];

const PACKAGE_OPTIONS: { value: PackageChoice; label: string; sub: string }[] = [
  { value: "Standar", label: "Standar", sub: "Gratis dengan kode" },
  { value: "Starter", label: "Starter", sub: "Rp 499.000" },
  { value: "Professional", label: "Professional", sub: "Rp 999.000" },
];

const initialState: FormState = {
  fullName: "",
  businessName: "",
  businessType: "",
  city: "",
  whatsapp: "",
  inviteCode: "",
  packageChoice: "",
  story: "",
};

function buildWhatsAppMessage(data: FormState): string {
  const lines = [
    "Halo Jirokit! Saya ingin mendaftar program Digitalisasi UMKM Nusantara.",
    "",
    `*Nama Lengkap:* ${data.fullName}`,
    `*Nama Bisnis:* ${data.businessName}`,
    `*Jenis Bisnis:* ${data.businessType}`,
    `*Kota/Daerah:* ${data.city}`,
    `*Nomor WhatsApp:* ${data.whatsapp}`,
    `*Paket yang Diminati:* ${data.packageChoice}`,
  ];

  if (data.inviteCode.trim()) {
    lines.push(`*Kode Undangan:* ${data.inviteCode.trim()}`);
    lines.push("(Mohon verifikasi kode undangan saya untuk paket gratis)");
  }

  if (data.story.trim()) {
    lines.push("", `*Tentang Bisnis:*`, data.story.trim());
  }

  lines.push("", "Mohon informasi lebih lanjut. Terima kasih!");
  return lines.join("\n");
}

const inputClasses =
  "w-full rounded-xl border-0 bg-[#F5F5F7] px-4 py-3 text-sm text-[#1D1D1F] placeholder:text-[#6E6E73] focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all duration-200";

const labelClasses = "block text-sm font-medium text-[#1D1D1F] mb-1.5";

export default function RegistrationForm() {
  const [data, setData] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!data.fullName.trim()) next.fullName = "Nama lengkap wajib diisi";
    if (!data.businessName.trim()) next.businessName = "Nama bisnis wajib diisi";
    if (!data.businessType) next.businessType = "Pilih jenis bisnis";
    if (!data.city.trim()) next.city = "Kota wajib diisi";
    if (!data.whatsapp.trim()) {
      next.whatsapp = "Nomor WhatsApp wajib diisi";
    } else if (!/^[0-9+\s-]{8,}$/.test(data.whatsapp.trim())) {
      next.whatsapp = "Format nomor tidak valid";
    }
    if (!data.packageChoice) next.packageChoice = "Pilih paket yang diminati";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const message = buildWhatsAppMessage(data);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    setTimeout(() => {
      window.open(url, "_blank", "noopener,noreferrer");
      setSubmitting(false);
    }, 400);
  };

  return (
    <section id="daftar" className="bg-[#F5F5F7] py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[#1D1D1F] sm:text-4xl">
              Daftar Sekarang
            </h2>
            <p className="mt-3 text-base text-[#6E6E73] sm:text-lg">
              Isi form di bawah dan kami akan menghubungi Anda dalam 24 jam
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-10 rounded-3xl bg-white p-6 shadow-md ring-1 ring-black/5 sm:p-8 lg:p-10"
          >
            <div className="space-y-5">
              <div>
                <label htmlFor="fullName" className={labelClasses}>
                  Nama Lengkap Pemilik
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={data.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  placeholder="Contoh: Andi Wijaya"
                  className={inputClasses}
                  autoComplete="name"
                />
                {errors.fullName && (
                  <p className="mt-1.5 text-xs text-red-600">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label htmlFor="businessName" className={labelClasses}>
                  Nama Bisnis
                </label>
                <input
                  id="businessName"
                  type="text"
                  value={data.businessName}
                  onChange={(e) => update("businessName", e.target.value)}
                  placeholder="Contoh: Warung Makan Sederhana"
                  className={inputClasses}
                />
                {errors.businessName && (
                  <p className="mt-1.5 text-xs text-red-600">{errors.businessName}</p>
                )}
              </div>

              <div>
                <label htmlFor="businessType" className={labelClasses}>
                  Jenis Bisnis
                </label>
                <select
                  id="businessType"
                  value={data.businessType}
                  onChange={(e) =>
                    update("businessType", e.target.value as BusinessType | "")
                  }
                  className={`${inputClasses} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22%236E6E73%22 viewBox=%220 0 20 20%22><path fill-rule=%22evenodd%22 d=%22M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z%22 clip-rule=%22evenodd%22/></svg>')] bg-[position:right_1rem_center] bg-no-repeat pr-10`}
                >
                  <option value="">Pilih jenis bisnis Anda</option>
                  {BUSINESS_TYPES.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.businessType && (
                  <p className="mt-1.5 text-xs text-red-600">{errors.businessType}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="city" className={labelClasses}>
                    Kota/Daerah
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={data.city}
                    onChange={(e) => update("city", e.target.value)}
                    placeholder="Contoh: Padang"
                    className={inputClasses}
                  />
                  {errors.city && (
                    <p className="mt-1.5 text-xs text-red-600">{errors.city}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="whatsapp" className={labelClasses}>
                    Nomor WhatsApp Aktif
                  </label>
                  <input
                    id="whatsapp"
                    type="tel"
                    value={data.whatsapp}
                    onChange={(e) => update("whatsapp", e.target.value)}
                    placeholder="0812xxxxxxxx"
                    className={inputClasses}
                    autoComplete="tel"
                  />
                  {errors.whatsapp && (
                    <p className="mt-1.5 text-xs text-red-600">{errors.whatsapp}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="inviteCode" className={labelClasses}>
                  Kode Undangan{" "}
                  <span className="font-normal text-[#6E6E73]">(opsional)</span>
                </label>
                <input
                  id="inviteCode"
                  type="text"
                  value={data.inviteCode}
                  onChange={(e) => update("inviteCode", e.target.value)}
                  placeholder="Masukkan kode jika ada"
                  className={inputClasses}
                />
              </div>

              <div>
                <span className={labelClasses}>Paket yang Diminati</span>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  {PACKAGE_OPTIONS.map((opt) => {
                    const selected = data.packageChoice === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className={`flex cursor-pointer flex-col rounded-2xl px-4 py-3 transition-all duration-300 ${
                          selected
                            ? "bg-[#2563EB] text-white shadow-sm"
                            : "bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#ECECEE]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="packageChoice"
                          value={opt.value}
                          checked={selected}
                          onChange={() =>
                            update("packageChoice", opt.value)
                          }
                          className="sr-only"
                        />
                        <span className="text-sm font-medium">{opt.label}</span>
                        <span
                          className={`text-xs ${
                            selected ? "text-white/80" : "text-[#6E6E73]"
                          }`}
                        >
                          {opt.sub}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {errors.packageChoice && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {errors.packageChoice}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="story" className={labelClasses}>
                  Ceritakan Bisnis Anda Singkat{" "}
                  <span className="font-normal text-[#6E6E73]">(opsional)</span>
                </label>
                <textarea
                  id="story"
                  value={data.story}
                  onChange={(e) => update("story", e.target.value)}
                  rows={4}
                  placeholder="Apa yang dijual, target pelanggan, sudah berapa lama beroperasi..."
                  className={`${inputClasses} resize-none`}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1D1D1F] px-4 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.01] hover:bg-black disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.99]"
                >
                  {submitting ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      Mengarahkan ke WhatsApp...
                    </>
                  ) : (
                    <>Kirim via WhatsApp →</>
                  )}
                </button>
                <p className="mt-3 text-center text-xs text-[#6E6E73]">
                  Dengan mendaftar, Anda menyetujui syarat dan ketentuan Jirokit
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

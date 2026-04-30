"use client";

interface PricingToggleProps {
  showEventPrice: boolean;
  onToggle: (next: boolean) => void;
}

export default function PricingToggle({ showEventPrice, onToggle }: PricingToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-white p-1 shadow-sm ring-1 ring-black/5">
      <button
        type="button"
        onClick={() => onToggle(false)}
        aria-pressed={!showEventPrice}
        className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-300 sm:text-sm ${
          !showEventPrice
            ? "bg-[#1D1D1F] text-white shadow-sm"
            : "text-[#6E6E73] hover:text-[#1D1D1F]"
        }`}
      >
        Harga Normal
      </button>
      <button
        type="button"
        onClick={() => onToggle(true)}
        aria-pressed={showEventPrice}
        className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-300 sm:text-sm ${
          showEventPrice
            ? "bg-[#2563EB] text-white shadow-sm"
            : "text-[#6E6E73] hover:text-[#1D1D1F]"
        }`}
      >
        Harga Event
        <span
          className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
            showEventPrice ? "bg-white/20 text-white" : "bg-[#2563EB]/10 text-[#2563EB]"
          }`}
        >
          PROMO
        </span>
      </button>
    </div>
  );
}

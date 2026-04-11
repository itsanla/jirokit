"use client";

import { CheckIcon } from "@heroicons/react/24/solid";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  ctaText?: string;
  ctaHref?: string;
}

export default function PricingCard({
  title,
  price,
  period,
  description,
  features,
  popular = false,
  ctaText = "Pilih Paket",
  ctaHref = "#",
}: PricingCardProps) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border-2 bg-white p-8 shadow-lg transition-all hover:shadow-xl ${
        popular
          ? "border-orange-500 ring-4 ring-orange-100"
          : "border-gray-200"
      }`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-orange-500 px-4 py-1 text-sm font-semibold text-white">
            Paling Populer
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline">
          <span className="text-5xl font-bold text-gray-900">{price}</span>
          <span className="ml-2 text-lg text-gray-500">{period}</span>
        </div>
      </div>

      <ul className="mb-8 flex-1 space-y-3">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <CheckIcon className="h-5 w-5 shrink-0 text-green-500" />
            <span className="text-sm text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>

      <a href={ctaHref} className="block">
        <InteractiveHoverButton className="w-full">
          <span className="px-6 py-3">{ctaText}</span>
        </InteractiveHoverButton>
      </a>
    </div>
  );
}

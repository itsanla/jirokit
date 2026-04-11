"use client";

import React from "react";
import type { FormatOption } from "@/lib/converter/types";

interface FormatSelectorProps {
  label: string;
  formats: FormatOption[];
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export default function FormatSelector({
  label,
  formats,
  value,
  onChange,
  disabled,
}: FormatSelectorProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-900 shadow-sm transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none disabled:opacity-50"
      >
        <option value="" disabled>
          Pilih format…
        </option>
        {formats.map((f) => (
          <option key={f.value} value={f.value}>
            {f.label} (.{f.ext})
          </option>
        ))}
      </select>
    </div>
  );
}

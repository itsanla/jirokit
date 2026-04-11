"use client";

import React, { useState } from "react";
import { Compare } from "@/components/ui/compare";
import { humanFileSize } from "@/lib/converter/types";
import type { OutputFormat } from "@/lib/background-remover/engine";

interface ResultPanelProps {
  originalUrl: string;
  resultUrl: string;
  resultBlob: Blob;
  fileName: string;
  outputFormat: OutputFormat;
}

export default function ResultPanel({
  originalUrl,
  resultUrl,
  resultBlob,
  fileName,
  outputFormat,
}: ResultPanelProps) {
  const [viewMode, setViewMode] = useState<"compare" | "result" | "original">(
    "compare"
  );

  return (
    <div className="space-y-4">
      {/* View mode tabs */}
      <div className="flex items-center justify-center gap-1 rounded-xl bg-gray-100 p-1">
        {(
          [
            { key: "compare", label: "Perbandingan" },
            { key: "result", label: "Hasil" },
            { key: "original", label: "Asli" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setViewMode(tab.key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              viewMode === tab.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* View area */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        {viewMode === "compare" ? (
          <div className="flex items-center justify-center bg-[repeating-conic-gradient(#f3f4f6_0%_25%,#fff_0%_50%)] bg-[length:20px_20px] p-4">
            <Compare
              firstImage={resultUrl}
              secondImage={originalUrl}
              className="aspect-auto h-auto max-h-[450px] w-full max-w-full rounded-2xl"
              firstImageClassName="object-contain"
              secondImageClassname="object-contain"
              slideMode="drag"
              showHandlebar={true}
              initialSliderPercentage={50}
            />
          </div>
        ) : (
          <div className="relative flex items-center justify-center bg-[repeating-conic-gradient(#f3f4f6_0%_25%,#fff_0%_50%)] bg-[length:20px_20px] p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={viewMode === "result" ? resultUrl : originalUrl}
              alt={viewMode === "result" ? "Hasil" : "Asli"}
              className="max-h-[450px] max-w-full rounded-lg object-contain"
            />
          </div>
        )}

        {/* Info bar */}
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2">
          <div>
            <p className="text-sm font-medium text-gray-700">
              {viewMode === "compare"
                ? "Geser untuk membandingkan"
                : viewMode === "result"
                  ? "Hasil Background Removal"
                  : "Gambar Asli"}
            </p>
            <p className="text-xs text-gray-400">
              Ukuran hasil: {humanFileSize(resultBlob.size)} •{" "}
              {outputFormat === "image/jpeg"
                ? "JPG"
                : outputFormat === "image/webp"
                  ? "WebP"
                  : "PNG"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

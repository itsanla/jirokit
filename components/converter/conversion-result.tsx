"use client";

import React from "react";
import {
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import { humanFileSize } from "@/lib/converter/types";

interface ConversionResultProps {
  blob: Blob | undefined;
  fileName: string;
  error?: string;
}

export default function ConversionResult({
  blob,
  fileName,
  error,
}: ConversionResultProps) {
  const handleDownload = () => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 ring-1 ring-red-100">
        <ExclamationTriangleIcon className="h-6 w-6 shrink-0 text-red-500" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-red-800">Konversi Gagal</p>
          <p className="mt-0.5 text-xs text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!blob) return null;

  return (
    <div className="flex items-center gap-3 rounded-xl bg-green-50 p-4 ring-1 ring-green-100">
      <CheckCircleIcon className="h-6 w-6 shrink-0 text-green-500" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-green-800">{fileName}</p>
        <p className="mt-0.5 text-xs text-green-600">{humanFileSize(blob.size)}</p>
      </div>
      <button
        onClick={handleDownload}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700"
      >
        <ArrowDownTrayIcon className="h-4 w-4" />
        Download
      </button>
    </div>
  );
}

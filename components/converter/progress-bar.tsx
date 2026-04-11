"use client";

import React from "react";

interface ProgressBarProps {
  progress: number; // 0-100
  status: string;
  fileName?: string;
}

export default function ProgressBar({ progress, status, fileName }: ProgressBarProps) {
  const isError = status === "error";
  const isDone = status === "done";

  return (
    <div className="w-full rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      {fileName && (
        <p className="mb-2 truncate text-sm font-medium text-gray-700">
          {fileName}
        </p>
      )}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${
            isError
              ? "bg-red-500"
              : isDone
              ? "bg-green-500"
              : "bg-orange-500"
          }`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <p
          className={`text-xs font-medium ${
            isError ? "text-red-600" : isDone ? "text-green-600" : "text-gray-500"
          }`}
        >
          {isError
            ? "Gagal"
            : isDone
            ? "Selesai!"
            : status === "processing"
            ? "Memproses..."
            : "Menunggu..."}
        </p>
        <p className="text-xs font-semibold text-gray-700">{Math.round(progress)}%</p>
      </div>
    </div>
  );
}

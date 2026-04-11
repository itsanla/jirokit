"use client";

import React, { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import {
  ArrowUpTrayIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import {
  BoltIcon,
  SparklesIcon,
  ArrowDownTrayIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/solid";
import ProgressBar from "@/components/converter/progress-bar";
import ResultPanel from "@/components/background-remover/result-panel";
import {
  removeImageBackground,
  type ModelQuality,
  type OutputType,
  type OutputFormat,
  type MaxSizePreset,
  type RemovalProgress,
  type RemovalResult,
  MAX_SIZE_OPTIONS,
} from "@/lib/background-remover/engine";
import { humanFileSize } from "@/lib/converter/types";

type ProcessingStatus = "idle" | "processing" | "done" | "error";

export default function RemoverPanel() {
  // ─── State ─────────────────────────────────────────────────────────
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [progress, setProgress] = useState<RemovalProgress>({
    phase: "",
    percent: 0,
  });
  const [result, setResult] = useState<RemovalResult | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ─── Options ─────────────────────────────────────────────────────
  const [model, setModel] = useState<ModelQuality>("fast");
  const [outputType, setOutputType] = useState<OutputType>("foreground");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("image/png");
  const [maxSize, setMaxSize] = useState<MaxSizePreset>("medium");

  const abortRef = useRef(false);

  // ─── Dropzone ──────────────────────────────────────────────────────
  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length === 0) return;
    const f = accepted[0];

    // Cleanup previous
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setStatus("idle");
    setResult(null);
    setResultUrl(null);
    setError(null);
    setProgress({ phase: "", percent: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
      "image/bmp": [".bmp"],
    },
    multiple: false,
    maxSize: 50 * 1024 * 1024, // 50 MB — reasonable for BG removal
    disabled: status === "processing",
  });

  // ─── Process ───────────────────────────────────────────────────────
  const handleProcess = async () => {
    if (!file) return;

    abortRef.current = false;
    setStatus("processing");
    setError(null);
    setResult(null);
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      setResultUrl(null);
    }

    try {
      const res = await removeImageBackground(file, {
        model,
        outputType,
        outputFormat,
        maxSize,
        onProgress: (p) => {
          if (!abortRef.current) setProgress(p);
        },
      });

      if (abortRef.current) return;

      setResult(res);
      setResultUrl(URL.createObjectURL(res.blob));
      setStatus("done");
    } catch (err) {
      if (abortRef.current) return;
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui"
      );
      setStatus("error");
    }
  };

  // ─── Reset ─────────────────────────────────────────────────────────
  const handleReset = () => {
    abortRef.current = true;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    setFile(null);
    setPreviewUrl(null);
    setStatus("idle");
    setResult(null);
    setResultUrl(null);
    setError(null);
    setProgress({ phase: "", percent: 0 });
  };

  // ─── Download ──────────────────────────────────────────────────────
  const handleDownload = () => {
    if (!result || !resultUrl || !file) return;

    const ext =
      outputFormat === "image/jpeg"
        ? "jpg"
        : outputFormat === "image/webp"
          ? "webp"
          : "png";
    const baseName = file.name.replace(/\.[^.]+$/, "");
    const fileName = `${baseName}-no-bg.${ext}`;

    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // ─── Render: No file selected ──────────────────────────────────────
  if (!file) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <div
          {...getRootProps()}
          className={`group relative flex min-h-[280px] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200 ${
            isDragActive
              ? "border-orange-500 bg-orange-50"
              : "border-gray-300 bg-gray-50 hover:border-orange-400 hover:bg-orange-50/50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            <div
              className={`rounded-2xl p-4 transition-colors ${
                isDragActive
                  ? "bg-orange-100"
                  : "bg-gray-100 group-hover:bg-orange-100"
              }`}
            >
              <ArrowUpTrayIcon
                className={`h-8 w-8 transition-colors ${
                  isDragActive
                    ? "text-orange-500"
                    : "text-gray-400 group-hover:text-orange-500"
                }`}
              />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-700">
                {isDragActive
                  ? "Lepaskan gambar di sini..."
                  : "Seret & lepas foto ke sini"}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                atau{" "}
                <span className="font-medium text-orange-500">
                  klik untuk memilih
                </span>{" "}
                • PNG, JPG, WEBP, BMP • Maks 50 MB
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Render: File selected ─────────────────────────────────────────
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Options bar */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* Model quality */}
        <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-sm ring-1 ring-gray-100">
          <span className="text-xs font-medium text-gray-500">Model:</span>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value as ModelQuality)}
            disabled={status === "processing"}
            className="rounded-lg border-0 bg-gray-50 px-2 py-1 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
          >
            <option value="fast">⚡ Cepat (~40 MB)</option>
            <option value="quality">✨ Kualitas Tinggi (~80 MB)</option>
          </select>
        </div>

        {/* Output type */}
        <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-sm ring-1 ring-gray-100">
          <span className="text-xs font-medium text-gray-500">Output:</span>
          <select
            value={outputType}
            onChange={(e) => setOutputType(e.target.value as OutputType)}
            disabled={status === "processing"}
            className="rounded-lg border-0 bg-gray-50 px-2 py-1 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
          >
            <option value="foreground">Hapus Background</option>
            <option value="background">Hapus Foreground</option>
            <option value="mask">Mask Saja</option>
          </select>
        </div>

        {/* Output format */}
        <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-sm ring-1 ring-gray-100">
          <span className="text-xs font-medium text-gray-500">Format:</span>
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
            disabled={status === "processing"}
            className="rounded-lg border-0 bg-gray-50 px-2 py-1 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
          >
            <option value="image/png">PNG</option>
            <option value="image/jpeg">JPG</option>
            <option value="image/webp">WebP</option>
          </select>
        </div>

        {/* Max size / quality-speed tradeoff */}
        <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-sm ring-1 ring-gray-100">
          <span className="text-xs font-medium text-gray-500">Ukuran:</span>
          <select
            value={maxSize}
            onChange={(e) => setMaxSize(e.target.value as MaxSizePreset)}
            disabled={status === "processing"}
            className="rounded-lg border-0 bg-gray-50 px-2 py-1 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
            title={MAX_SIZE_OPTIONS[maxSize].desc}
          >
            {Object.entries(MAX_SIZE_OPTIONS).map(([key, opt]) => (
              <option key={key} value={key}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Preview & Result area */}
      {status === "done" && previewUrl && resultUrl ? (
        <ResultPanel
          originalUrl={previewUrl}
          resultUrl={resultUrl}
          resultBlob={result!.blob}
          fileName={file.name}
          outputFormat={outputFormat}
        />
      ) : (
        /* Original image preview */
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="relative flex items-center justify-center bg-[repeating-conic-gradient(#f3f4f6_0%_25%,#fff_0%_50%)] bg-[length:20px_20px] p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl!}
              alt="Preview"
              className="max-h-[400px] max-w-full rounded-lg object-contain"
            />
          </div>
          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-700">
                {file.name}
              </p>
              <p className="text-xs text-gray-400">{humanFileSize(file.size)}</p>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Ganti
            </button>
          </div>
        </div>
      )}

      {/* Progress bar */}
      {status === "processing" && (
        <div className="space-y-2">
          <ProgressBar
            progress={progress.percent}
            status="processing"
            fileName={progress.phase}
          />
          <p className="text-center text-xs text-gray-400">
            ⏳ Proses pertama kali lebih lama karena mengunduh model AI (~
            {model === "fast" ? "40" : "80"} MB). Proses berikutnya akan
            jauh lebih cepat karena model di-cache oleh browser.
            {maxSize !== "original" && " Gambar dikecilkan otomatis untuk mempercepat proses."}
          </p>
        </div>
      )}

      {/* Error display */}
      {status === "error" && error && (
        <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 ring-1 ring-red-100">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-red-800">Proses Gagal</p>
            <p className="mt-0.5 text-xs text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {status !== "done" && (
            <button
              onClick={handleProcess}
              disabled={status === "processing"}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-gray-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "processing" ? (
                <>
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  Memproses...
                </>
              ) : status === "error" ? (
                <>
                  <ArrowUturnLeftIcon className="h-5 w-5" />
                  Coba Lagi
                </>
              ) : (
                <>
                  <SparklesIcon className="h-5 w-5" />
                  Hapus Background
                </>
              )}
            </button>
          )}

          {status === "done" && (
            <>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-green-700 hover:shadow-xl"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                Download Hasil
              </button>
              <button
                onClick={() => {
                  setStatus("idle");
                  setResult(null);
                  if (resultUrl) URL.revokeObjectURL(resultUrl);
                  setResultUrl(null);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200 transition-all hover:bg-gray-50"
              >
                <ArrowPathIcon className="h-5 w-5" />
                Proses Ulang
              </button>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200 transition-all hover:bg-gray-50"
              >
                <ArrowUpTrayIcon className="h-5 w-5" />
                Gambar Baru
              </button>
            </>
          )}
        </div>

        <p className="text-center text-xs text-gray-400">
          🔒 Foto Anda tidak pernah dikirim ke server — semua proses 100% di
          browser menggunakan AI (ONNX Runtime).
        </p>
      </div>
    </div>
  );
}

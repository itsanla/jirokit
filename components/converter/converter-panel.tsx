"use client";

import React, { useState, useCallback } from "react";
import {
  ArrowsRightLeftIcon,
  BoltIcon,
} from "@heroicons/react/24/solid";
import ConverterDropzone from "./dropzone";
import FormatSelector from "./format-selector";
import ProgressBar from "./progress-bar";
import ConversionResult from "./conversion-result";
import type { ConverterCategory } from "@/lib/converter/types";
import {
  getFormatsForCategory,
  detectFormat,
  generateId,
} from "@/lib/converter/types";
import { runConversion, getAcceptedMimes } from "@/lib/converter";

interface JobState {
  id: string;
  file: File;
  status: "pending" | "processing" | "done" | "error";
  progress: number;
  result?: Blob;
  resultName?: string;
  error?: string;
}

interface ConverterPanelProps {
  category: ConverterCategory;
  categoryLabel: string;
}

export default function ConverterPanel({ category, categoryLabel }: ConverterPanelProps) {
  const formats = getFormatsForCategory(category);
  const accept = getAcceptedMimes(category);

  const [files, setFiles] = useState<File[]>([]);
  const [fromFormat, setFromFormat] = useState("");
  const [toFormat, setToFormat] = useState("");
  const [jobs, setJobs] = useState<JobState[]>([]);
  const [converting, setConverting] = useState(false);

  const handleFilesSelected = useCallback(
    (selected: File[]) => {
      setFiles(selected);
      setJobs([]);
      // Auto-detect from format
      if (selected.length > 0) {
        const detected = detectFormat(selected[0]);
        setFromFormat(detected);
        // If there's only one possible target, auto-select
        if (toFormat === detected) setToFormat("");
      }
    },
    [toFormat]
  );

  const handleConvert = async () => {
    if (files.length === 0 || !toFormat) return;
    setConverting(true);

    const newJobs: JobState[] = files.map((f) => ({
      id: generateId(),
      file: f,
      status: "pending" as const,
      progress: 0,
    }));
    setJobs(newJobs);

    for (let i = 0; i < newJobs.length; i++) {
      const job = newJobs[i];

      // Update status to processing
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, status: "processing" } : j))
      );

      try {
        const result = await runConversion(
          {
            id: job.id,
            file: job.file,
            fromFormat,
            toFormat,
            category,
            status: "processing",
            progress: 0,
          },
          (pct) => {
            setJobs((prev) =>
              prev.map((j) => (j.id === job.id ? { ...j, progress: pct } : j))
            );
          }
        );

        const baseName = job.file.name.replace(/\.[^.]+$/, "");
        const resultName = `${baseName}.${result.ext}`;

        setJobs((prev) =>
          prev.map((j) =>
            j.id === job.id
              ? { ...j, status: "done", progress: 100, result: result.blob, resultName }
              : j
          )
        );

        // Auto-download
        const url = URL.createObjectURL(result.blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = resultName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } catch (err) {
        setJobs((prev) =>
          prev.map((j) =>
            j.id === job.id
              ? {
                  ...j,
                  status: "error",
                  error: err instanceof Error ? err.message : "Terjadi kesalahan",
                }
              : j
          )
        );
      }
    }

    setConverting(false);
  };

  const filteredTargets = formats.filter((f) => f.value !== fromFormat);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      {/* Dropzone */}
      <ConverterDropzone
        accept={accept}
        onFilesSelected={handleFilesSelected}
        categoryLabel={categoryLabel}
      />

      {/* Format selectors */}
      {files.length > 0 && (
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <FormatSelector
              label="Format Asal"
              formats={formats}
              value={fromFormat}
              onChange={setFromFormat}
              disabled={converting}
            />
          </div>
          <div className="flex h-11 items-center justify-center">
            <ArrowsRightLeftIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flex-1">
            <FormatSelector
              label="Konversi Ke"
              formats={filteredTargets}
              value={toFormat}
              onChange={setToFormat}
              disabled={converting}
            />
          </div>
        </div>
      )}

      {/* Convert button */}
      {files.length > 0 && toFormat && (
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleConvert}
            disabled={converting}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-gray-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
          >
            <BoltIcon className="h-5 w-5" />
            {converting ? "Memproses..." : `Konversi ${files.length} File`}
          </button>
          {category === "media" && (
            <p className="text-center text-xs text-gray-400">
              ⚡ Konversi media menggunakan FFmpeg WebAssembly. File besar membutuhkan
              waktu lebih lama tergantung perangkat Anda.
            </p>
          )}
          {category === "document" && (
            <p className="text-center text-xs text-gray-400">
              📄 Konversi dokumen menggunakan Pandoc WebAssembly (~56 MB). Muat pertama
              kali memerlukan waktu lebih lama untuk mengunduh engine.
            </p>
          )}
          <p className="text-center text-xs text-gray-400">
            🔒 File Anda tidak pernah dikirim ke server — semua proses 100% di browser.
          </p>
        </div>
      )}

      {/* Progress & Results */}
      {jobs.length > 0 && (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="space-y-2">
              {job.status === "processing" && (
                <ProgressBar
                  progress={job.progress}
                  status={job.status}
                  fileName={job.file.name}
                />
              )}
              {(job.status === "done" || job.status === "error") && (
                <ConversionResult
                  blob={job.result}
                  fileName={job.resultName || job.file.name}
                  error={job.error}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

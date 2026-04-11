"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  ArrowUpTrayIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import { humanFileSize } from "@/lib/converter/types";

interface ConverterDropzoneProps {
  accept: Record<string, string[]>;
  onFilesSelected: (files: File[]) => void;
  categoryLabel: string;
}

export default function ConverterDropzone({
  accept,
  onFilesSelected,
  categoryLabel,
}: ConverterDropzoneProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length > 0) onFilesSelected(accepted);
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      accept,
      multiple: true,
      maxSize: 500 * 1024 * 1024, // 500 MB
    });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`group relative flex min-h-[240px] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200 ${
          isDragActive
            ? "border-orange-500 bg-orange-50"
            : "border-gray-300 bg-gray-50 hover:border-orange-400 hover:bg-orange-50/50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3 p-8 text-center">
          <div
            className={`rounded-2xl p-4 transition-colors ${
              isDragActive ? "bg-orange-100" : "bg-gray-100 group-hover:bg-orange-100"
            }`}
          >
            <ArrowUpTrayIcon
              className={`h-8 w-8 transition-colors ${
                isDragActive ? "text-orange-500" : "text-gray-400 group-hover:text-orange-500"
              }`}
            />
          </div>
          <div>
            <p className="text-base font-semibold text-gray-700">
              {isDragActive
                ? "Lepaskan file di sini..."
                : `Seret & lepas file ${categoryLabel} ke sini`}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              atau <span className="font-medium text-orange-500">klik untuk memilih</span>{" "}
              • Maks 500 MB per file
            </p>
          </div>
        </div>
      </div>

      {/* File list preview */}
      {acceptedFiles.length > 0 && (
        <div className="mt-3 space-y-2">
          {acceptedFiles.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg bg-white px-4 py-2 shadow-sm ring-1 ring-gray-100"
            >
              <DocumentIcon className="h-5 w-5 shrink-0 text-gray-400" />
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-700">
                {file.name}
              </span>
              <span className="shrink-0 text-xs text-gray-400">
                {humanFileSize(file.size)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

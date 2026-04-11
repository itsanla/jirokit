// Central converter orchestrator — routes jobs to the right engine

import type { ConversionJob, ConverterCategory } from "./types";
import { convertImage } from "./image-engine";

export async function runConversion(
  job: ConversionJob,
  onProgress: (pct: number) => void
): Promise<{ blob: Blob; ext: string }> {
  switch (job.category) {
    case "image":
      return convertImage(job.file, job.toFormat, onProgress);

    case "document": {
      // Lazy load document engine (split into individual converters)
      const { convertDocument } = await import("./doc");
      return convertDocument(job.file, job.toFormat, onProgress);
    }

    case "media": {
      // Lazy load media engine (heavy FFmpeg wasm)
      const { convertMedia } = await import("./media-engine");
      return convertMedia(job.file, job.toFormat, onProgress);
    }

    default:
      throw new Error(`Kategori "${job.category}" tidak dikenal`);
  }
}

export function getAcceptedMimes(category: ConverterCategory): Record<string, string[]> {
  switch (category) {
    case "image":
      return {
        "image/png": [".png"],
        "image/jpeg": [".jpg", ".jpeg"],
        "image/webp": [".webp"],
        "image/bmp": [".bmp"],
        "image/gif": [".gif"],
      };
    case "document":
      return {
        "application/pdf": [".pdf"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
        "application/msword": [".doc"],
        "text/plain": [".txt"],
        "text/html": [".html", ".htm"],
        "text/markdown": [".md", ".markdown"],
      };
    case "media":
      return {
        "audio/mpeg": [".mp3"],
        "audio/wav": [".wav"],
        "audio/ogg": [".ogg"],
        "audio/flac": [".flac"],
        "audio/aac": [".aac"],
        "audio/mp4": [".m4a"],
        "video/mp4": [".mp4"],
        "video/webm": [".webm"],
        "video/x-msvideo": [".avi"],
        "video/quicktime": [".mov"],
        "video/x-matroska": [".mkv"],
      };
  }
}

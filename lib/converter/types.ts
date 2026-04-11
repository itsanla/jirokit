// Shared types for the converter feature

export type ConverterCategory = "image" | "document" | "media";

export interface FormatOption {
  value: string;
  label: string;
  mime: string;
  ext: string;
}

export interface ConversionJob {
  id: string;
  file: File;
  fromFormat: string;
  toFormat: string;
  category: ConverterCategory;
  status: "pending" | "processing" | "done" | "error";
  progress: number;
  result?: Blob;
  resultName?: string;
  error?: string;
}

export const IMAGE_FORMATS: FormatOption[] = [
  { value: "png", label: "PNG", mime: "image/png", ext: "png" },
  { value: "jpeg", label: "JPG", mime: "image/jpeg", ext: "jpg" },
  { value: "webp", label: "WEBP", mime: "image/webp", ext: "webp" },
  { value: "bmp", label: "BMP", mime: "image/bmp", ext: "bmp" },
];

export const DOCUMENT_FORMATS: FormatOption[] = [
  {
    value: "docx",
    label: "DOCX",
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ext: "docx",
  },
  { value: "txt", label: "TXT", mime: "text/plain", ext: "txt" },
  { value: "html", label: "HTML", mime: "text/html", ext: "html" },
  { value: "md", label: "Markdown", mime: "text/markdown", ext: "md" },
  { value: "pdf", label: "PDF", mime: "application/pdf", ext: "pdf" },
  { value: "jpg-pages", label: "JPG (screenshot)", mime: "image/jpeg", ext: "jpg" },
  { value: "png-pages", label: "PNG (screenshot)", mime: "image/png", ext: "png" },
  { value: "webp-pages", label: "WEBP (screenshot)", mime: "image/webp", ext: "webp" },
];

export const MEDIA_FORMATS: FormatOption[] = [
  { value: "mp3", label: "MP3", mime: "audio/mpeg", ext: "mp3" },
  { value: "wav", label: "WAV", mime: "audio/wav", ext: "wav" },
  { value: "ogg", label: "OGG", mime: "audio/ogg", ext: "ogg" },
  { value: "mp4", label: "MP4", mime: "video/mp4", ext: "mp4" },
  { value: "webm", label: "WEBM", mime: "video/webm", ext: "webm" },
  { value: "gif", label: "GIF", mime: "image/gif", ext: "gif" },
];

export function getFormatsForCategory(category: ConverterCategory): FormatOption[] {
  switch (category) {
    case "image":
      return IMAGE_FORMATS;
    case "document":
      return DOCUMENT_FORMATS;
    case "media":
      return MEDIA_FORMATS;
  }
}

export function detectFormat(file: File): string {
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const mimeMap: Record<string, string> = {
    png: "png",
    jpg: "jpeg",
    jpeg: "jpeg",
    webp: "webp",
    bmp: "bmp",
    gif: "gif",
    pdf: "pdf",
    docx: "docx",
    doc: "docx",
    txt: "txt",
    html: "html",
    htm: "html",
    md: "md",
    markdown: "md",
    mp3: "mp3",
    wav: "wav",
    ogg: "ogg",
    mp4: "mp4",
    webm: "webm",
    avi: "mp4",
    mov: "mp4",
    mkv: "mp4",
    flac: "wav",
    aac: "mp3",
    m4a: "mp3",
  };
  return mimeMap[ext] || ext;
}

export function detectCategory(file: File): ConverterCategory {
  const mime = file.type.toLowerCase();
  const ext = file.name.split(".").pop()?.toLowerCase() || "";

  if (
    mime.startsWith("image/") ||
    ["png", "jpg", "jpeg", "webp", "bmp", "gif", "svg", "avif", "heic"].includes(ext)
  ) {
    return "image";
  }
  if (
    mime.startsWith("video/") ||
    mime.startsWith("audio/") ||
    ["mp4", "webm", "avi", "mov", "mkv", "mp3", "wav", "ogg", "flac", "aac", "m4a"].includes(ext)
  ) {
    return "media";
  }
  return "document";
}

export function humanFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

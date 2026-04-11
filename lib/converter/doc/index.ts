// Document conversion router
// Routes document conversions through the best available engine per route.
//
// Architecture:
//  - DOCX ↔ HTML ↔ TXT ↔ Markdown: Pure Pandoc (excellent quality, ≥90%)
//  - DOCX → PDF: docx-preview → html2canvas → jsPDF (~85-90%)
//  - PDF → JPG: pdfjs-dist canvas rendering (pixel-perfect, ~90%)
//  - DOCX/HTML/TXT/MD → JPG/PNG/WEBP: Pandoc→HTML→html2canvas screenshot (~85-90%)
//  - PDF → text-based formats: REMOVED (accuracy <50%, planned for future)

import { pandocConvert, canPandocConvertDirect } from "./pandoc-engine";
import { pdfToJpg } from "./pdf-to-jpg";
import { docToImage, isDocImageFormat } from "./doc-to-image";
import { docToPdf, isDocToPdf } from "./doc-to-pdf";

export async function convertDocument(
  file: File,
  toFormat: string,
  onProgress: (pct: number) => void
): Promise<{ blob: Blob; ext: string }> {
  const fromExt = file.name.split(".").pop()?.toLowerCase() || "";
  onProgress(5);

  // Validate source format
  const SUPPORTED_SOURCES = new Set([
    "pdf", "docx", "doc", "txt", "html", "htm", "md", "markdown",
  ]);
  if (!SUPPORTED_SOURCES.has(fromExt)) {
    throw new Error(`Format sumber "${fromExt}" belum didukung`);
  }

  // ── PDF → JPG (canvas rendering via pdfjs-dist, pixel-perfect) ──
  if (fromExt === "pdf" && toFormat === "jpg-pages") {
    return pdfToJpg(file, onProgress);
  }

  // ── PDF can only convert to JPG for now ──
  if (fromExt === "pdf") {
    throw new Error(
      "Saat ini PDF hanya dapat dikonversi ke JPG. " +
      "Konversi PDF ke format teks akan tersedia di versi mendatang."
    );
  }

  // ── DOCX → PDF (docx-preview → html2canvas → jsPDF, ~85-90%) ──
  if (isDocToPdf(fromExt, toFormat)) {
    return docToPdf(file, onProgress);
  }

  // ── Document → Image screenshot (DOCX/HTML/TXT/MD → JPG/PNG/WEBP) ──
  if (isDocImageFormat(toFormat)) {
    return docToImage(file, toFormat, onProgress);
  }

  // ── Direct Pandoc conversions (DOCX ↔ HTML ↔ TXT ↔ Markdown) ──
  if (canPandocConvertDirect(fromExt, toFormat)) {
    return pandocConvert(file, toFormat, onProgress);
  }

  throw new Error(`Konversi "${fromExt}" → "${toFormat}" belum didukung`);
}

// Shared PDF utilities — pdfjs-dist v5 loader & helpers

import type { PDFDocumentProxy } from "pdfjs-dist";

const PDFJS_VERSION = "5.4.624";
const WORKER_CDN = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;

/**
 * Load a PDF from a File using pdfjs-dist v5.
 * Sets up the worker via CDN and returns a PDFDocumentProxy.
 */
export async function loadPdf(file: File): Promise<PDFDocumentProxy> {
  const pdfjsLib = await import("pdfjs-dist");

  // pdfjs-dist v5 requires a non-empty workerSrc.
  // Use the CDN-hosted worker matching our installed version.
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_CDN;
  }

  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjsLib.getDocument({
    data,
    useSystemFonts: true,
    // Disable features that require the worker to fetch resources
    useWorkerFetch: false,
    isEvalSupported: false,
  }).promise;

  return pdf;
}



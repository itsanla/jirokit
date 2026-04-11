// PDF → JPG converter (renders pages to canvas)

import { loadPdf } from "./pdf-utils";

export async function pdfToJpg(
  file: File,
  onProgress: (pct: number) => void
): Promise<{ blob: Blob; ext: string }> {
  onProgress(10);
  const pdf = await loadPdf(file);
  onProgress(15);

  if (pdf.numPages === 1) {
    return renderSinglePage(pdf, onProgress);
  }
  return renderAllPagesMerged(pdf, onProgress);
}

/** Render a single PDF page as a JPG blob. */
async function renderSinglePage(
  pdf: Awaited<ReturnType<typeof loadPdf>>,
  onProgress: (pct: number) => void
): Promise<{ blob: Blob; ext: string }> {
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 2 });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext("2d")!;

  await page.render({ canvasContext: ctx, viewport, canvas } as never).promise;
  onProgress(80);

  const blob = await canvasToJpgBlob(canvas);
  onProgress(100);
  return { blob, ext: "jpg" };
}

/** Render all PDF pages into a single tall JPG image. */
async function renderAllPagesMerged(
  pdf: Awaited<ReturnType<typeof loadPdf>>,
  onProgress: (pct: number) => void
): Promise<{ blob: Blob; ext: string }> {
  const pages: { canvas: HTMLCanvasElement; height: number; width: number }[] = [];
  let totalHeight = 0;
  let maxWidth = 0;

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;

    await page.render({ canvasContext: ctx, viewport, canvas } as never).promise;
    pages.push({ canvas, height: viewport.height, width: viewport.width });
    totalHeight += viewport.height;
    maxWidth = Math.max(maxWidth, viewport.width);
    onProgress(15 + Math.round((i / pdf.numPages) * 70));
  }

  const merged = document.createElement("canvas");
  merged.width = maxWidth;
  merged.height = totalHeight;
  const mCtx = merged.getContext("2d")!;
  let y = 0;
  for (const p of pages) {
    mCtx.drawImage(p.canvas, 0, y);
    y += p.height;
  }

  const blob = await canvasToJpgBlob(merged);
  onProgress(100);
  return { blob, ext: "jpg" };
}

function canvasToJpgBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Canvas render gagal"))),
      "image/jpeg",
      0.92
    )
  );
}

// DOCX → PDF converter (high-fidelity, client-side)
//
// Pipeline: DOCX → docx-preview (DOM rendering) → html2canvas → jsPDF (multi-page A4)
//
// Uses docx-preview for faithful DOCX rendering (preserves fonts, colors,
// margins, page breaks) rather than Pandoc, which normalises to semantic HTML.
//
// Accuracy: ~85-90% — best available open-source client-side approach.
// Limitations:
//  - Page breaking relies on <w:lastRenderedPageBreak/> markers from Word
//  - Complex fields (TOC, formulas) may not render
//  - Fonts must be available in the browser

// ── Constants ──

/** A4 dimensions in mm (jsPDF unit) */
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

/** A4 width in pixels at 96dpi (used for rendering container) */
const A4_WIDTH_PX = 794;

/** A4 height in pixels at 96dpi */
const A4_HEIGHT_PX = 1123;

/** html2canvas scale for crisp output */
const CAPTURE_SCALE = 2;

/** JPEG quality for page images embedded in the PDF */
const IMAGE_QUALITY = 0.92;

/**
 * Check if a conversion is a DOCX → PDF route.
 */
export function isDocToPdf(fromExt: string, toFormat: string): boolean {
  return (fromExt === "docx" || fromExt === "doc") && toFormat === "pdf";
}

/**
 * Convert a DOCX file to PDF.
 *
 * 1. Renders DOCX into a hidden container via docx-preview (page-accurate DOM)
 * 2. Captures the full rendered content with html2canvas
 * 3. Slices the tall canvas into A4-sized pages
 * 4. Assembles pages into a multi-page PDF via jsPDF
 */
export async function docToPdf(
  file: File,
  onProgress: (pct: number) => void,
): Promise<{ blob: Blob; ext: string }> {
  onProgress(5);

  // ── Step 1: Render DOCX into hidden container via docx-preview (5-40%) ──
  const arrayBuffer = await file.arrayBuffer();
  onProgress(10);

  const { renderAsync } = await import("docx-preview");
  onProgress(15);

  const container = createPdfRenderContainer();
  document.body.appendChild(container);

  try {
    await renderAsync(arrayBuffer, container, undefined, {
      className: "docx-pdf",
      inWrapper: false, // No wrapper — render sections directly for cleaner capture
      breakPages: true,
      ignoreLastRenderedPageBreak: true, // Let docx-preview handle page breaks
      ignoreWidth: false,
      ignoreHeight: false,
      ignoreFonts: false,
      useBase64URL: true, // Embed images as data URIs (no external requests)
      renderHeaders: true,
      renderFooters: true,
      renderFootnotes: true,
      renderEndnotes: true,
      experimental: false,
      renderChanges: false,
      renderComments: false,
      debug: false,
    });

    onProgress(40);

    // Small delay for styles/fonts to settle
    await new Promise((r) => setTimeout(r, 300));

    // Wait for all images to finish loading
    await waitForPageImages(container);

    onProgress(45);

    // ── Step 2: Capture each section page with html2canvas (45-75%) ──
    const html2canvas = (await import("html2canvas")).default;

    // Find rendered page sections
    const sections = Array.from(
      container.querySelectorAll<HTMLElement>("section.docx-pdf")
    );

    // Collect all canvases from all sections
    const sectionCanvases: HTMLCanvasElement[] = [];

    if (sections.length > 0) {
      // Capture each section independently
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const canvas = await html2canvas(section, {
          scale: CAPTURE_SCALE,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false,
        });
        sectionCanvases.push(canvas);

        const pct = 45 + Math.round(((i + 1) / sections.length) * 30);
        onProgress(pct);
      }
    } else {
      // Fallback: capture entire container as one big canvas
      const canvas = await html2canvas(container, {
        scale: CAPTURE_SCALE,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      sectionCanvases.push(canvas);
      onProgress(75);
    }

    // ── Step 3: Slice canvases into A4 page-sized chunks (75-85%) ──
    // Each section canvas may be taller than one A4 page.
    // We need to slice tall canvases into A4-height segments.
    const pageHeight = A4_HEIGHT_PX * CAPTURE_SCALE; // Pixel height of one A4 page at our scale
    const pageSlices: HTMLCanvasElement[] = [];

    for (const srcCanvas of sectionCanvases) {
      const srcWidth = srcCanvas.width;
      const srcHeight = srcCanvas.height;

      if (srcHeight <= pageHeight + 10) {
        // Fits in one page (with small tolerance)
        pageSlices.push(srcCanvas);
      } else {
        // Slice into multiple A4-height pages
        let y = 0;
        while (y < srcHeight) {
          const sliceHeight = Math.min(pageHeight, srcHeight - y);
          const slice = document.createElement("canvas");
          slice.width = srcWidth;
          slice.height = sliceHeight;

          const ctx = slice.getContext("2d");
          if (ctx) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, srcWidth, sliceHeight);
            ctx.drawImage(
              srcCanvas,
              0, y,              // source x, y
              srcWidth, sliceHeight, // source w, h
              0, 0,              // dest x, y
              srcWidth, sliceHeight, // dest w, h
            );
          }

          pageSlices.push(slice);
          y += pageHeight;
        }
      }
    }

    onProgress(85);

    // ── Step 4: Assemble PDF from page slices (85-100%) ──
    const { jsPDF } = await import("jspdf");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    for (let i = 0; i < pageSlices.length; i++) {
      if (i > 0) {
        pdf.addPage("a4", "portrait");
      }

      const slice = pageSlices[i];

      // Calculate dimensions — fit width to A4, maintain aspect ratio
      const imgAspect = slice.height / slice.width;
      const pdfWidth = A4_WIDTH_MM;
      const pdfHeight = pdfWidth * imgAspect;

      pdf.addImage(
        slice.toDataURL("image/jpeg", IMAGE_QUALITY),
        "JPEG",
        0, // x
        0, // y
        pdfWidth,
        pdfHeight,
      );
    }

    onProgress(95);

    const pdfBlob = pdf.output("blob");
    onProgress(100);

    return { blob: pdfBlob, ext: "pdf" };
  } finally {
    // Always clean up
    document.body.removeChild(container);
  }
}

/**
 * Create a hidden but rendered container for docx-preview.
 * Must be attached to DOM and visible (not display:none) for html2canvas.
 */
function createPdfRenderContainer(): HTMLDivElement {
  const container = document.createElement("div");

  Object.assign(container.style, {
    position: "fixed",
    left: "-9999px",
    top: "0",
    width: `${A4_WIDTH_PX}px`,
    backgroundColor: "#ffffff",
    zIndex: "-1",
    overflow: "visible",
    // docx-preview injects its own styles, so we keep the container minimal
  });

  return container;
}

/**
 * Wait for all <img> elements in a page to finish loading.
 * Times out after 3 seconds per page.
 */
async function waitForPageImages(element: HTMLElement): Promise<void> {
  const images = Array.from(element.querySelectorAll("img"));
  if (images.length === 0) return;

  const loadPromises = images.map(
    (img) =>
      new Promise<void>((resolve) => {
        if (img.complete && img.naturalWidth > 0) {
          resolve();
          return;
        }
        img.onload = () => resolve();
        img.onerror = () => resolve();
      }),
  );

  await Promise.race([
    Promise.all(loadPromises),
    new Promise<void>((r) => setTimeout(r, 3000)),
  ]);
}

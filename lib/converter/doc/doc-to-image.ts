// Document → Image converter (screenshot approach)
//
// Pipeline: DOCX/HTML/TXT/MD → Pandoc → HTML (with embedded media) → render → html2canvas → JPG/PNG/WEBP
//
// Key features:
//  - Images from DOCX are embedded as data: URIs (no external requests / 404s)
//  - Tables are fully styled with visible borders
//  - Waits for all images to load before capturing screenshot
//
// Accuracy: ~85-90% — good for visual snapshots of documents.
// Limitation: output is a rasterised image, not editable text.

import { pandocToHtmlWithMedia, canPandocConvertDirect } from "./pandoc-engine";
import { DOCUMENT_SCOPED_CSS } from "./document-css";

/** Supported image output formats and their MIME types */
const IMAGE_FORMAT_MAP: Record<string, { mime: string; ext: string }> = {
  "jpg-pages": { mime: "image/jpeg", ext: "jpg" },
  "png-pages": { mime: "image/png", ext: "png" },
  "webp-pages": { mime: "image/webp", ext: "webp" },
};

/** Quality for lossy formats (JPEG, WebP) */
const LOSSY_QUALITY = 0.92;

/**
 * Check if a target format is a document-to-image screenshot format.
 */
export function isDocImageFormat(toFormat: string): boolean {
  return toFormat in IMAGE_FORMAT_MAP;
}

/**
 * Convert a document (DOCX, HTML, TXT, MD) to an image (JPG, PNG, WEBP)
 * by rendering the Pandoc HTML output through html2canvas.
 */
export async function docToImage(
  file: File,
  toFormat: string,
  onProgress: (pct: number) => void,
): Promise<{ blob: Blob; ext: string }> {
  const fmt = IMAGE_FORMAT_MAP[toFormat];
  if (!fmt) {
    throw new Error(`Format gambar "${toFormat}" tidak didukung`);
  }

  const fromExt = file.name.split(".").pop()?.toLowerCase() || "";
  onProgress(5);

  // ── Step 1: Get HTML content with embedded media (0–50%) ──
  let html: string;

  if (fromExt === "html" || fromExt === "htm") {
    // Already HTML — read directly (images may be external, best-effort)
    html = await file.text();
    onProgress(50);
  } else if (canPandocConvertDirect(fromExt, "html")) {
    // Convert via Pandoc with media embedding (images become data: URIs)
    html = await pandocToHtmlWithMedia(file, (pct) => {
      onProgress(5 + Math.round(pct * 0.45));
    });
  } else {
    throw new Error(`Format sumber "${fromExt}" tidak dapat dikonversi ke gambar`);
  }

  onProgress(55);

  // ── Step 2: Render HTML in a hidden container ──
  const container = createRenderContainer(html);
  document.body.appendChild(container);

  // Wait for all embedded images to finish loading
  await waitForImages(container);
  // Extra settle time for fonts and layout
  await new Promise((r) => setTimeout(r, 200));
  onProgress(65);

  try {
    // ── Step 3: Capture screenshot via html2canvas (65–90%) ──
    const html2canvas = (await import("html2canvas")).default;

    const canvas = await html2canvas(container, {
      scale: 2, // 2x for crisp output
      useCORS: true,
      allowTaint: true, // Allow data: URIs
      backgroundColor: "#ffffff",
      logging: false,
      width: container.scrollWidth,
      height: container.scrollHeight,
      // Force html2canvas to use the container's actual dimensions
      windowWidth: container.scrollWidth,
      windowHeight: container.scrollHeight,
    });

    onProgress(90);

    // ── Step 4: Convert canvas to target image format ──
    const blob = await canvasToBlob(canvas, fmt.mime);
    onProgress(100);

    return { blob, ext: fmt.ext };
  } finally {
    // Always clean up the render container
    document.body.removeChild(container);
  }
}

/**
 * Wait for all <img> elements in a container to finish loading.
 * Times out after 5 seconds to prevent hanging on broken images.
 */
async function waitForImages(container: HTMLElement): Promise<void> {
  const images = Array.from(container.querySelectorAll("img"));
  if (images.length === 0) return;

  const timeout = 5000;
  const loadPromises = images.map(
    (img) =>
      new Promise<void>((resolve) => {
        if (img.complete && img.naturalWidth > 0) {
          resolve();
          return;
        }
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Don't block on broken images
      }),
  );

  await Promise.race([
    Promise.all(loadPromises),
    new Promise<void>((r) => setTimeout(r, timeout)),
  ]);
}

/**
 * Create a hidden but fully-rendered container for the HTML content.
 * The container is positioned off-screen but NOT display:none
 * (html2canvas needs the element to be rendered).
 */
function createRenderContainer(html: string): HTMLDivElement {
  const container = document.createElement("div");

  // Position off-screen but still rendered (html2canvas requirement)
  Object.assign(container.style, {
    position: "fixed",
    left: "-9999px",
    top: "0",
    width: "794px", // A4 width in pixels at 96dpi
    backgroundColor: "#ffffff",
    padding: "40px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#1a1a1a",
    zIndex: "-1",
    overflow: "visible",
  });

  // Strip <html>/<head>/<body> wrappers — extract only the body content
  // so our container styles aren't overridden by Pandoc's standalone output.
  const bodyContent = extractBodyContent(html);

  // Inject the HTML with comprehensive styling from shared module
  container.innerHTML = `
    <style>
      ${DOCUMENT_SCOPED_CSS}
    </style>
    <div class="doc-render">${bodyContent}</div>
  `;

  return container;
}

/**
 * Extract body content from a full HTML document.
 * Pandoc standalone output includes <html><head>...</head><body>...</body></html>.
 * We need just the body content to avoid conflicting styles.
 */
function extractBodyContent(html: string): string {
  // Try to extract <body> content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    return bodyMatch[1];
  }
  // If no <body> tag, return as-is (fragment or plain HTML)
  return html;
}

/**
 * Convert a canvas to a Blob with the specified MIME type.
 */
function canvasToBlob(canvas: HTMLCanvasElement, mime: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const quality = mime === "image/png" ? undefined : LOSSY_QUALITY;
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Gagal mengkonversi canvas ke gambar"))),
      mime,
      quality,
    );
  });
}

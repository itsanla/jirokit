// Pandoc WASM engine — lazy-loaded document converter
//
// Uses the official pandoc-wasm package (Pandoc 3.9) for high-quality
// document conversion. The 56 MB WASM binary is loaded on first use
// and cached for the session.
//
// Pandoc limitations in WASM:
//  - Cannot produce PDF output (no LaTeX engine)
//  - Cannot read PDF input (no external tools)
//
// Strategy:
//  - DOCX/HTML/TXT/Markdown conversions → Pandoc directly
//  - PDF → JPG handled separately via pdfjs-dist (not through Pandoc)

import { DOCUMENT_FULL_CSS } from "./document-css";

// ── Types ──
interface PandocConvertResult {
  stdout: string;
  stderr: string;
  warnings: unknown[];
  files: Record<string, Blob>;
  mediaFiles: Record<string, Blob>;
}

interface PandocInstance {
  convert: (
    options: Record<string, unknown>,
    stdin: string | null,
    files: Record<string, string | Blob>
  ) => Promise<PandocConvertResult>;
  query: (options: Record<string, unknown>) => Promise<unknown>;
}

type CreatePandocInstanceFn = (wasmBinary: ArrayBuffer) => Promise<PandocInstance>;

// ── Singleton lazy loader ──

let pandocInstance: PandocInstance | null = null;
let loadingPromise: Promise<PandocInstance> | null = null;

/**
 * Initialize (or return cached) Pandoc WASM instance.
 * Downloads the 56 MB WASM binary on first call.
 */
export async function initPandoc(
  onProgress?: (pct: number) => void
): Promise<PandocInstance> {
  if (pandocInstance) return pandocInstance;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    onProgress?.(5);

    // Dynamically import the core module via our local wrapper
    // (pandoc-wasm doesn't export ./src/core.js in its package.json exports)
    const { createPandocInstance } = await import("./pandoc-core-loader");

    if (typeof createPandocInstance !== "function") {
      throw new Error("Cannot find createPandocInstance in pandoc-wasm core module");
    }

    onProgress?.(8);

    // Fetch the WASM binary from public/ with progress tracking
    const wasmUrl = `${window.location.origin}/pandoc.wasm`;
    const response = await fetch(wasmUrl);

    if (!response.ok) {
      throw new Error(`Gagal mengunduh Pandoc WASM: ${response.status}`);
    }

    const contentLength = response.headers.get("Content-Length");
    const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;

    let wasmBinary: ArrayBuffer;

    if (totalBytes > 0 && response.body) {
      // Stream with progress
      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let receivedBytes = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        receivedBytes += value.length;
        // Map download progress to 8–70%
        onProgress?.(8 + Math.round((receivedBytes / totalBytes) * 62));
      }

      // Combine chunks
      const combined = new Uint8Array(receivedBytes);
      let offset = 0;
      for (const chunk of chunks) {
        combined.set(chunk, offset);
        offset += chunk.length;
      }
      wasmBinary = combined.buffer;
    } else {
      // Fallback: no Content-Length
      onProgress?.(35);
      wasmBinary = await response.arrayBuffer();
    }

    onProgress?.(75);

    // Instantiate WASM
    const instance = await createPandocInstance(wasmBinary);
    onProgress?.(95);

    pandocInstance = instance as PandocInstance;
    return pandocInstance!;
  })();

  try {
    return await loadingPromise;
  } catch (err) {
    loadingPromise = null; // Allow retry on failure
    throw err;
  }
}

// ── Pandoc format mapping ──

/** Map file extensions to Pandoc input format names */
const EXT_TO_PANDOC_INPUT: Record<string, string> = {
  docx: "docx",
  doc: "docx",
  html: "html",
  htm: "html",
  txt: "plain",
  md: "markdown",
  markdown: "markdown",
  rtf: "rtf",
  odt: "odt",
  epub: "epub",
  csv: "csv",
  tsv: "tsv",
};

/** Map target format values to Pandoc output format names */
const TARGET_TO_PANDOC_OUTPUT: Record<string, string> = {
  docx: "docx",
  html: "html",
  txt: "plain",
  md: "markdown",
  markdown: "markdown",
  rtf: "rtf",
  odt: "odt",
  epub: "epub",
};

/** Formats that produce binary output files (not stdout) */
const BINARY_OUTPUT_FORMATS = new Set(["docx", "odt", "epub"]);

// ── Shared media extraction utilities ──

/** MIME types for image file extensions */
const IMAGE_MIME_TYPES: Record<string, string> = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
  gif: "image/gif", svg: "image/svg+xml", webp: "image/webp",
  bmp: "image/bmp", tiff: "image/tiff", tif: "image/tiff",
  emf: "image/x-emf", wmf: "image/x-wmf",
};

/**
 * Convert a Uint8Array to a base64 data URI.
 */
function toDataUri(data: Uint8Array, mime: string): string {
  let binary = "";
  const chunkSize = 8192;
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.subarray(i, Math.min(i + chunkSize, data.length));
    binary += String.fromCharCode(...chunk);
  }
  return `data:${mime};base64,${btoa(binary)}`;
}

/**
 * Extract media files from a DOCX ZIP and return as data URI map.
 * Keys are stored under multiple path forms for flexible matching.
 */
async function extractDocxMedia(fileBuffer: ArrayBuffer): Promise<Map<string, string>> {
  const mediaDataUris = new Map<string, string>();
  try {
    const { unzipSync } = await import("fflate");
    const zipData = new Uint8Array(fileBuffer);
    const unzipped = unzipSync(zipData);

    for (const [path, data] of Object.entries(unzipped)) {
      if (/^word\/media\//i.test(path) && data.length > 0) {
        const filename = path.split("/").pop() || "";
        const fileExt = filename.split(".").pop()?.toLowerCase() || "";
        const mime = IMAGE_MIME_TYPES[fileExt] || "application/octet-stream";
        const dataUri = toDataUri(data, mime);

        // Store under multiple possible path forms that Pandoc might reference
        mediaDataUris.set(filename, dataUri);                    // "image1.png"
        mediaDataUris.set(`media/${filename}`, dataUri);         // "media/image1.png"
        mediaDataUris.set(`./media/${filename}`, dataUri);       // "./media/image1.png"
      }
    }
  } catch {
    console.warn("Gagal mengekstrak media dari DOCX");
  }
  return mediaDataUris;
}

/**
 * Collect media from Pandoc's result.mediaFiles into a data URI map.
 */
async function collectPandocMedia(
  mediaFiles: Record<string, Blob>,
  existing: Map<string, string>,
): Promise<void> {
  for (const [rawPath, blob] of Object.entries(mediaFiles)) {
    if (existing.has(rawPath)) continue;
    try {
      const ab = await blob.arrayBuffer();
      const bytes = new Uint8Array(ab);
      const mediaExt = rawPath.split(".").pop()?.toLowerCase() || "";
      const mime = IMAGE_MIME_TYPES[mediaExt] || blob.type || "application/octet-stream";
      const dataUri = toDataUri(bytes, mime);

      const normalized = rawPath.replace(/^\.\//, "");
      existing.set(normalized, dataUri);
      existing.set(rawPath, dataUri);
      const filename = rawPath.split("/").pop() || rawPath;
      existing.set(filename, dataUri);
    } catch {
      // Skip this media file
    }
  }
}

/**
 * Replace all src="..." and ![...](path) references in text with data URIs.
 */
function embedMediaInText(
  text: string,
  mediaMap: Map<string, string>,
  format: "html" | "markdown" | "plain",
): string {
  if (mediaMap.size === 0) return text;

  // Helper: resolve a path against the media map
  const resolve = (srcPath: string): string | undefined => {
    if (mediaMap.has(srcPath)) return mediaMap.get(srcPath);
    const cleaned = srcPath.replace(/^\.\//, "").replace(/^\//, "");
    if (mediaMap.has(cleaned)) return mediaMap.get(cleaned);
    const filename = cleaned.split("/").pop() || cleaned;
    if (mediaMap.has(filename)) return mediaMap.get(filename);
    return undefined;
  };

  if (format === "html") {
    // Replace src="..." in HTML
    return text.replace(
      /src=["']([^"']+)["']/g,
      (fullMatch, srcPath: string) => {
        const dataUri = resolve(srcPath);
        return dataUri ? `src="${dataUri}"` : fullMatch;
      },
    );
  }

  if (format === "markdown") {
    // Replace ![alt](path) in Markdown
    return text.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      (fullMatch, alt: string, imgPath: string) => {
        const dataUri = resolve(imgPath);
        return dataUri ? `![${alt}](${dataUri})` : fullMatch;
      },
    );
  }

  return text;
}

/**
 * Inject the document stylesheet into a Pandoc standalone HTML output.
 * Inserts a <style> block into the <head>, or prepends it if no <head> found.
 */
function injectHtmlStylesheet(html: string): string {
  const styleBlock = `<style>\n${DOCUMENT_FULL_CSS}\n</style>`;

  // Try to insert before </head>
  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `${styleBlock}\n</head>`);
  }

  // Fallback: prepend to the document
  return `${styleBlock}\n${html}`;
}

// ── Core conversion function ──

/**
 * Convert a document using Pandoc WASM.
 * For non-PDF conversions between supported formats.
 * When converting from DOCX, images are extracted and embedded as data URIs.
 */
export async function pandocConvert(
  inputFile: File,
  toFormat: string,
  onProgress: (pct: number) => void
): Promise<{ blob: Blob; ext: string }> {
  const ext = inputFile.name.split(".").pop()?.toLowerCase() || "";
  const pandocFrom = EXT_TO_PANDOC_INPUT[ext];
  const pandocTo = TARGET_TO_PANDOC_OUTPUT[toFormat];

  if (!pandocFrom) {
    throw new Error(`Format sumber "${ext}" tidak didukung oleh Pandoc`);
  }
  if (!pandocTo) {
    throw new Error(`Format tujuan "${toFormat}" tidak didukung oleh Pandoc`);
  }

  const isDocx = ext === "docx" || ext === "doc";
  const fileBuffer = await inputFile.arrayBuffer();

  // Step 1: Pre-extract media from DOCX if converting to text-based format
  const needsMediaEmbed = isDocx && !BINARY_OUTPUT_FORMATS.has(pandocTo);
  let mediaMap = new Map<string, string>();

  if (needsMediaEmbed) {
    mediaMap = await extractDocxMedia(fileBuffer);
  }

  // Initialize Pandoc (shows progress for first-time WASM download)
  const pandoc = await initPandoc((pct) => onProgress(Math.round(pct * 0.5)));
  onProgress(50);

  // Read input file
  const inputBlob = new Blob([fileBuffer], { type: inputFile.type });
  const inputFilename = `input.${ext}`;

  // Determine if output is binary (needs output-file) or text (stdout)
  const isBinaryOutput = BINARY_OUTPUT_FORMATS.has(pandocTo);
  const outputFilename = isBinaryOutput ? `output.${toFormat}` : undefined;

  // Build conversion options
  const options: Record<string, unknown> = {
    from: pandocFrom,
    to: pandocTo,
    standalone: true,
    "input-files": [inputFilename],
  };

  if (outputFilename) {
    options["output-file"] = outputFilename;
  }

  onProgress(60);

  // Build files object
  const files: Record<string, string | Blob> = {
    [inputFilename]: inputBlob,
  };

  // Run conversion
  const result = await pandoc.convert(options, null, files);
  onProgress(85);

  // Extract output
  let outputBlob: Blob;

  if (isBinaryOutput && outputFilename && result.files[outputFilename]) {
    outputBlob = result.files[outputFilename];
  } else if (result.stdout) {
    let outputText = result.stdout;

    // Embed media in text-based output when converting from DOCX
    if (needsMediaEmbed) {
      // Also collect any media Pandoc extracted
      await collectPandocMedia(result.mediaFiles || {}, mediaMap);

      const embedFormat = pandocTo === "html" ? "html"
        : (pandocTo === "markdown" ? "markdown" : "plain");
      outputText = embedMediaInText(outputText, mediaMap, embedFormat);
    }

    // Inject document stylesheet into standalone HTML output
    if (pandocTo === "html") {
      outputText = injectHtmlStylesheet(outputText);
    }

    const mimeMap: Record<string, string> = {
      html: "text/html",
      plain: "text/plain",
      markdown: "text/markdown",
      rtf: "application/rtf",
    };
    outputBlob = new Blob([outputText], {
      type: mimeMap[pandocTo] || "application/octet-stream",
    });
  } else {
    if (result.stderr) {
      throw new Error(`Pandoc error: ${result.stderr}`);
    }
    throw new Error("Pandoc tidak menghasilkan output");
  }

  onProgress(100);
  return { blob: outputBlob, ext: toFormat };
}

/**
 * Check if a format pair can be handled directly by Pandoc
 * (without PDF intermediary).
 */
export function canPandocConvertDirect(fromExt: string, toFormat: string): boolean {
  const from = EXT_TO_PANDOC_INPUT[fromExt];
  const to = TARGET_TO_PANDOC_OUTPUT[toFormat];
  return !!from && !!to;
}

/**
 * Convert a document to HTML with embedded media (images as data: URIs).
 * This is specifically designed for screenshot rendering — all media files
 * are extracted directly from the DOCX ZIP and embedded as base64 data URIs.
 */
export async function pandocToHtmlWithMedia(
  inputFile: File,
  onProgress: (pct: number) => void
): Promise<string> {
  const ext = inputFile.name.split(".").pop()?.toLowerCase() || "";
  const pandocFrom = EXT_TO_PANDOC_INPUT[ext];

  if (!pandocFrom) {
    throw new Error(`Format sumber "${ext}" tidak didukung oleh Pandoc`);
  }

  const fileBuffer = await inputFile.arrayBuffer();
  const isDocx = ext === "docx" || ext === "doc";

  // Step 1: Extract media from DOCX ZIP
  let mediaDataUris = new Map<string, string>();
  if (isDocx) {
    mediaDataUris = await extractDocxMedia(fileBuffer);
  }

  onProgress(30);

  // Step 2: Run Pandoc to convert to HTML
  const pandoc = await initPandoc((pct) => onProgress(30 + Math.round(pct * 0.3)));
  onProgress(60);

  const inputBlob = new Blob([fileBuffer], { type: inputFile.type });
  const inputFilename = `input.${ext}`;

  const options: Record<string, unknown> = {
    from: pandocFrom,
    to: "html",
    standalone: true,
    "input-files": [inputFilename],
  };

  if (mediaDataUris.size === 0) {
    options["extract-media"] = ".";
  }

  const files: Record<string, string | Blob> = {
    [inputFilename]: inputBlob,
  };

  const result = await pandoc.convert(options, null, files);
  onProgress(75);

  let html = result.stdout || "";

  if (!html && result.stderr) {
    throw new Error(`Pandoc error: ${result.stderr}`);
  }

  // Also collect any media from Pandoc's mediaFiles result
  await collectPandocMedia(result.mediaFiles || {}, mediaDataUris);

  // Step 3: Replace all src="..." references with data URIs
  html = embedMediaInText(html, mediaDataUris, "html");

  onProgress(85);
  return html;
}

/**
 * Convert document content (as HTML string) to a target format using Pandoc.
 * Useful for converting extracted PDF text (as HTML) to other formats.
 */
export async function pandocConvertHtml(
  htmlContent: string,
  toFormat: string,
  onProgress: (pct: number) => void
): Promise<{ blob: Blob; ext: string }> {
  const pandocTo = TARGET_TO_PANDOC_OUTPUT[toFormat];
  if (!pandocTo) {
    throw new Error(`Format tujuan "${toFormat}" tidak didukung`);
  }

  const pandoc = await initPandoc((pct) => onProgress(Math.round(pct * 0.5)));
  onProgress(50);

  const isBinaryOutput = BINARY_OUTPUT_FORMATS.has(pandocTo);
  const outputFilename = isBinaryOutput ? `output.${toFormat}` : undefined;

  const options: Record<string, unknown> = {
    from: "html",
    to: pandocTo,
    standalone: true,
  };

  if (outputFilename) {
    options["output-file"] = outputFilename;
  }

  onProgress(60);

  const result = await pandoc.convert(options, htmlContent, {});
  onProgress(90);

  let outputBlob: Blob;

  if (isBinaryOutput && outputFilename && result.files[outputFilename]) {
    outputBlob = result.files[outputFilename];
  } else if (result.stdout) {
    let outputText = result.stdout;

    // Inject document stylesheet for HTML output
    if (pandocTo === "html") {
      outputText = injectHtmlStylesheet(outputText);
    }

    const mimeMap: Record<string, string> = {
      html: "text/html",
      plain: "text/plain",
      markdown: "text/markdown",
    };
    outputBlob = new Blob([outputText], {
      type: mimeMap[pandocTo] || "application/octet-stream",
    });
  } else {
    throw new Error(result.stderr || "Pandoc tidak menghasilkan output");
  }

  onProgress(100);
  return { blob: outputBlob, ext: toFormat };
}

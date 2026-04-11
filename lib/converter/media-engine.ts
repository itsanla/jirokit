// Media Converter Engine — uses FFmpeg.wasm for audio/video conversion
// Handles SharedArrayBuffer availability and proper CDN loading

import type { FFmpeg } from "@ffmpeg/ffmpeg";

// Singleton FFmpeg instance
let ffmpegInstance: FFmpeg | null = null;
let ffmpegLoaded = false;

// @ffmpeg/ffmpeg 0.12.x bundles CORE_VERSION = "0.12.9"
// Use UMD format (not ESM) as the worker.js loads via importScripts first
const CORE_VERSION = "0.12.9";

/**
 * Fetch a remote script and return a blob: URL.
 * This bypasses the cross-origin restriction on `new Worker(url)`.
 */
async function toBlobURL(url: string, mimeType: string): Promise<string> {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Failed to fetch ${url}: ${resp.status}`);
  const buf = await resp.arrayBuffer();
  const blob = new Blob([buf], { type: mimeType });
  return URL.createObjectURL(blob);
}

async function getFFmpeg(onProgress: (pct: number) => void): Promise<FFmpeg> {
  if (ffmpegInstance && ffmpegLoaded) return ffmpegInstance;

  const { FFmpeg } = await import("@ffmpeg/ffmpeg");
  ffmpegInstance = new FFmpeg();

  onProgress(5);

  // Check SharedArrayBuffer availability (requires COOP/COEP headers)
  const canUseThreads = typeof SharedArrayBuffer !== "undefined";

  try {
    if (canUseThreads) {
      const base = `https://unpkg.com/@ffmpeg/core-mt@${CORE_VERSION}/dist/umd`;
      onProgress(7);
      // Fetch all assets as blob URLs to bypass cross-origin Worker restriction
      const [coreURL, wasmURL, workerURL] = await Promise.all([
        toBlobURL(`${base}/ffmpeg-core.js`, "text/javascript"),
        toBlobURL(`${base}/ffmpeg-core.wasm`, "application/wasm"),
        toBlobURL(`${base}/ffmpeg-core.worker.js`, "text/javascript"),
      ]);
      onProgress(12);
      await ffmpegInstance.load({ coreURL, wasmURL, workerURL });
    } else {
      const base = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/umd`;
      onProgress(7);
      const [coreURL, wasmURL] = await Promise.all([
        toBlobURL(`${base}/ffmpeg-core.js`, "text/javascript"),
        toBlobURL(`${base}/ffmpeg-core.wasm`, "application/wasm"),
      ]);
      onProgress(12);
      await ffmpegInstance.load({ coreURL, wasmURL });
    }
  } catch (loadError) {
    // Reset on failure so retry is possible
    ffmpegInstance = null;
    ffmpegLoaded = false;

    const msg = loadError instanceof Error ? loadError.message : String(loadError);

    // Provide helpful error messages
    if (msg.includes("SharedArrayBuffer")) {
      throw new Error(
        "Konversi media membutuhkan header keamanan khusus (COOP/COEP). " +
          "Fitur ini hanya bisa digunakan pada versi deploy (bukan localhost biasa). " +
          "Pastikan server mengirimkan header Cross-Origin-Opener-Policy dan Cross-Origin-Embedder-Policy."
      );
    }

    throw new Error(`Gagal memuat FFmpeg: ${msg}`);
  }

  ffmpegLoaded = true;
  onProgress(15);
  return ffmpegInstance;
}

export async function convertMedia(
  file: File,
  toFormat: string,
  onProgress: (pct: number) => void
): Promise<{ blob: Blob; ext: string }> {
  const { fetchFile } = await import("@ffmpeg/util");
  const ffmpeg = await getFFmpeg(onProgress);

  const inputExt = file.name.split(".").pop()?.toLowerCase() || "tmp";
  const inputName = `input.${inputExt}`;
  const outputExt = toFormat;
  const outputName = `output.${outputExt}`;

  const mimeMap: Record<string, string> = {
    mp3: "audio/mpeg",
    wav: "audio/wav",
    ogg: "audio/ogg",
    mp4: "video/mp4",
    webm: "video/webm",
    gif: "image/gif",
  };

  // Write input file to FFmpeg virtual FS
  onProgress(20);
  await ffmpeg.writeFile(inputName, await fetchFile(file));

  // Track progress from FFmpeg
  ffmpeg.on("progress", ({ progress }) => {
    const pct = Math.min(95, 20 + Math.round(progress * 75));
    onProgress(pct);
  });

  // Build and execute FFmpeg command
  const args = buildFFmpegArgs(inputName, outputName, toFormat);
  onProgress(25);

  const exitCode = await ffmpeg.exec(args);
  if (exitCode !== 0) {
    // Cleanup input
    try {
      await ffmpeg.deleteFile(inputName);
    } catch {
      /* ignore */
    }
    throw new Error(
      `FFmpeg gagal (exit code: ${exitCode}). Format "${inputExt}" → "${toFormat}" mungkin tidak didukung.`
    );
  }

  // Read output
  const data = await ffmpeg.readFile(outputName);
  onProgress(98);

  // Cleanup virtual FS
  try {
    await ffmpeg.deleteFile(inputName);
    await ffmpeg.deleteFile(outputName);
  } catch {
    // Ignore cleanup errors
  }

  // Convert to Blob — copy to plain ArrayBuffer for strict TypeScript
  const raw =
    data instanceof Uint8Array ? data : new TextEncoder().encode(data as string);
  const ab = new ArrayBuffer(raw.byteLength);
  new Uint8Array(ab).set(raw);
  const blob = new Blob([ab], {
    type: mimeMap[toFormat] || "application/octet-stream",
  });

  onProgress(100);
  return { blob, ext: outputExt };
}

function buildFFmpegArgs(
  input: string,
  output: string,
  toFormat: string
): string[] {
  switch (toFormat) {
    case "mp3":
      return ["-i", input, "-vn", "-acodec", "libmp3lame", "-q:a", "2", output];
    case "wav":
      return ["-i", input, "-vn", "-acodec", "pcm_s16le", output];
    case "ogg":
      return ["-i", input, "-vn", "-acodec", "libvorbis", "-q:a", "5", output];
    case "mp4":
      return ["-i", input, "-c:v", "libx264", "-preset", "fast", "-c:a", "aac", output];
    case "webm":
      return ["-i", input, "-c:v", "libvpx", "-c:a", "libvorbis", output];
    case "gif":
      return [
        "-i",
        input,
        "-vf",
        "fps=10,scale=480:-1:flags=lanczos",
        "-loop",
        "0",
        output,
      ];
    default:
      return ["-i", input, output];
  }
}

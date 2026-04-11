// Image Converter Engine — runs on main thread using Canvas API
// This is the fastest approach for browser image conversion (no worker needed for Canvas)

export async function convertImage(
  file: File,
  toFormat: string,
  onProgress: (pct: number) => void
): Promise<{ blob: Blob; ext: string }> {
  onProgress(10);

  const mimeMap: Record<string, string> = {
    png: "image/png",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    webp: "image/webp",
    bmp: "image/bmp",
  };

  const targetMime = mimeMap[toFormat] || `image/${toFormat}`;
  const ext = toFormat === "jpeg" ? "jpg" : toFormat;

  // Load image into an HTMLImageElement
  const url = URL.createObjectURL(file);
  const img = new Image();

  const loaded = await new Promise<HTMLImageElement>((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Gagal memuat gambar"));
    img.src = url;
  });

  onProgress(40);

  // Draw on canvas
  const canvas = document.createElement("canvas");
  canvas.width = loaded.naturalWidth;
  canvas.height = loaded.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context tidak tersedia");

  ctx.drawImage(loaded, 0, 0);
  URL.revokeObjectURL(url);

  onProgress(70);

  // Convert to target format
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error(`Gagal mengkonversi ke ${toFormat.toUpperCase()}`));
      },
      targetMime,
      0.92 // Quality for lossy formats
    );
  });

  onProgress(100);
  return { blob, ext };
}

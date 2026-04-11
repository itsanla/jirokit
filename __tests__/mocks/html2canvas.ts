// Mock for html2canvas — returns a minimal canvas in tests

export default async function html2canvas(
  _element: HTMLElement,
  _options?: Record<string, unknown>,
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 600;
  // getContext / toBlob are already mocked in setup-dom.ts
  return canvas;
}

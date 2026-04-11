/**
 * Vitest setup file — polyfill Canvas + Image APIs for happy-dom.
 * happy-dom doesn't implement Canvas 2D context or Image loading.
 */

// A minimal 1x1 white PNG encoded as base64
const TINY_PNG_B64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIABQABNl7BcQAAAABJRU5ErkJggg==";
const TINY_PNG_DATA_URL = `data:image/png;base64,${TINY_PNG_B64}`;

// Polyfill CanvasRenderingContext2D on HTMLCanvasElement
const noop = () => {};
const mockCtx = {
  scale: noop,
  fillRect: noop,
  drawImage: noop,
  clearRect: noop,
  getImageData: () => ({ data: new Uint8ClampedArray(4), width: 1, height: 1 }),
  putImageData: noop,
  beginPath: noop,
  closePath: noop,
  stroke: noop,
  fill: noop,
  moveTo: noop,
  lineTo: noop,
  arc: noop,
  rect: noop,
  save: noop,
  restore: noop,
  translate: noop,
  rotate: noop,
  setTransform: noop,
  resetTransform: noop,
  measureText: () => ({ width: 0, actualBoundingBoxAscent: 0, actualBoundingBoxDescent: 0 }),
  // Writable style properties
  fillStyle: "white",
  strokeStyle: "black",
  lineWidth: 1,
  font: "10px sans-serif",
  textAlign: "start",
  textBaseline: "alphabetic",
  globalAlpha: 1,
  globalCompositeOperation: "source-over",
};

if (typeof HTMLCanvasElement !== "undefined") {
  // Override getContext to return a mock 2d context
  HTMLCanvasElement.prototype.getContext = function (type: string) {
    if (type === "2d") return { ...mockCtx } as unknown as CanvasRenderingContext2D;
    return null;
  } as typeof HTMLCanvasElement.prototype.getContext;

  // Override toDataURL to return a tiny valid PNG
  HTMLCanvasElement.prototype.toDataURL = function () {
    return TINY_PNG_DATA_URL;
  };

  // Override toBlob to immediately callback with a tiny PNG blob
  HTMLCanvasElement.prototype.toBlob = function (
    callback: BlobCallback,
    type?: string,
    _quality?: number
  ) {
    const bytes = Uint8Array.from(atob(TINY_PNG_B64), (c) => c.charCodeAt(0));
    const blob = new Blob([bytes], { type: type || "image/png" });
    // Use queueMicrotask for async-like behavior
    queueMicrotask(() => callback(blob));
  };
}

// Polyfill Image onload — when src is set, fire onload
if (typeof Image !== "undefined") {
  const OrigImage = Image;
  class MockImage extends OrigImage {
    #onload: ((ev: Event) => void) | null = null;

    set onload(fn: ((ev: Event) => void) | null) {
      this.#onload = fn;
    }
    get onload() {
      return this.#onload;
    }

    set src(value: string) {
      // Store the src
      Object.defineProperty(this, "_src", { value, writable: true, configurable: true });
      // Trigger onload asynchronously
      queueMicrotask(() => {
        Object.defineProperty(this, "complete", { value: true, configurable: true });
        Object.defineProperty(this, "naturalWidth", { value: 1, configurable: true });
        Object.defineProperty(this, "naturalHeight", { value: 1, configurable: true });
        this.#onload?.(new Event("load"));
      });
    }
    get src() {
      return (this as unknown as { _src?: string })._src ?? "";
    }
  }
  // Replace global Image
  (globalThis as unknown as { Image: typeof MockImage }).Image = MockImage;
}

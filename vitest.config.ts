import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
      // Match the alias from next.config.ts for pandoc-wasm core
      "pandoc-wasm-core": path.resolve(
        __dirname,
        "node_modules/pandoc-wasm/src/core.js"
      ),
    },
  },
  test: {
    environment: "happy-dom",
    globals: true,
    include: ["__tests__/**/*.test.ts"],
    testTimeout: 30000,
    setupFiles: ["./__tests__/setup-dom.ts"],
    // Mock heavy browser-only / WASM modules for testing
    alias: {
      "pdfjs-dist": path.resolve(__dirname, "__tests__/mocks/pdfjs-dist.ts"),
      // Mock the Pandoc engine entirely (replaces the real WASM-based engine)
      "./pandoc-engine": path.resolve(
        __dirname,
        "__tests__/mocks/pandoc-engine.ts"
      ),
      // Mock html2canvas (needs a real browser, not happy-dom)
      "html2canvas": path.resolve(
        __dirname,
        "__tests__/mocks/html2canvas.ts"
      ),
      // Mock docx-preview (needs a real browser DOM)
      "docx-preview": path.resolve(
        __dirname,
        "__tests__/mocks/docx-preview.ts"
      ),
      // Mock jspdf (heavy PDF generation library)
      "jspdf": path.resolve(
        __dirname,
        "__tests__/mocks/jspdf.ts"
      ),
      // Mock @imgly/background-removal (ONNX WASM-based, needs real browser)
      "@imgly/background-removal": path.resolve(
        __dirname,
        "__tests__/mocks/imgly-background-removal.ts"
      ),
    },
  },
});

// Tests for the image converter engine (Canvas API based)
// happy-dom doesn't fully support canvas/Image, so we test module loading only

import { describe, it, expect } from "vitest";

describe("convertImage", () => {
  it("should export convertImage function", async () => {
    const mod = await import("@/lib/converter/image-engine");
    expect(typeof mod.convertImage).toBe("function");
  });

  // Note: Full integration tests for image conversion require a real browser
  // environment (Canvas API + Image loading). These are best tested manually
  // or via Playwright/Cypress E2E tests.
});

// Tests for the central converter orchestrator

import { describe, it, expect, vi } from "vitest";
import { runConversion, getAcceptedMimes } from "@/lib/converter";

describe("getAcceptedMimes", () => {
  it("should return image MIME types", () => {
    const mimes = getAcceptedMimes("image");
    expect(mimes).toHaveProperty("image/png");
    expect(mimes).toHaveProperty("image/jpeg");
    expect(mimes["image/png"]).toContain(".png");
  });

  it("should return document MIME types", () => {
    const mimes = getAcceptedMimes("document");
    expect(mimes).toHaveProperty("application/pdf");
    expect(mimes).toHaveProperty("text/plain");
  });

  it("should return media MIME types", () => {
    const mimes = getAcceptedMimes("media");
    expect(mimes).toHaveProperty("audio/mpeg");
    expect(mimes).toHaveProperty("video/mp4");
  });
});

describe("runConversion", () => {
  it("should route document category to doc engine", async () => {
    const file = new File(["Hello World"], "test.txt", { type: "text/plain" });
    const progress = vi.fn();

    const result = await runConversion(
      {
        id: "test-1",
        file,
        fromFormat: "txt",
        toFormat: "html",
        category: "document",
        status: "processing",
        progress: 0,
      },
      progress
    );

    expect(result.ext).toBe("html");
    const html = await result.blob.text();
    expect(html).toContain("Hello World");
  });

  it("should throw for unknown category", async () => {
    const file = new File([], "test.bin");
    const progress = vi.fn();

    await expect(
      runConversion(
        {
          id: "test-2",
          file,
          fromFormat: "bin",
          toFormat: "txt",
          category: "unknown" as "image",
          status: "processing",
          progress: 0,
        },
        progress
      )
    ).rejects.toThrow("tidak dikenal");
  });
});

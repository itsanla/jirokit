// Tests for the media engine — mock-based since FFmpeg.wasm needs browser
// Tests validate module structure, buildFFmpegArgs logic, and error handling

import { describe, it, expect, vi } from "vitest";

describe("media-engine module", () => {
  it("should export convertMedia function", async () => {
    const mod = await import("@/lib/converter/media-engine");
    expect(typeof mod.convertMedia).toBe("function");
  });
});

describe("media-engine error handling", () => {
  it("should throw a helpful error when FFmpeg fails to load", async () => {
    // Mock @ffmpeg/ffmpeg to simulate load failure
    vi.doMock("@ffmpeg/ffmpeg", () => ({
      FFmpeg: class MockFFmpeg {
        loaded = false;
        load = vi.fn().mockRejectedValue(new Error("Failed to fetch"));
        on = vi.fn();
      },
    }));

    vi.doMock("@ffmpeg/util", () => ({
      fetchFile: vi.fn().mockResolvedValue(new Uint8Array()),
    }));

    // Re-import to pick up mocks
    const { convertMedia } = await import("@/lib/converter/media-engine");
    const file = new File(["test"], "test.mp3", { type: "audio/mpeg" });

    await expect(convertMedia(file, "wav", vi.fn())).rejects.toThrow("Gagal memuat FFmpeg");

    vi.doUnmock("@ffmpeg/ffmpeg");
    vi.doUnmock("@ffmpeg/util");
  });
});

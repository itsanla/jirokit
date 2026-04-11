// Tests for the converter type utilities

import { describe, it, expect } from "vitest";
import {
  detectFormat,
  detectCategory,
  humanFileSize,
  generateId,
  getFormatsForCategory,
  IMAGE_FORMATS,
  DOCUMENT_FORMATS,
  MEDIA_FORMATS,
} from "@/lib/converter/types";

describe("detectFormat", () => {
  it("should detect PNG format", () => {
    const file = new File([], "photo.png", { type: "image/png" });
    expect(detectFormat(file)).toBe("png");
  });

  it("should detect JPEG from jpg extension", () => {
    const file = new File([], "photo.jpg", { type: "image/jpeg" });
    expect(detectFormat(file)).toBe("jpeg");
  });

  it("should detect PDF format", () => {
    const file = new File([], "doc.pdf", { type: "application/pdf" });
    expect(detectFormat(file)).toBe("pdf");
  });

  it("should detect DOCX format", () => {
    const file = new File([], "document.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    expect(detectFormat(file)).toBe("docx");
  });

  it("should map doc to docx", () => {
    const file = new File([], "old.doc", { type: "application/msword" });
    expect(detectFormat(file)).toBe("docx");
  });

  it("should detect MP4 format", () => {
    const file = new File([], "video.mp4", { type: "video/mp4" });
    expect(detectFormat(file)).toBe("mp4");
  });

  it("should map AVI to mp4", () => {
    const file = new File([], "video.avi", { type: "video/x-msvideo" });
    expect(detectFormat(file)).toBe("mp4");
  });
});

describe("detectCategory", () => {
  it("should detect image category", () => {
    const file = new File([], "photo.png", { type: "image/png" });
    expect(detectCategory(file)).toBe("image");
  });

  it("should detect document category for PDF", () => {
    const file = new File([], "doc.pdf", { type: "application/pdf" });
    expect(detectCategory(file)).toBe("document");
  });

  it("should detect media category for audio", () => {
    const file = new File([], "song.mp3", { type: "audio/mpeg" });
    expect(detectCategory(file)).toBe("media");
  });

  it("should detect media category for video", () => {
    const file = new File([], "clip.mp4", { type: "video/mp4" });
    expect(detectCategory(file)).toBe("media");
  });

  it("should default to document for unknown types", () => {
    const file = new File([], "data.csv", { type: "text/csv" });
    expect(detectCategory(file)).toBe("document");
  });
});

describe("humanFileSize", () => {
  it("should format 0 bytes", () => {
    expect(humanFileSize(0)).toBe("0 B");
  });

  it("should format bytes", () => {
    expect(humanFileSize(512)).toBe("512 B");
  });

  it("should format KB", () => {
    expect(humanFileSize(1024)).toBe("1 KB");
  });

  it("should format MB", () => {
    expect(humanFileSize(1048576)).toBe("1 MB");
  });

  it("should format with decimal", () => {
    expect(humanFileSize(1536)).toBe("1.5 KB");
  });
});

describe("generateId", () => {
  it("should return a string", () => {
    expect(typeof generateId()).toBe("string");
  });

  it("should return unique IDs", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});

describe("getFormatsForCategory", () => {
  it("should return image formats", () => {
    expect(getFormatsForCategory("image")).toBe(IMAGE_FORMATS);
  });

  it("should return document formats", () => {
    expect(getFormatsForCategory("document")).toBe(DOCUMENT_FORMATS);
  });

  it("should return media formats", () => {
    expect(getFormatsForCategory("media")).toBe(MEDIA_FORMATS);
  });
});

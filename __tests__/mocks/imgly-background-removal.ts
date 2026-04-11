// Mock for @imgly/background-removal — simulates the background removal API for testing

import type { Config } from "@imgly/background-removal";

/**
 * Creates a simple 1x1 transparent PNG blob for test results.
 */
function createMockBlob(): Blob {
  // Minimal valid PNG (1x1 transparent pixel)
  const pngBytes = new Uint8Array([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, // PNG signature
    0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, // RGBA, 8-bit
    0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41, // IDAT chunk
    0x54, 0x78, 0x9c, 0x62, 0x00, 0x00, 0x00, 0x02,
    0x00, 0x01, 0xe2, 0x21, 0xbc, 0x33, 0x00, 0x00,
    0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, // IEND chunk
    0x60, 0x82,
  ]);
  return new Blob([pngBytes], { type: "image/png" });
}

/**
 * Simulate progress callbacks matching the real library's pattern.
 */
function simulateProgress(config?: Config): void {
  if (!config?.progress) return;

  const phases = [
    { key: "fetch:model", current: 1, total: 1 },
    { key: "compute:preprocess", current: 1, total: 1 },
    { key: "compute:inference", current: 1, total: 1 },
    { key: "compute:postprocess", current: 1, total: 1 },
    { key: "compute:encode", current: 1, total: 1 },
  ];

  for (const phase of phases) {
    config.progress(phase.key, phase.current, phase.total);
  }
}

export async function removeBackground(
  _image: unknown,
  config?: Config
): Promise<Blob> {
  simulateProgress(config);
  return createMockBlob();
}

export async function removeForeground(
  _image: unknown,
  config?: Config
): Promise<Blob> {
  simulateProgress(config);
  return createMockBlob();
}

export async function segmentForeground(
  _image: unknown,
  config?: Config
): Promise<Blob> {
  simulateProgress(config);
  return createMockBlob();
}

export const alphamask = segmentForeground;

export async function applySegmentationMask(
  _image: unknown,
  _mask: unknown,
  _config?: Config
): Promise<Blob> {
  return createMockBlob();
}

export async function preload(_config?: Config): Promise<void> {
  // No-op in tests
}

export default removeBackground;

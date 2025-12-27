import { describe, it, expect } from "vitest";

import {
  getExtensionFromMimeType,
  generateFilename,
  sanitizeFilename,
  estimateFileSize,
  formatFileSize,
} from "../src/utils/image.js";

describe("getExtensionFromMimeType", () => {
  it("should return correct extensions for common types", () => {
    expect(getExtensionFromMimeType("image/png")).toBe(".png");
    expect(getExtensionFromMimeType("image/jpeg")).toBe(".jpg");
    expect(getExtensionFromMimeType("image/jpg")).toBe(".jpg");
    expect(getExtensionFromMimeType("image/webp")).toBe(".webp");
    expect(getExtensionFromMimeType("image/gif")).toBe(".gif");
  });

  it("should default to .png for unknown types", () => {
    expect(getExtensionFromMimeType("image/unknown")).toBe(".png");
    expect(getExtensionFromMimeType("application/octet-stream")).toBe(".png");
  });
});

describe("generateFilename", () => {
  it("should generate a filename with timestamp", () => {
    const filename = generateFilename("test");
    expect(filename).toMatch(/^test-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.png$/);
  });

  it("should use correct extension for mime type", () => {
    const filename = generateFilename("output", "image/jpeg");
    expect(filename.endsWith(".jpg")).toBe(true);
  });

  it("should use default prefix and extension", () => {
    const filename = generateFilename();
    expect(filename).toMatch(/^image-.*\.png$/);
  });
});

describe("sanitizeFilename", () => {
  it("should remove unsafe characters", () => {
    expect(sanitizeFilename("test/file:name")).toBe("test-file-name");
    expect(sanitizeFilename("file<>name")).toBe("file-name");
    expect(sanitizeFilename("file|name")).toBe("file-name");
  });

  it("should collapse multiple dashes", () => {
    expect(sanitizeFilename("test---file")).toBe("test-file");
    expect(sanitizeFilename("a   b   c")).toBe("a-b-c");
  });

  it("should remove leading/trailing dashes", () => {
    expect(sanitizeFilename("-test-")).toBe("test");
    expect(sanitizeFilename("---test---")).toBe("test");
  });

  it("should convert to lowercase", () => {
    expect(sanitizeFilename("TestFile")).toBe("testfile");
  });

  it("should limit length", () => {
    const longName = "a".repeat(150);
    expect(sanitizeFilename(longName).length).toBeLessThanOrEqual(100);
  });

  it("should preserve allowed characters", () => {
    expect(sanitizeFilename("test-file_name")).toBe("test-file_name");
    expect(sanitizeFilename("test123")).toBe("test123");
  });
});

describe("estimateFileSize", () => {
  it("should estimate correct size from base64", () => {
    // Base64 encoding increases size by ~33%
    // 1000 bytes of binary = ~1333 base64 characters
    // So 1333 base64 chars should estimate to ~1000 bytes
    const base64 = "a".repeat(1333);
    const estimated = estimateFileSize(base64);
    expect(estimated).toBeCloseTo(1000, -2); // Within 100 bytes
  });
});

describe("formatFileSize", () => {
  it("should format bytes", () => {
    expect(formatFileSize(500)).toBe("500 B");
    expect(formatFileSize(0)).toBe("0 B");
  });

  it("should format kilobytes", () => {
    expect(formatFileSize(1024)).toBe("1.0 KB");
    expect(formatFileSize(1536)).toBe("1.5 KB");
  });

  it("should format megabytes", () => {
    expect(formatFileSize(1024 * 1024)).toBe("1.0 MB");
    expect(formatFileSize(1024 * 1024 * 2.5)).toBe("2.5 MB");
  });
});

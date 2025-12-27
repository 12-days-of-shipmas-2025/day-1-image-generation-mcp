/**
 * Image utility functions for saving and processing generated images.
 */

import { existsSync, statSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { dirname, extname, join, resolve } from "path";

/**
 * Get file extension from MIME type.
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/webp": ".webp",
    "image/gif": ".gif",
  };
  return mimeToExt[mimeType] ?? ".png";
}

/**
 * Generate a default filename with timestamp.
 */
export function generateFilename(prefix: string = "image", mimeType: string = "image/png"): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const ext = getExtensionFromMimeType(mimeType);
  return `${prefix}-${timestamp}${ext}`;
}

/**
 * Sanitize a string to be safe for use as a filename.
 */
export function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9-_]/g, "-") // Replace unsafe chars with dash
    .replace(/-+/g, "-") // Collapse multiple dashes
    .replace(/^-|-$/g, "") // Remove leading/trailing dashes
    .toLowerCase()
    .slice(0, 100); // Limit length
}

/**
 * Save base64 image data to a file.
 * If outputPath is a directory, generates a filename automatically.
 */
export async function saveImage(
  base64Data: string,
  outputPath: string,
  mimeType: string = "image/png"
): Promise<string> {
  // Resolve to absolute path
  let absolutePath = resolve(outputPath);

  // Check if outputPath is an existing directory or ends with a path separator
  const isDirectory =
    outputPath.endsWith("/") ||
    outputPath.endsWith("\\") ||
    (existsSync(absolutePath) && statSync(absolutePath).isDirectory());

  if (isDirectory) {
    // Generate a filename and append to the directory path
    const filename = generateFilename("blog-image", mimeType);
    absolutePath = join(absolutePath, filename);
  }

  // Ensure the directory exists
  const dir = dirname(absolutePath);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }

  // Add extension if missing
  let finalPath = absolutePath;
  if (!extname(finalPath)) {
    finalPath += getExtensionFromMimeType(mimeType);
  }

  // Decode and write
  const buffer = Buffer.from(base64Data, "base64");
  await writeFile(finalPath, buffer);

  return finalPath;
}

/**
 * Calculate approximate file size from base64 data.
 */
export function estimateFileSize(base64Data: string): number {
  // Base64 is ~4/3 the size of the original binary
  return Math.floor((base64Data.length * 3) / 4);
}

/**
 * Format file size for display.
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

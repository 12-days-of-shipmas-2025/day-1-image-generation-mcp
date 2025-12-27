/**
 * Platform presets define standard image dimensions for various platforms.
 * Each preset maps to an aspect ratio and recommended dimensions.
 */

/** Gemini-supported aspect ratios */
export type GeminiAspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

export interface PlatformPreset {
  /** Human-readable name */
  name: string;
  /** Aspect ratio string (e.g., "16:9") */
  aspectRatio: string;
  /** Gemini-compatible aspect ratio (may differ from aspectRatio) */
  geminiAspectRatio: GeminiAspectRatio;
  /** Whether the aspect ratio is natively supported by Gemini */
  nativeAspectRatio: boolean;
  /** Recommended width in pixels */
  width: number;
  /** Recommended height in pixels */
  height: number;
  /** Platform category */
  category: "blog" | "social" | "video" | "generic";
  /** Description of use case */
  description: string;
}

export const PLATFORM_PRESETS: Record<string, PlatformPreset> = {
  // Blog Platforms - all 16:9 native
  "ghost-banner": {
    name: "Ghost Blog Banner",
    aspectRatio: "16:9",
    geminiAspectRatio: "16:9",
    nativeAspectRatio: true,
    width: 1200,
    height: 675,
    category: "blog",
    description: "Featured image for Ghost blog posts",
  },
  "ghost-feature": {
    name: "Ghost Feature Image (HD)",
    aspectRatio: "16:9",
    geminiAspectRatio: "16:9",
    nativeAspectRatio: true,
    width: 2000,
    height: 1125,
    category: "blog",
    description: "High-resolution feature image for Ghost",
  },
  "medium-ghost-spooky": {
    name: "Medium Ghost Spooky",
    aspectRatio: "16:9",
    geminiAspectRatio: "16:9",
    nativeAspectRatio: true,
    width: 2560,
    height: 1440,
    category: "blog",
    description: "Premium high-resolution blog banner (QHD 1440p)",
  },
  "medium-banner": {
    name: "Medium Banner",
    aspectRatio: "16:9",
    geminiAspectRatio: "16:9",
    nativeAspectRatio: true,
    width: 1400,
    height: 788,
    category: "blog",
    description: "Banner image for Medium articles",
  },
  "substack-header": {
    name: "Substack Header",
    aspectRatio: "16:9",
    geminiAspectRatio: "16:9",
    nativeAspectRatio: true,
    width: 1456,
    height: 816,
    category: "blog",
    description: "Header image for Substack posts",
  },
  "wordpress-featured": {
    name: "WordPress Featured",
    aspectRatio: "16:9",
    geminiAspectRatio: "16:9",
    nativeAspectRatio: true,
    width: 1200,
    height: 675,
    category: "blog",
    description: "Featured image for WordPress posts",
  },

  // Social Media - Instagram
  "instagram-post": {
    name: "Instagram Post",
    aspectRatio: "1:1",
    geminiAspectRatio: "1:1",
    nativeAspectRatio: true,
    width: 1080,
    height: 1080,
    category: "social",
    description: "Square post for Instagram feed",
  },
  "instagram-story": {
    name: "Instagram Story",
    aspectRatio: "9:16",
    geminiAspectRatio: "9:16",
    nativeAspectRatio: true,
    width: 1080,
    height: 1920,
    category: "social",
    description: "Vertical story/reel for Instagram",
  },
  "instagram-landscape": {
    name: "Instagram Landscape",
    aspectRatio: "16:9",
    geminiAspectRatio: "16:9",
    nativeAspectRatio: true,
    width: 1080,
    height: 608,
    category: "social",
    description: "Landscape post for Instagram",
  },

  // Social Media - Twitter/X
  "twitter-post": {
    name: "Twitter/X Post",
    aspectRatio: "16:9",
    geminiAspectRatio: "16:9",
    nativeAspectRatio: true,
    width: 1200,
    height: 675,
    category: "social",
    description: "Image for Twitter/X posts",
  },
  "twitter-header": {
    name: "Twitter/X Header",
    aspectRatio: "3:1",
    geminiAspectRatio: "16:9",
    nativeAspectRatio: false, // 3:1 not supported, falls back to 16:9
    width: 1500,
    height: 500,
    category: "social",
    description: "Profile header for Twitter/X (note: generated as 16:9, crop needed)",
  },

  // Social Media - LinkedIn
  "linkedin-post": {
    name: "LinkedIn Post",
    aspectRatio: "1.91:1",
    geminiAspectRatio: "16:9",
    nativeAspectRatio: false, // 1.91:1 not supported, falls back to 16:9
    width: 1200,
    height: 628,
    category: "social",
    description: "Image for LinkedIn posts (note: generated as 16:9, very close match)",
  },
  "linkedin-banner": {
    name: "LinkedIn Banner",
    aspectRatio: "4:1",
    geminiAspectRatio: "16:9",
    nativeAspectRatio: false, // 4:1 not supported, falls back to 16:9
    width: 1584,
    height: 396,
    category: "social",
    description: "Profile banner for LinkedIn (note: generated as 16:9, crop needed)",
  },

  // Social Media - Facebook
  "facebook-post": {
    name: "Facebook Post",
    aspectRatio: "1.91:1",
    geminiAspectRatio: "16:9",
    nativeAspectRatio: false, // 1.91:1 not supported, falls back to 16:9
    width: 1200,
    height: 630,
    category: "social",
    description: "Image for Facebook posts (note: generated as 16:9, very close match)",
  },
  "facebook-cover": {
    name: "Facebook Cover",
    aspectRatio: "2.7:1",
    geminiAspectRatio: "16:9",
    nativeAspectRatio: false, // 2.7:1 not supported, falls back to 16:9
    width: 820,
    height: 312,
    category: "social",
    description: "Cover photo for Facebook (note: generated as 16:9, crop needed)",
  },

  // Video Platforms
  "youtube-thumbnail": {
    name: "YouTube Thumbnail",
    aspectRatio: "16:9",
    geminiAspectRatio: "16:9",
    nativeAspectRatio: true,
    width: 1280,
    height: 720,
    category: "video",
    description: "Thumbnail for YouTube videos",
  },
  "youtube-banner": {
    name: "YouTube Banner",
    aspectRatio: "16:9",
    geminiAspectRatio: "16:9",
    nativeAspectRatio: true,
    width: 2560,
    height: 1440,
    category: "video",
    description: "Channel banner for YouTube",
  },

  // Generic Sizes
  square: {
    name: "Square",
    aspectRatio: "1:1",
    geminiAspectRatio: "1:1",
    nativeAspectRatio: true,
    width: 1024,
    height: 1024,
    category: "generic",
    description: "Generic square image",
  },
  "square-hd": {
    name: "Square HD",
    aspectRatio: "1:1",
    geminiAspectRatio: "1:1",
    nativeAspectRatio: true,
    width: 2048,
    height: 2048,
    category: "generic",
    description: "High-resolution square image",
  },
  landscape: {
    name: "Landscape",
    aspectRatio: "16:9",
    geminiAspectRatio: "16:9",
    nativeAspectRatio: true,
    width: 1920,
    height: 1080,
    category: "generic",
    description: "Standard landscape (1080p)",
  },
  "landscape-4k": {
    name: "Landscape 4K",
    aspectRatio: "16:9",
    geminiAspectRatio: "16:9",
    nativeAspectRatio: true,
    width: 3840,
    height: 2160,
    category: "generic",
    description: "4K landscape image",
  },
  portrait: {
    name: "Portrait",
    aspectRatio: "9:16",
    geminiAspectRatio: "9:16",
    nativeAspectRatio: true,
    width: 1080,
    height: 1920,
    category: "generic",
    description: "Standard portrait/vertical image",
  },
} as const;

/** Get list of all preset keys */
export const PRESET_KEYS = Object.keys(PLATFORM_PRESETS);

/** Get presets by category */
export function getPresetsByCategory(
  category: PlatformPreset["category"]
): Record<string, PlatformPreset> {
  return Object.fromEntries(
    Object.entries(PLATFORM_PRESETS).filter(([, preset]) => preset.category === category)
  );
}

/** Map aspect ratio string to Gemini-compatible format */
export function toGeminiAspectRatio(aspectRatio: string): "1:1" | "16:9" | "9:16" | "4:3" | "3:4" {
  // Gemini supports: 1:1, 16:9, 9:16, 4:3, 3:4
  const ratio = aspectRatio.toLowerCase();

  if (ratio === "1:1") return "1:1";
  if (ratio === "9:16") return "9:16";
  if (ratio === "4:3") return "4:3";
  if (ratio === "3:4") return "3:4";

  // Map similar ratios to 16:9
  if (["16:9", "1.91:1", "2.7:1", "3:1", "4:1"].includes(ratio)) {
    return "16:9";
  }

  // Default to 16:9 for landscape-ish ratios
  return "16:9";
}

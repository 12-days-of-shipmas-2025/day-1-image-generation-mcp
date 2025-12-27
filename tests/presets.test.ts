import { describe, it, expect } from "vitest";

import {
  PLATFORM_PRESETS,
  PRESET_KEYS,
  getPresetsByCategory,
  toGeminiAspectRatio,
} from "../src/config/presets.js";

describe("PLATFORM_PRESETS", () => {
  it("should have all required properties for each preset", () => {
    for (const [key, preset] of Object.entries(PLATFORM_PRESETS)) {
      expect(preset.name).toBeDefined();
      expect(preset.aspectRatio).toBeDefined();
      expect(preset.width).toBeGreaterThan(0);
      expect(preset.height).toBeGreaterThan(0);
      expect(preset.category).toMatch(/^(blog|social|video|generic)$/);
      expect(preset.description).toBeDefined();
    }
  });

  it("should include medium-ghost-spooky preset", () => {
    const preset = PLATFORM_PRESETS["medium-ghost-spooky"];
    expect(preset).toBeDefined();
    expect(preset.width).toBe(2560);
    expect(preset.height).toBe(1440);
    expect(preset.aspectRatio).toBe("16:9");
    expect(preset.category).toBe("blog");
  });

  it("should include ghost-banner preset", () => {
    const preset = PLATFORM_PRESETS["ghost-banner"];
    expect(preset).toBeDefined();
    expect(preset.width).toBe(1200);
    expect(preset.height).toBe(675);
  });

  it("should include social media presets", () => {
    expect(PLATFORM_PRESETS["instagram-post"]).toBeDefined();
    expect(PLATFORM_PRESETS["twitter-post"]).toBeDefined();
    expect(PLATFORM_PRESETS["linkedin-post"]).toBeDefined();
    expect(PLATFORM_PRESETS["facebook-post"]).toBeDefined();
  });
});

describe("PRESET_KEYS", () => {
  it("should contain all preset keys", () => {
    expect(PRESET_KEYS).toContain("ghost-banner");
    expect(PRESET_KEYS).toContain("medium-ghost-spooky");
    expect(PRESET_KEYS).toContain("instagram-post");
    expect(PRESET_KEYS).toContain("youtube-thumbnail");
  });

  it("should match the number of presets", () => {
    expect(PRESET_KEYS.length).toBe(Object.keys(PLATFORM_PRESETS).length);
  });
});

describe("getPresetsByCategory", () => {
  it("should filter blog presets", () => {
    const blogPresets = getPresetsByCategory("blog");
    expect(Object.keys(blogPresets).length).toBeGreaterThan(0);
    for (const preset of Object.values(blogPresets)) {
      expect(preset.category).toBe("blog");
    }
  });

  it("should filter social presets", () => {
    const socialPresets = getPresetsByCategory("social");
    expect(Object.keys(socialPresets).length).toBeGreaterThan(0);
    for (const preset of Object.values(socialPresets)) {
      expect(preset.category).toBe("social");
    }
  });

  it("should filter video presets", () => {
    const videoPresets = getPresetsByCategory("video");
    expect(videoPresets["youtube-thumbnail"]).toBeDefined();
  });
});

describe("toGeminiAspectRatio", () => {
  it("should return exact matches for supported ratios", () => {
    expect(toGeminiAspectRatio("1:1")).toBe("1:1");
    expect(toGeminiAspectRatio("16:9")).toBe("16:9");
    expect(toGeminiAspectRatio("9:16")).toBe("9:16");
    expect(toGeminiAspectRatio("4:3")).toBe("4:3");
    expect(toGeminiAspectRatio("3:4")).toBe("3:4");
  });

  it("should map similar ratios to 16:9", () => {
    expect(toGeminiAspectRatio("1.91:1")).toBe("16:9");
    expect(toGeminiAspectRatio("2.7:1")).toBe("16:9");
    expect(toGeminiAspectRatio("3:1")).toBe("16:9");
    expect(toGeminiAspectRatio("4:1")).toBe("16:9");
  });

  it("should default to 16:9 for unknown ratios", () => {
    expect(toGeminiAspectRatio("5:3")).toBe("16:9");
    expect(toGeminiAspectRatio("unknown")).toBe("16:9");
  });
});

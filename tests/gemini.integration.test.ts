import { describe, it, expect, beforeAll } from "vitest";
import { config } from "dotenv";

import { GeminiProvider } from "../src/providers/gemini.js";

// Load environment variables
config();

describe("GeminiProvider Integration", () => {
  let provider: GeminiProvider;

  beforeAll(() => {
    provider = new GeminiProvider();
  });

  it("should be configured when API key is set", () => {
    if (!process.env.GOOGLE_API_KEY) {
      console.warn("Skipping: GOOGLE_API_KEY not set");
      return;
    }
    expect(provider.isConfigured()).toBe(true);
  });

  it("should report supported aspect ratios", () => {
    const ratios = provider.getSupportedAspectRatios();
    expect(ratios).toContain("1:1");
    expect(ratios).toContain("16:9");
    expect(ratios).toContain("9:16");
  });

  it("should report max resolution", () => {
    const max = provider.getMaxResolution();
    expect(max.width).toBeGreaterThanOrEqual(1024);
    expect(max.height).toBeGreaterThanOrEqual(1024);
  });

  it(
    "should generate an image (live API test)",
    async () => {
      if (!process.env.GOOGLE_API_KEY) {
        console.warn("Skipping live API test: GOOGLE_API_KEY not set");
        return;
      }

      const result = await provider.generateImage({
        prompt: "A simple blue square",
        aspectRatio: "1:1",
        width: 1024,
        height: 1024,
        quality: "standard",
      });

      expect(result.base64Data).toBeDefined();
      expect(result.base64Data.length).toBeGreaterThan(100);
      expect(result.mimeType).toMatch(/^image\//);
    },
    { timeout: 60000 }
  );
});

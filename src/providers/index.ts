/**
 * Provider factory and registry.
 * Add new providers here to make them available to the MCP server.
 */

import { GeminiProvider } from "./gemini.js";
import { ImageProvider, ProviderConfig } from "./types.js";

export * from "./types.js";
export { GeminiProvider } from "./gemini.js";

export type ProviderName = "gemini";

const providerFactories: Record<ProviderName, (config?: ProviderConfig) => ImageProvider> = {
  gemini: (config) => new GeminiProvider(config),
};

/**
 * Create a provider instance by name.
 */
export function createProvider(name: ProviderName, config?: ProviderConfig): ImageProvider {
  const factory = providerFactories[name];
  if (!factory) {
    throw new Error(`Unknown provider: ${name}. Available: ${getAvailableProviders().join(", ")}`);
  }
  return factory(config);
}

/**
 * Get list of available provider names.
 */
export function getAvailableProviders(): ProviderName[] {
  return Object.keys(providerFactories) as ProviderName[];
}

/**
 * Check which providers are configured and ready to use.
 */
export function getConfiguredProviders(): ProviderName[] {
  return getAvailableProviders().filter((name) => {
    try {
      const provider = createProvider(name);
      return provider.isConfigured();
    } catch {
      return false;
    }
  });
}

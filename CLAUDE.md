# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run build          # Compile TypeScript to dist/
npm run dev            # Watch mode compilation
npm test               # Run all tests
npm run test:watch     # Run tests in watch mode
npx vitest run tests/security.test.ts  # Run a single test file
npm run lint           # Check for lint errors
npm run lint:fix       # Auto-fix lint errors
npm run format         # Format code with Prettier
npm run check          # Run all checks (typecheck + lint + format + test)
```

## Architecture

This is an MCP (Model Context Protocol) server that exposes image generation as tools for AI assistants like Claude Desktop.

### Provider Pattern

The server uses a provider abstraction to support multiple image generation APIs:

```
src/providers/types.ts    → ImageProvider interface
src/providers/gemini.ts   → Gemini/Nano Banana implementation
src/providers/index.ts    → Provider factory and registry
```

To add a new provider: implement `ImageProvider` interface, then register in `providers/index.ts`.

### MCP Tool Flow

1. `src/index.ts` - MCP server setup, registers handlers for `ListToolsRequestSchema` and `CallToolRequestSchema`
2. `src/tools/generate-image.ts` - Tool schema (Zod), execution logic, calls provider
3. `src/config/presets.ts` - Platform dimension presets (ghost-banner, instagram-post, etc.)

### Key Types

- `ImageProvider` - Interface for generation backends
- `PlatformPreset` - Dimension/aspect ratio config for platforms
- `GenerateImageInput` - Zod schema for tool input validation
- `ProviderError` - Typed error with retry info

## Environment

Requires `GOOGLE_API_KEY` environment variable for Gemini provider. Store in `.env` file (gitignored).

## Testing

Tests are in `tests/` directory using Vitest. The `gemini.integration.test.ts` makes live API calls when `GOOGLE_API_KEY` is set.

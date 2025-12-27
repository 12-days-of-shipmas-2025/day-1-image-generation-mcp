/**
 * Security utilities for input validation and sanitization.
 */

/** Maximum prompt length to prevent abuse */
export const MAX_PROMPT_LENGTH = 4000;

/** Minimum prompt length for meaningful generation */
export const MIN_PROMPT_LENGTH = 3;

/** Patterns that might indicate prompt injection attempts */
const SUSPICIOUS_PATTERNS = [
  /ignore\s+(previous|all|above)(\s+\w+)*\s+instructions/i,
  /ignore\s+.*\s*instructions/i,
  /system\s*:\s*/i,
  /\[\[.*\]\]/,
  /<script/i,
  /javascript:/i,
];

export interface ValidationResult {
  valid: boolean;
  sanitized?: string;
  error?: string;
}

/**
 * Validate and sanitize a prompt for image generation.
 */
export function validatePrompt(prompt: string): ValidationResult {
  // Check for empty/missing
  if (!prompt || typeof prompt !== "string") {
    return { valid: false, error: "Prompt is required" };
  }

  const trimmed = prompt.trim();

  // Check length
  if (trimmed.length < MIN_PROMPT_LENGTH) {
    return { valid: false, error: `Prompt must be at least ${MIN_PROMPT_LENGTH} characters` };
  }

  if (trimmed.length > MAX_PROMPT_LENGTH) {
    return { valid: false, error: `Prompt must be less than ${MAX_PROMPT_LENGTH} characters` };
  }

  // Check for suspicious patterns
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { valid: false, error: "Prompt contains disallowed patterns" };
    }
  }

  // Basic sanitization - remove control characters
  const sanitized = trimmed
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/gu, "") // Remove control chars except newlines/tabs
    .replace(/\r\n/g, "\n") // Normalize line endings
    .replace(/\r/g, "\n");

  return { valid: true, sanitized };
}

/**
 * Validate a file path for safety.
 * Restricts paths to:
 * - Current working directory and subdirectories
 * - User's home directory and subdirectories
 * - System temp directory
 * - Relative paths (resolved relative to cwd)
 */
export function validateOutputPath(path: string): ValidationResult {
  if (!path || typeof path !== "string") {
    return { valid: true }; // Optional parameter
  }

  const trimmed = path.trim();

  // Block obvious path traversal
  if (trimmed.includes("..")) {
    return { valid: false, error: "Path traversal not allowed" };
  }

  // Block null bytes and other control characters
  if (/[\x00-\x1f]/.test(trimmed)) {
    return { valid: false, error: "Path contains invalid characters" };
  }

  // If it's a relative path, it's allowed (will be resolved relative to cwd)
  if (!trimmed.startsWith("/") && !/^[A-Z]:\\/i.test(trimmed)) {
    return { valid: true, sanitized: trimmed };
  }

  // For absolute paths, restrict to safe locations
  const homeDir = process.env.HOME || process.env.USERPROFILE || "";
  const cwd = process.cwd();
  const tempDirs = ["/tmp", "/var/tmp", process.env.TMPDIR || ""].filter(Boolean);

  // Check if path is under allowed directories
  const isUnderHome = homeDir && trimmed.startsWith(homeDir);
  const isUnderCwd = trimmed.startsWith(cwd);
  const isUnderTemp = tempDirs.some((tmp) => trimmed.startsWith(tmp));

  if (!isUnderHome && !isUnderCwd && !isUnderTemp) {
    return {
      valid: false,
      error:
        "Absolute paths must be under your home directory, current working directory, or temp directory",
    };
  }

  // Block obvious system directories even if they happen to be under home
  const dangerousPaths = ["/etc", "/var/log", "/usr", "/bin", "/sbin", "/root", "/boot"];
  for (const dangerous of dangerousPaths) {
    if (trimmed.startsWith(dangerous)) {
      return { valid: false, error: "Cannot write to system directories" };
    }
  }

  // Block Windows system paths
  if (/^[A-Z]:\\(Windows|Program Files|System)/i.test(trimmed)) {
    return { valid: false, error: "Cannot write to system directories" };
  }

  return { valid: true, sanitized: trimmed };
}

/**
 * Create a safe error message that doesn't leak sensitive info.
 */
export function safeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Remove any potential API keys from error messages
    let message = error.message;
    message = message.replace(/key[=:]["']?[A-Za-z0-9_-]{20,}["']?/gi, "key=[REDACTED]");
    message = message.replace(/AIza[A-Za-z0-9_-]{35}/g, "[REDACTED_KEY]");
    return message;
  }
  return "An unknown error occurred";
}

/**
 * Redact sensitive information from an object for logging.
 */
export function redactSensitive<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj };
  const sensitiveKeys = ["apiKey", "api_key", "key", "token", "secret", "password"];

  for (const key of Object.keys(result)) {
    if (sensitiveKeys.some((sk) => key.toLowerCase().includes(sk))) {
      result[key as keyof T] = "[REDACTED]" as T[keyof T];
    }
  }

  return result;
}

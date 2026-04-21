import { createHash, randomBytes } from "node:crypto";

/**
 * SHA-256 hash a string and return the hex digest.
 */
export function hashApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

/**
 * Generate a new API key with the `ms_live_` prefix.
 */
export function generateApiKey(): string {
  return `ms_live_${randomBytes(32).toString("hex")}`;
}

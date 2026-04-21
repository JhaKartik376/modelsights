import { randomBytes } from "node:crypto";

/**
 * Generate a UUIDv7 — time-sortable unique identifier.
 * Format: 8-4-4-4-12 hex with timestamp in the first 48 bits.
 */
export function generateRequestId(): string {
  const now = Date.now();
  const timeHex = now.toString(16).padStart(12, "0");
  const rand = randomBytes(10);

  // Set version 7 (0111) in bits 48-51
  rand[0] = (rand[0]! & 0x0f) | 0x70;
  // Set variant 10xx in bits 64-65
  rand[2] = (rand[2]! & 0x3f) | 0x80;

  const randHex = rand.toString("hex");

  return [
    timeHex.slice(0, 8),
    timeHex.slice(8, 12),
    randHex.slice(0, 4),
    randHex.slice(4, 8),
    randHex.slice(8, 20),
  ].join("-");
}

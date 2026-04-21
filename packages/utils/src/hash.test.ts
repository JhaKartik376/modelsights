import { describe, it, expect } from "vitest";
import { hashApiKey, generateApiKey } from "./hash.js";

describe("hashApiKey", () => {
  it("returns a 64-char hex string", () => {
    const hash = hashApiKey("test-key");
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("is deterministic", () => {
    expect(hashApiKey("foo")).toBe(hashApiKey("foo"));
  });

  it("produces different hashes for different inputs", () => {
    expect(hashApiKey("a")).not.toBe(hashApiKey("b"));
  });
});

describe("generateApiKey", () => {
  it("starts with ms_live_ prefix", () => {
    const key = generateApiKey();
    expect(key.startsWith("ms_live_")).toBe(true);
  });

  it("has 72 characters total (8 prefix + 64 hex)", () => {
    const key = generateApiKey();
    expect(key.length).toBe(8 + 64);
  });

  it("generates unique keys", () => {
    const keys = new Set(Array.from({ length: 50 }, () => generateApiKey()));
    expect(keys.size).toBe(50);
  });
});

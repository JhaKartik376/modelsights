import { describe, it, expect } from "vitest";
import { LogEntrySchema, BatchLogSchema } from "./schemas.js";

const validEntry = {
  requestId: "test-001",
  model: "gpt-4",
  prompt: [{ role: "user", content: "Hello" }],
  response: "Hi!",
  latencyMs: 100,
  inputTokens: 5,
  outputTokens: 3,
  totalTokens: 8,
  timestamp: Date.now(),
};

describe("LogEntrySchema", () => {
  it("accepts a valid entry", () => {
    const result = LogEntrySchema.safeParse(validEntry);
    expect(result.success).toBe(true);
  });

  it("defaults provider to openrouter", () => {
    const result = LogEntrySchema.parse(validEntry);
    expect(result.provider).toBe("openrouter");
  });

  it("rejects missing requestId", () => {
    const { requestId, ...rest } = validEntry;
    const result = LogEntrySchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects negative latency", () => {
    const result = LogEntrySchema.safeParse({ ...validEntry, latencyMs: -1 });
    expect(result.success).toBe(false);
  });

  it("rejects empty model", () => {
    const result = LogEntrySchema.safeParse({ ...validEntry, model: "" });
    expect(result.success).toBe(false);
  });
});

describe("BatchLogSchema", () => {
  it("accepts an array of entries", () => {
    const result = BatchLogSchema.safeParse({
      entries: [validEntry, { ...validEntry, requestId: "test-002" }],
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty array", () => {
    const result = BatchLogSchema.safeParse({ entries: [] });
    expect(result.success).toBe(false);
  });
});

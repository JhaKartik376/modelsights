import { describe, it, expect } from "vitest";
import { generateRequestId } from "./request-id.js";

describe("generateRequestId", () => {
  it("returns a valid UUID-like string", () => {
    const id = generateRequestId();
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
  });

  it("generates unique IDs", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateRequestId()));
    expect(ids.size).toBe(100);
  });

  it("is time-sortable (later IDs sort after earlier ones)", () => {
    const id1 = generateRequestId();
    const id2 = generateRequestId();
    expect(id2 > id1).toBe(true);
  });
});

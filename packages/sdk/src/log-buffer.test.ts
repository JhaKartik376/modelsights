import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { LogBuffer } from "./log-buffer.js";
import type { LogEntry } from "@modelsights/utils";

const makeEntry = (id: string): LogEntry => ({
  requestId: id,
  model: "gpt-4",
  provider: "openrouter",
  prompt: [{ role: "user", content: "test" }],
  response: "ok",
  latencyMs: 100,
  inputTokens: 5,
  outputTokens: 3,
  totalTokens: 8,
  timestamp: Date.now(),
});

describe("LogBuffer", () => {
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchSpy = vi.fn().mockResolvedValue(new Response("ok"));
    vi.stubGlobal("fetch", fetchSpy);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("flushes when buffer reaches maxSize", () => {
    const buffer = new LogBuffer("http://test", "key", 3, 60000);
    buffer.add(makeEntry("1"));
    buffer.add(makeEntry("2"));
    expect(fetchSpy).not.toHaveBeenCalled();

    buffer.add(makeEntry("3"));
    expect(fetchSpy).toHaveBeenCalledOnce();

    // Should use batch endpoint for 3 entries
    const [url] = fetchSpy.mock.calls[0];
    expect(url).toBe("http://test/log/batch");

    buffer.destroy();
  });

  it("flushes on interval", () => {
    const buffer = new LogBuffer("http://test", "key", 100, 5000);
    buffer.add(makeEntry("1"));
    expect(fetchSpy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(5000);
    expect(fetchSpy).toHaveBeenCalledOnce();

    // Single entry uses /log endpoint
    const [url] = fetchSpy.mock.calls[0];
    expect(url).toBe("http://test/log");

    buffer.destroy();
  });

  it("sends auth header", () => {
    const buffer = new LogBuffer("http://test", "my-key", 1, 60000);
    buffer.add(makeEntry("1"));

    const [, opts] = fetchSpy.mock.calls[0];
    expect(opts.headers.Authorization).toBe("Bearer my-key");

    buffer.destroy();
  });

  it("does not throw on fetch failure", () => {
    fetchSpy.mockRejectedValue(new Error("network error"));
    const buffer = new LogBuffer("http://test", "key", 1, 60000);

    expect(() => buffer.add(makeEntry("1"))).not.toThrow();

    buffer.destroy();
  });

  it("flushes remaining entries on destroy", () => {
    const buffer = new LogBuffer("http://test", "key", 100, 60000);
    buffer.add(makeEntry("1"));
    buffer.add(makeEntry("2"));
    expect(fetchSpy).not.toHaveBeenCalled();

    buffer.destroy();
    expect(fetchSpy).toHaveBeenCalledOnce();
  });
});

import { performance } from "node:perf_hooks";

export interface Timer {
  stop(): number;
}

/**
 * Create a high-resolution timer using performance.now().
 * Returns an object with a stop() method that returns elapsed milliseconds.
 */
export function createTimer(): Timer {
  const start = performance.now();
  return {
    stop() {
      return Math.round(performance.now() - start);
    },
  };
}

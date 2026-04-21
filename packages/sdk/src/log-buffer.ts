import type { LogEntry } from "@modelsights/utils";

export class LogBuffer {
  private buffer: LogEntry[] = [];
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private apiUrl: string,
    private apiKey: string,
    private maxSize = 50,
    private intervalMs = 5000
  ) {
    this.timer = setInterval(() => this.flush(), intervalMs);

    // Flush on process exit
    if (typeof process !== "undefined") {
      process.on("beforeExit", () => this.flush());
    }
  }

  add(entry: LogEntry): void {
    this.buffer.push(entry);
    if (this.buffer.length >= this.maxSize) {
      this.flush();
    }
  }

  flush(): void {
    if (this.buffer.length === 0) return;

    const batch = this.buffer.splice(0);

    if (batch.length === 1) {
      fetch(`${this.apiUrl}/log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(batch[0]),
      }).catch(() => {
        // Silently drop — logging must never break the app
      });
    } else {
      fetch(`${this.apiUrl}/log/batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ entries: batch }),
      }).catch(() => {
        // Silently drop
      });
    }
  }

  destroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.flush();
  }
}

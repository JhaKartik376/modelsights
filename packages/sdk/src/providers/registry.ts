import type { ProviderAdapter } from "../types.js";
import { OpenRouterAdapter } from "./openrouter.js";

export class ProviderRegistry {
  private adapters = new Map<string, ProviderAdapter>();

  constructor() {
    this.register(new OpenRouterAdapter());
  }

  register(adapter: ProviderAdapter): void {
    this.adapters.set(adapter.name, adapter);
  }

  resolve(name?: string): ProviderAdapter {
    const key = name ?? "openrouter";
    const adapter = this.adapters.get(key);
    if (!adapter) {
      throw new Error(
        `Unknown provider "${key}". Available: ${[...this.adapters.keys()].join(", ")}`
      );
    }
    return adapter;
  }
}

import type { ModelSightsConfig, ChatParams, ChatResult } from "./types.js";

export class ModelSights {
  private config: ModelSightsConfig;

  constructor(config: ModelSightsConfig) {
    this.config = config;
  }

  async chat(_params: ChatParams): Promise<ChatResult> {
    throw new Error("Not implemented — Phase 1");
  }
}

import { generateRequestId, createTimer } from "@modelsights/utils";
import type { ModelSightsConfig, ChatParams, ChatResult, LogEntry } from "./types.js";
import { ProviderRegistry } from "./providers/registry.js";
import { LogBuffer } from "./log-buffer.js";

const DEFAULT_API_URL = "http://localhost:3001";

export class ModelSights {
  private registry: ProviderRegistry;
  private logBuffer: LogBuffer;
  private providerApiKey: string;
  private providerName: string;

  constructor(config: ModelSightsConfig) {
    if (!config.apiKey) {
      throw new Error("modelSIGHTS API key is required");
    }

    this.providerApiKey = config.providerApiKey ?? "";
    this.providerName = config.provider ?? "openrouter";
    this.registry = new ProviderRegistry();

    this.logBuffer = new LogBuffer(
      config.apiUrl ?? DEFAULT_API_URL,
      config.apiKey,
      config.batchSize ?? 50,
      config.flushIntervalMs ?? 5000
    );
  }

  async chat(params: ChatParams): Promise<ChatResult> {
    const requestId = generateRequestId();
    const timer = createTimer();
    const adapter = this.registry.resolve(this.providerName);

    const providerResponse = await adapter.chat(params, this.providerApiKey);

    const latencyMs = timer.stop();

    // Fire-and-forget log — never awaited, never blocks
    const logEntry: LogEntry = {
      requestId,
      model: providerResponse.model,
      provider: adapter.name,
      prompt: params.messages,
      response: providerResponse.content,
      latencyMs,
      inputTokens: providerResponse.usage.inputTokens,
      outputTokens: providerResponse.usage.outputTokens,
      totalTokens: providerResponse.usage.totalTokens,
      timestamp: Date.now(),
    };

    this.logBuffer.add(logEntry);

    return {
      content: providerResponse.content,
      model: providerResponse.model,
      usage: providerResponse.usage,
      raw: providerResponse.raw,
    };
  }

  /**
   * Flush pending logs and clean up. Call before process exit.
   */
  destroy(): void {
    this.logBuffer.destroy();
  }
}

export interface ModelSightsConfig {
  apiKey: string;
  provider?: string;
  apiUrl?: string;
  providerApiKey?: string;
  batchSize?: number;
  flushIntervalMs?: number;
}

export interface ChatParams {
  model: string;
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
  maxTokens?: number;
  [key: string]: unknown;
}

export interface ChatResult {
  content: string;
  model: string;
  usage: TokenUsage;
  raw: unknown;
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

export interface ProviderAdapter {
  readonly name: string;
  chat(params: ChatParams, apiKey: string): Promise<ProviderResponse>;
}

export interface ProviderResponse {
  content: string;
  model: string;
  usage: TokenUsage;
  raw: unknown;
}


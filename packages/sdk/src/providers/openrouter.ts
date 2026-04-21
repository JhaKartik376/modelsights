import OpenAI from "openai";
import type { ProviderAdapter, ProviderResponse, ChatParams, TokenUsage } from "../types.js";

export class OpenRouterAdapter implements ProviderAdapter {
  readonly name = "openrouter";

  async chat(params: ChatParams, apiKey: string): Promise<ProviderResponse> {
    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey,
    });

    const { model, messages, maxTokens, ...rest } = params;

    const response = await client.chat.completions.create({
      model,
      messages: messages as OpenAI.ChatCompletionMessageParam[],
      max_tokens: maxTokens,
      ...rest,
    });

    const choice = response.choices[0];
    const content = choice?.message?.content ?? "";
    const usage = response.usage;

    const tokenUsage: TokenUsage = {
      inputTokens: usage?.prompt_tokens ?? 0,
      outputTokens: usage?.completion_tokens ?? 0,
      totalTokens: usage?.total_tokens ?? 0,
    };

    return {
      content,
      model: response.model ?? model,
      usage: tokenUsage,
      raw: response,
    };
  }
}

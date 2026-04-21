import { db, schema } from "./client.js";
import type { LogEntry } from "@modelsights/utils";

export async function insertRequest(entry: LogEntry) {
  const [row] = await db
    .insert(schema.requests)
    .values({
      requestId: entry.requestId,
      model: entry.model,
      provider: entry.provider,
      prompt: entry.prompt,
      response: entry.response,
      latencyMs: entry.latencyMs,
      inputTokens: entry.inputTokens,
      outputTokens: entry.outputTokens,
      totalTokens: entry.totalTokens,
      metadata: entry.metadata ?? null,
      createdAt: new Date(entry.timestamp),
    })
    .returning({ id: schema.requests.id, requestId: schema.requests.requestId });
  return row!;
}

export async function insertRequestBatch(entries: LogEntry[]) {
  const values = entries.map((entry) => ({
    requestId: entry.requestId,
    model: entry.model,
    provider: entry.provider,
    prompt: entry.prompt,
    response: entry.response,
    latencyMs: entry.latencyMs,
    inputTokens: entry.inputTokens,
    outputTokens: entry.outputTokens,
    totalTokens: entry.totalTokens,
    metadata: entry.metadata ?? null,
    createdAt: new Date(entry.timestamp),
  }));

  const rows = await db
    .insert(schema.requests)
    .values(values)
    .returning({ id: schema.requests.id, requestId: schema.requests.requestId });
  return rows;
}

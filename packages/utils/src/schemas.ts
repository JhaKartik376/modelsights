import { z } from "zod";

export const LogEntrySchema = z.object({
  requestId: z.string().min(1),
  model: z.string().min(1),
  provider: z.string().default("openrouter"),
  prompt: z.unknown(),
  response: z.unknown(),
  latencyMs: z.number().int().nonnegative(),
  inputTokens: z.number().int().nonnegative(),
  outputTokens: z.number().int().nonnegative(),
  totalTokens: z.number().int().nonnegative(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  timestamp: z.number().int().positive(),
});

export type LogEntry = z.infer<typeof LogEntrySchema>;

export const BatchLogSchema = z.object({
  entries: z.array(LogEntrySchema).min(1).max(100),
});

export type BatchLog = z.infer<typeof BatchLogSchema>;

import {
  pgTable,
  uuid,
  text,
  integer,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const requests = pgTable(
  "requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    requestId: text("request_id").notNull().unique(),
    model: text("model").notNull(),
    provider: text("provider").notNull().default("openrouter"),
    prompt: jsonb("prompt").notNull(),
    response: jsonb("response").notNull(),
    latencyMs: integer("latency_ms").notNull(),
    inputTokens: integer("input_tokens").notNull().default(0),
    outputTokens: integer("output_tokens").notNull().default(0),
    totalTokens: integer("total_tokens").notNull().default(0),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_requests_model").on(table.model),
    index("idx_requests_created_at").on(table.createdAt),
    index("idx_requests_provider").on(table.provider),
  ]
);

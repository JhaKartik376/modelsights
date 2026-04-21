import {
  pgTable,
  uuid,
  integer,
  numeric,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { requests } from "./requests.js";

export const metrics = pgTable(
  "metrics",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    requestId: uuid("request_id")
      .notNull()
      .references(() => requests.id, { onDelete: "cascade" })
      .unique(),
    latencyMs: integer("latency_ms").notNull(),
    tokens: integer("tokens").notNull(),
    costUsd: numeric("cost_usd", { precision: 12, scale: 8 }).notNull(),
    normalizedLatency: numeric("normalized_latency", {
      precision: 10,
      scale: 4,
    }),
    tokensPerSecond: numeric("tokens_per_second", { precision: 10, scale: 2 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("idx_metrics_request_id").on(table.requestId)]
);

import {
  pgTable,
  uuid,
  numeric,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { requests } from "./requests.js";

export const evaluations = pgTable(
  "evaluations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    requestId: uuid("request_id")
      .notNull()
      .references(() => requests.id, { onDelete: "cascade" })
      .unique(),
    relevanceScore: numeric("relevance_score", { precision: 5, scale: 4 }),
    hallucinationScore: numeric("hallucination_score", {
      precision: 5,
      scale: 4,
    }),
    qualityScore: numeric("quality_score", { precision: 5, scale: 2 }),
    evalMetadata: jsonb("eval_metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("idx_evaluations_request_id").on(table.requestId)]
);

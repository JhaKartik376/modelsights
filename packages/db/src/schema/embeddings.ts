import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { vector } from "drizzle-orm/pg-core";
import { requests } from "./requests.js";

export const embeddings = pgTable(
  "embeddings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    requestId: uuid("request_id")
      .notNull()
      .references(() => requests.id, { onDelete: "cascade" }),
    contentType: text("content_type").notNull(), // 'prompt' | 'response' | 'context'
    embedding: vector("embedding", { dimensions: 1536 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("idx_embeddings_request_id").on(table.requestId)]
);

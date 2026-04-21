import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const apiKeys = pgTable(
  "api_keys",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    keyHash: varchar("key_hash", { length: 64 }).notNull().unique(),
    name: text("name").notNull(),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("idx_api_keys_key_hash").on(table.keyHash)]
);

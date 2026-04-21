import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

export function createDb(url: string) {
  const sql = postgres(url);
  return drizzle(sql, { schema });
}

export type Database = ReturnType<typeof createDb>;

export * as schema from "./schema.js";
export { sql } from "drizzle-orm";

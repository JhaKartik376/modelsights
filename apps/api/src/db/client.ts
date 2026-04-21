import { createDb, schema } from "@modelsights/db";
import { config } from "../lib/config.js";

export const db = createDb(config.DATABASE_URL);
export { schema };

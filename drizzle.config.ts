import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./packages/db/src/schema",
  out: "./infra/db/migrations",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://postgres:postgres@localhost:5432/modelsights",
  },
});

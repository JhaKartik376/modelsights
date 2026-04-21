import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().default(
    "postgresql://postgres:postgres@localhost:5432/modelsights"
  ),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.string().default("development"),
});

export const config = envSchema.parse(process.env);

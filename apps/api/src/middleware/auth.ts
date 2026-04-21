import type { Request, Response, NextFunction } from "express";
import { eq, isNull } from "drizzle-orm";
import { hashApiKey } from "@modelsights/utils";
import { db, schema } from "../db/client.js";

// Simple LRU-ish cache for valid key hashes
const validKeyCache = new Map<string, { validUntil: number }>();
const CACHE_TTL_MS = 60_000;

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid Authorization header" });
    return;
  }

  const token = authHeader.slice(7);
  const keyHash = hashApiKey(token);

  // Check cache first
  const cached = validKeyCache.get(keyHash);
  if (cached && cached.validUntil > Date.now()) {
    next();
    return;
  }

  // Look up in database
  const [apiKey] = await db
    .select()
    .from(schema.apiKeys)
    .where(eq(schema.apiKeys.keyHash, keyHash))
    .limit(1);

  if (!apiKey || apiKey.revokedAt) {
    res.status(401).json({ error: "Invalid API key" });
    return;
  }

  // Update last_used_at (fire-and-forget)
  db.update(schema.apiKeys)
    .set({ lastUsedAt: new Date() })
    .where(eq(schema.apiKeys.id, apiKey.id))
    .then(() => {})
    .catch(() => {});

  // Cache the valid hash
  validKeyCache.set(keyHash, { validUntil: Date.now() + CACHE_TTL_MS });

  // Evict old entries if cache grows too large
  if (validKeyCache.size > 1000) {
    const now = Date.now();
    for (const [k, v] of validKeyCache) {
      if (v.validUntil < now) validKeyCache.delete(k);
    }
  }

  next();
}

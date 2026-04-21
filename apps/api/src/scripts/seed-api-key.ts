import "dotenv/config";
import { generateApiKey, hashApiKey } from "@modelsights/utils";
import { db, schema } from "../db/client.js";

async function seed() {
  const key = generateApiKey();
  const keyHash = hashApiKey(key);
  const name = process.argv[2] ?? "default";

  await db.insert(schema.apiKeys).values({
    keyHash,
    name,
  });

  console.log("\n  API key created successfully!\n");
  console.log(`  Name:  ${name}`);
  console.log(`  Key:   ${key}`);
  console.log("\n  Save this key — it cannot be retrieved later.\n");

  process.exit(0);
}

seed().catch((err) => {
  console.error("Failed to seed API key:", err);
  process.exit(1);
});

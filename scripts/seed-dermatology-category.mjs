/**
 * One-off seed: adds the missing "Dermatology" category document to Sanity.
 *
 * Usage:
 *   node scripts/seed-dermatology-category.mjs
 *
 * Safe to run multiple times — uses createOrReplace.
 * The dermatology article (curology-apostrophe-agency-acne) references
 * categorySlug "dermatology" but the matching category document was never
 * seeded, causing /category/dermatology to 404 in production.
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";

config({ path: ".env.local" });

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const WRITE_TOKEN = process.env.SANITY_API_WRITE_TOKEN;

if (!PROJECT_ID || PROJECT_ID === "your_project_id_here") {
  console.error("❌  Set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local before running.");
  process.exit(1);
}
if (!WRITE_TOKEN || WRITE_TOKEN === "your_write_token_here") {
  console.error("❌  Set SANITY_API_WRITE_TOKEN in .env.local before running.");
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: "2024-01-01",
  token: WRITE_TOKEN,
  useCdn: false,
});

const doc = {
  _id: "category-dermatology",
  _type: "category",
  label: "Dermatology",
  slug: { _type: "slug", current: "dermatology" },
  count: 1,
  icon: "✦",
};

console.log("\n📝  Seeding Dermatology category…");
await client.createOrReplace(doc);
console.log("  ✓  Dermatology category created (slug: dermatology)");
console.log("\n🎉  Done! /category/dermatology will now resolve correctly.\n");

/**
 * One-time migration: remove legacy `scorecard` field from all article documents.
 *
 * Usage:
 *   node scripts/remove-scorecard.js
 *
 * Requires SANITY_API_WRITE_TOKEN in .env.local (editor role or higher).
 * Safe to run multiple times — documents without the field are skipped.
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";

// ── Load .env.local ──────────────────────────────────────────────────────────
config({ path: ".env.local" });

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET    = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const API_VER    = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-01-01";
const TOKEN      = process.env.SANITY_API_WRITE_TOKEN;

if (!PROJECT_ID) {
  console.error("❌  NEXT_PUBLIC_SANITY_PROJECT_ID is not set in .env.local");
  process.exit(1);
}
if (!TOKEN) {
  console.error("❌  SANITY_API_WRITE_TOKEN is not set in .env.local");
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset:   DATASET,
  apiVersion: API_VER,
  token:     TOKEN,
  useCdn:    false, // always hit the live API for writes
});

// ── Query articles that still have the scorecard field ───────────────────────
const QUERY = `*[_type == "article" && defined(scorecard)]{ _id, title }`;

async function run() {
  console.log(`\nConnecting to project ${PROJECT_ID} / dataset ${DATASET} …\n`);

  const docs = await client.fetch(QUERY);

  if (docs.length === 0) {
    console.log("✅  No articles with a scorecard field found. Nothing to do.");
    return;
  }

  console.log(`Found ${docs.length} article(s) with a scorecard field:\n`);
  docs.forEach((doc) => console.log(`  • ${doc._id}  —  "${doc.title}"`));
  console.log();

  // Process each document individually so we can log per-doc results
  for (const doc of docs) {
    try {
      await client
        .patch(doc._id)
        .unset(["scorecard"])
        .commit({ autoGenerateArrayKeys: false });

      console.log(`✅  Removed scorecard from: "${doc.title}" (${doc._id})`);
    } catch (err) {
      console.error(`❌  Failed on "${doc.title}" (${doc._id}):`, err.message);
    }
  }

  console.log("\nDone.");
}

run().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});

/**
 * Migration script: data/articles.json + data/categories.json → Sanity
 *
 * Usage:
 *   node scripts/migrate-to-sanity.mjs
 *
 * Requires SANITY_API_WRITE_TOKEN in .env.local (editor role or higher).
 * Safe to run multiple times — uses createOrReplace so existing docs are updated.
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { config } from "dotenv";

// ── Load .env.local ──────────────────────────────────────────────────────────
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

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Converts a plaintext body string (## headings + paragraphs) to Portable Text blocks */
function textToPortableText(text) {
  if (!text) return [];
  return text.split("\n\n").map((block, i) => {
    const isH2 = block.startsWith("## ");
    return {
      _type: "block",
      _key: `block${i}`,
      style: isH2 ? "h2" : "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: `span${i}`,
          text: isH2 ? block.slice(3) : block,
          marks: [],
        },
      ],
    };
  });
}

/** Turn a plain string slug into a Sanity slug object */
function toSanitySlug(value) {
  return { _type: "slug", current: value };
}

// ── Load source data ─────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const articles = JSON.parse(readFileSync(join(__dirname, "../data/articles.json"), "utf8"));
const categories = JSON.parse(readFileSync(join(__dirname, "../data/categories.json"), "utf8"));

// ── Migrate categories ───────────────────────────────────────────────────────
console.log(`\n📂  Migrating ${categories.length} categories…`);

for (const cat of categories) {
  const doc = {
    _id: `category-${cat.slug}`,
    _type: "category",
    label: cat.label,
    slug: toSanitySlug(cat.slug),
    count: cat.count,
    icon: cat.icon,
  };
  await client.createOrReplace(doc);
  console.log(`  ✓  ${cat.label}`);
}

// ── Migrate articles ─────────────────────────────────────────────────────────
console.log(`\n📄  Migrating ${articles.length} articles…`);

for (const article of articles) {
  const doc = {
    _id: `article-${article.slug}`,
    _type: "article",
    title: article.title,
    slug: toSanitySlug(article.slug),
    category: article.category,
    categorySlug: article.categorySlug,
    date: article.date,
    summary: article.summary,
    featured: article.featured ?? false,
    mostRead: article.mostRead ?? false,
    // image left null — upload via Studio
    scorecard: article.scorecard
      ? {
          winner: article.scorecard.winner,
          overallRating: article.scorecard.overallRating,
          bestFor: article.scorecard.bestFor,
          priceTier: article.scorecard.priceTier,
          pros: article.scorecard.pros,
          cons: article.scorecard.cons,
        }
      : undefined,
    body: textToPortableText(article.body),
  };
  await client.createOrReplace(doc);
  console.log(`  ✓  ${article.title.slice(0, 60)}…`);
}

console.log("\n🎉  Migration complete!\n");

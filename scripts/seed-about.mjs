/**
 * Seed script: creates the About Page singleton document in Sanity.
 *
 * Usage:
 *   node scripts/seed-about.mjs
 *
 * Safe to run multiple times — uses createOrReplace so re-running updates
 * the content without creating duplicates.
 *
 * After seeding, open /studio → "About Page" to edit the content, or upload
 * a headshot/team photo in the image field.
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
  _id: "about",           // fixed ID — makes this a singleton
  _type: "about",
  pageTitle: "About The Digital Health Digest",
  tagline:
    "Independent editorial reviews of direct-to-consumer telehealth brands — so you can make smarter decisions about your care.",
  body: [
    {
      _type: "block",
      _key: "p1",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "s1",
          text: "The Digital Health Digest is an independent editorial site that researches, tests, and compares direct-to-consumer telehealth brands across men's health, women's health, mental health, weight loss, dermatology, primary care, and specialty categories.",
          marks: [],
        },
      ],
    },
    {
      _type: "block",
      _key: "p2",
      style: "h2",
      markDefs: [],
      children: [{ _type: "span", _key: "s2", text: "How we review", marks: [] }],
    },
    {
      _type: "block",
      _key: "p3",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "s3",
          text: "We enroll in every platform we review. We go through the intake process, speak with providers, receive prescriptions when applicable, and use the products for a minimum of four weeks before writing. We don't accept compensation from any brand we cover — our only income is reader support.",
          marks: [],
        },
      ],
    },
    {
      _type: "block",
      _key: "p4",
      style: "h2",
      markDefs: [],
      children: [{ _type: "span", _key: "s4", text: "Editorial standards", marks: [] }],
    },
    {
      _type: "block",
      _key: "p5",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "s5",
          text: "All reviews are updated when platforms change their pricing, formularies, or clinical protocols. We disclose conflicts of interest clearly and correct errors promptly. If you spot something wrong, email us.",
          marks: [],
        },
      ],
    },
  ],
  // image: leave null — upload via Studio's image field after seeding
};

console.log("\n📝  Seeding About Page…");
await client.createOrReplace(doc);
console.log("  ✓  About Page created with _id 'about'");
console.log("\n🎉  Done! Open /studio → About Page to edit content or upload a photo.\n");

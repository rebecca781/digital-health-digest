/**
 * Seed script: creates the "How We Score" singleton document in Sanity.
 *
 * Usage:
 *   node scripts/seed-how-we-score.mjs
 *
 * Safe to re-run — uses createOrReplace so re-running updates content
 * without creating duplicates.
 *
 * After seeding, open /studio → "How We Score" to edit the content.
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";

config({ path: ".env.local" });

const PROJECT_ID  = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET     = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
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
  dataset:   DATASET,
  apiVersion: "2024-01-01",
  token:     WRITE_TOKEN,
  useCdn:    false,
});

const doc = {
  _id:   "howWeScore",   // fixed ID — enforces singleton
  _type: "howWeScore",

  heading: "How We Score",

  subheading:
    "Every review on The Digital Health Digest is based on the same criteria. Here's exactly how we evaluate telehealth platforms.",

  criteria: [
    {
      _type: "object",
      _key:  "criterion-1",
      title: "Clinical quality",
      description:
        "We look at who is doing the prescribing. Are the providers board-certified physicians, or are patients seen exclusively by PAs and NPs without physician oversight? We also evaluate whether the clinical protocol — the conditions treated, the medications offered, the dosing logic — reflects current evidence-based guidelines rather than commercial convenience.",
    },
    {
      _type: "object",
      _key:  "criterion-2",
      title: "Pricing and transparency",
      description:
        "We enroll as real patients and track every charge from intake to prescription. Advertised prices rarely tell the whole story: consultation fees, compounding upcharges, mandatory bundle tiers, and auto-renewing subscriptions all affect true cost. A platform scores well here only when a new patient can accurately predict what they'll spend before they hand over a credit card.",
    },
    {
      _type: "object",
      _key:  "criterion-3",
      title: "Patient experience",
      description:
        "How long does it take to complete intake? When you message a provider, how quickly do they respond — and do they actually answer your question? We time these interactions ourselves over multiple weeks. Platforms are also evaluated on app and portal quality, how easy it is to cancel or pause, and whether support is reachable when something goes wrong.",
    },
    {
      _type: "object",
      _key:  "criterion-4",
      title: "Treatment access",
      description:
        "Breadth of formulary matters. A platform that treats only one condition, offers only one medication, or requires patients to escalate outside the platform for anything complex scores lower than one that can handle the realistic range of needs in its category. We also flag platforms that steer patients toward higher-margin options regardless of clinical fit.",
    },
    {
      _type: "object",
      _key:  "criterion-5",
      title: "Ongoing care",
      description:
        "Telehealth should not be a one-and-done transaction. We evaluate whether platforms include meaningful follow-up — check-ins, lab monitoring where clinically indicated, protocol adjustments over time. Platforms that issue an initial prescription and then go silent score lower than those that treat chronic care as an ongoing relationship.",
    },
  ],

  independenceNote:
    "The Digital Health Digest is editorially independent. We do not accept payment, free product, or any other form of compensation from the brands we review. Our only source of revenue is reader support.",
};

console.log("\n📝  Seeding How We Score page…");
await client.createOrReplace(doc);
console.log("  ✓  Created document with _id 'howWeScore'");
console.log("\n🎉  Done! Open /studio → How We Score to edit the content.\n");

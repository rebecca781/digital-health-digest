"use client";

/**
 * Sanity Studio — embedded at /studio
 *
 * Must be a Client Component ("use client") because Sanity's packages use
 * React context APIs that are not available in the RSC runtime.
 *
 * metadata/viewport are exported from the sibling layout.tsx (a Server
 * Component) because Next.js only reads those exports from server components.
 */

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export const dynamic = "force-dynamic";

export default function StudioPage() {
  return <NextStudio config={config} />;
}

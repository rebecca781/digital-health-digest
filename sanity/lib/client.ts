import "server-only";
import { createClient } from "next-sanity";
import type { QueryParams } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const isConfigured =
  typeof projectId === "string" &&
  projectId.length > 0 &&
  projectId !== "your_project_id_here";

export const client = createClient({
  projectId: isConfigured ? projectId : "placeholder",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-01-01",
  useCdn: false, // set to true in production after adding webhook revalidation
});

/**
 * True once NEXT_PUBLIC_SANITY_PROJECT_ID is set to a real value in .env.local.
 * Guards are used in generateStaticParams so build doesn't fail during initial setup.
 */
export { isConfigured as sanityIsConfigured };

/**
 * Safe fetch wrapper — returns a fallback value when Sanity is not yet configured
 * so pages render empty state instead of crashing.
 */
export async function safeFetch<T>(
  query: string,
  params?: Record<string, unknown>,
  fallback?: T
): Promise<T> {
  if (!isConfigured) return (fallback ?? null) as T;
  // Cast through QueryParams — our callers always pass plain serialisable
  // key/value objects, which is exactly what @sanity/client expects.
  return client.fetch<T>(query, (params ?? {}) as QueryParams);
}

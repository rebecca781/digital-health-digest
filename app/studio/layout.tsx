/**
 * Studio layout — Server Component
 *
 * Owns the metadata and viewport exports for the /studio segment.
 * These must live in a server component; they cannot be exported from
 * the "use client" page.tsx that renders NextStudio.
 */

import type { ReactNode } from "react";

export { metadata } from "next-sanity/studio/metadata";
export { viewport } from "next-sanity/studio/viewport";

export default function StudioLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

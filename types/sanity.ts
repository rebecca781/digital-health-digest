import type { PortableTextBlock } from "@portabletext/react";

// ── Multi-platform comparison scorecard ─────────────────────────────────────

export interface SanityComparisonScore {
  dimension: string;
  value: number; // 0–5
}

export interface SanityComparisonPlatform {
  name: string;
  url?: string;
  platformType?: string;
  isWinner: boolean;
  overallScore: number; // 0–5
  scores: SanityComparisonScore[];
}

// ── Single-platform scorecard (existing) ────────────────────────────────────

export interface SanityScorecard {
  winner: string;
  overallRating: number;  // stored 0–10; displayed as /5.0 (÷2)
  bestFor: string;
  priceTier: string;
  pros: string[];
  cons: string[];
  // Per-category scores — 0–5 scale, optional for backwards compat
  clinicalQuality?: number;
  pricing?: number;
  privacy?: number;
  patientExperience?: number;
  ongoingCare?: number;
}

/** Article shape returned by listing queries (no body) */
export interface SanityArticle {
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  date: string; // "YYYY-MM-DD"
  summary: string;
  featured: boolean;
  mostRead: boolean;
  image: string | null;
  scorecard: SanityScorecard | null;
}

/** Article shape returned by the single-article query (includes body + comparison) */
export interface SanityArticleWithBody extends SanityArticle {
  body: PortableTextBlock[] | null;
  comparisonPlatforms?: SanityComparisonPlatform[] | null;
}

export interface SanityCategory {
  label: string;
  slug: string;
  count: number;
  icon: string;
}

export interface SanityAboutPage {
  pageTitle: string;
  tagline: string;
  body: PortableTextBlock[];
  image: string | null;
  imageAlt: string | null;
}

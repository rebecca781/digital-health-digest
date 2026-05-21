import type { PortableTextBlock } from "@portabletext/react";

export interface SanityScorecard {
  winner: string;
  overallRating: number;
  bestFor: string;
  priceTier: string;
  pros: string[];
  cons: string[];
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

/** Article shape returned by the single-article query (includes body) */
export interface SanityArticleWithBody extends SanityArticle {
  body: PortableTextBlock[] | null;
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

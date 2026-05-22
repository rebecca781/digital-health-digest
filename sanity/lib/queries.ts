import "server-only";
import { groq } from "next-sanity";

// ---------- Field projection reused across queries ----------
const ARTICLE_FIELDS = groq`
  "slug": slug.current,
  title,
  category,
  categorySlug,
  date,
  summary,
  featured,
  mostRead,
  "image": image.asset->url
`;

const ARTICLE_FIELDS_WITH_BODY = groq`
  ${ARTICLE_FIELDS},
  body,
  comparisonPlatforms[] {
    name,
    url,
    platformType,
    isWinner,
    overallScore,
    scores[] {
      dimension,
      value
    }
  }
`;

// ---------- Public queries ----------

/** All articles ordered newest-first (no body — for listing pages) */
export const ALL_ARTICLES_QUERY = groq`
  *[_type == "article"] | order(date desc) {
    ${ARTICLE_FIELDS}
  }
`;

/** Featured article (hero) */
export const FEATURED_ARTICLE_QUERY = groq`
  *[_type == "article" && featured == true] | order(date desc) [0] {
    ${ARTICLE_FIELDS}
  }
`;

/** Most-read articles */
export const MOST_READ_QUERY = groq`
  *[_type == "article" && mostRead == true] | order(date desc) [0...3] {
    ${ARTICLE_FIELDS}
  }
`;

/** Latest articles (newest 3, excluding the featured one) */
export const LATEST_ARTICLES_QUERY = groq`
  *[_type == "article" && featured != true] | order(date desc) [0...3] {
    ${ARTICLE_FIELDS}
  }
`;

/** Articles filtered by categorySlug */
export const ARTICLES_BY_CATEGORY_QUERY = groq`
  *[_type == "article" && categorySlug == $categorySlug] | order(date desc) {
    ${ARTICLE_FIELDS}
  }
`;

/** Single article by slug (with body for the review page) */
export const ARTICLE_BY_SLUG_QUERY = groq`
  *[_type == "article" && slug.current == $slug] [0] {
    ${ARTICLE_FIELDS_WITH_BODY}
  }
`;

/** Related articles (same category, different slug, max 3) */
export const RELATED_ARTICLES_QUERY = groq`
  *[_type == "article" && categorySlug == $categorySlug && slug.current != $slug] | order(date desc) [0...3] {
    ${ARTICLE_FIELDS}
  }
`;

/** All article slugs — for generateStaticParams */
export const ALL_ARTICLE_SLUGS_QUERY = groq`
  *[_type == "article"].slug.current
`;

/** All categories */
export const ALL_CATEGORIES_QUERY = groq`
  *[_type == "category"] | order(label asc) {
    label,
    "slug": slug.current,
    count,
    icon
  }
`;

/** All category slugs — for generateStaticParams */
export const ALL_CATEGORY_SLUGS_QUERY = groq`
  *[_type == "category"].slug.current
`;

/** About page singleton — fixed _id "about" */
export const ABOUT_PAGE_QUERY = groq`
  *[_type == "about" && _id == "about"][0] {
    pageTitle,
    tagline,
    body,
    "image": image.asset->url,
    "imageAlt": image.alt
  }
`;

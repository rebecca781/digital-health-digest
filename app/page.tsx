import Link from "next/link";
import { formatDate } from "@/lib/formatDate";
import { safeFetch } from "@/sanity/lib/client";
import {
  FEATURED_ARTICLE_QUERY,
  MOST_READ_QUERY,
  LATEST_ARTICLES_QUERY,
  ALL_CATEGORIES_QUERY,
} from "@/sanity/lib/queries";
import type { SanityArticle, SanityCategory } from "@/types/sanity";

export const revalidate = 60;

const FILTER_CATEGORIES = [
  { label: "All",            slug: "all"          },
  { label: "Men's health",   slug: "mens-health"  },
  { label: "Women's health", slug: "womens-health" },
  { label: "Mental health",  slug: "mental-health" },
  { label: "Weight loss",    slug: "weight-loss"  },
  { label: "Dermatology",    slug: "dermatology"  },
  { label: "Primary care",   slug: "primary-care" },
  { label: "Specialty",      slug: "specialty"    },
  { label: "Compounding",    slug: "compounding"  },
];

export default async function HomePage() {
  const [hero, mostRead, latest, categories] = await Promise.all([
    safeFetch<SanityArticle | null>(FEATURED_ARTICLE_QUERY, {}, null),
    safeFetch<SanityArticle[]>(MOST_READ_QUERY, {}, []),
    safeFetch<SanityArticle[]>(LATEST_ARTICLES_QUERY, {}, []),
    safeFetch<SanityCategory[]>(ALL_CATEGORIES_QUERY, {}, []),
  ]);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          Contained column
      ═══════════════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 md:px-6">

        {/* ── Category filter bar ────────────────────────────────── */}
        <div
          className="overflow-x-auto scrollbar-hide border-b border-[#d8d4cc]"
          style={{ borderBottomWidth: "0.5px" }}
        >
          <div className="flex items-center gap-2 py-4" style={{ whiteSpace: "nowrap" }}>
            {FILTER_CATEGORIES.map((cat, i) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                style={{
                  fontSize: "12px",
                  padding: "0.3rem 0.875rem",
                  borderRadius: "999px",
                  border: i === 0 ? "0.5px solid #1a1a1a" : "0.5px solid #d8d4cc",
                  background: i === 0 ? "#1a1a1a" : "#fdfaf5",
                  color: i === 0 ? "#fdfaf5" : "#4a4a4a",
                  display: "inline-flex",
                  alignItems: "center",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  minHeight: "32px",
                  transition: "border-color 0.15s, background 0.15s, color 0.15s",
                }}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Hero + Most Read (2-column grid) ──────────────────── */}
        {(hero || mostRead.length > 0) && (
          <section
            className="grid grid-cols-1 md:grid-cols-[3fr_2fr] border-b border-[#d8d4cc]"
            style={{ borderBottomWidth: "1px" }}
          >
            {/* Left — featured article */}
            <div
              className="md:border-r border-[#d8d4cc]"
              style={{
                padding: "2rem 1.5rem",
                borderRightWidth: "1px",
                /* mobile: bottom rule separating from Most Read */
              }}
            >
              {/* Mobile-only separator drawn via the sibling below */}
              {hero && (
                <>
                  {/* Eyebrow */}
                  <Link
                    href={`/category/${hero.categorySlug}`}
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#326891",
                      fontWeight: 500,
                      display: "block",
                      marginBottom: "0.75rem",
                      textDecoration: "none",
                    }}
                  >
                    {hero.category}
                  </Link>

                  {/* Headline */}
                  <h1
                    className="font-serif"
                    style={{
                      fontSize: "28px",
                      lineHeight: 1.2,
                      color: "#1a1a1a",
                      fontWeight: 700,
                      marginBottom: "0.75rem",
                    }}
                  >
                    <Link
                      href={`/reviews/${hero.slug}`}
                      className="hover:text-[#326891] transition-colors"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {hero.title}
                    </Link>
                  </h1>

                  {/* Dek */}
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#4a4a4a",
                      lineHeight: 1.65,
                      marginBottom: "1rem",
                    }}
                  >
                    {hero.summary}
                  </p>

                  {/* Score badge + date */}
                  <div
                    className="flex items-center flex-wrap gap-3"
                    style={{ marginBottom: "1rem" }}
                  >
                    {hero.scorecard && (
                      <span
                        style={{
                          background: "#e8f1f7",
                          color: "#1a3a52",
                          fontSize: "13px",
                          fontWeight: 500,
                          padding: "0.3rem 0.6rem",
                          borderRadius: "4px",
                          display: "inline-block",
                        }}
                      >
                        {(hero.scorecard.overallRating / 2).toFixed(1)}&thinsp;/&thinsp;5.0
                      </span>
                    )}
                    <span style={{ fontSize: "10px", color: "#888" }}>
                      {formatDate(hero.date)}
                    </span>
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/reviews/${hero.slug}`}
                    style={{
                      fontSize: "11px",
                      color: "#1a1a1a",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      borderBottom: "1px solid #326891",
                      textDecoration: "none",
                      paddingBottom: "1px",
                      display: "inline-block",
                    }}
                  >
                    Read the review
                  </Link>
                </>
              )}
            </div>

            {/* Right — Most Read sidebar */}
            {mostRead.length > 0 && (
              <div
                className="border-t border-[#d8d4cc] md:border-t-0"
                style={{ padding: "1.5rem", borderTopWidth: "1px" }}
              >
                <p
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#888",
                    fontWeight: 500,
                    marginBottom: "1rem",
                  }}
                >
                  Most Read
                </p>

                <div>
                  {mostRead.map((article, i) => (
                    <div
                      key={article.slug}
                      style={{
                        paddingTop: i > 0 ? "0.875rem" : undefined,
                        paddingBottom: "0.875rem",
                        borderTop: i > 0 ? "0.5px solid #d8d4cc" : undefined,
                      }}
                    >
                      <div className="flex gap-3">
                        {/* Number */}
                        <span
                          className="font-serif shrink-0"
                          style={{
                            fontSize: "20px",
                            color: "#326891",
                            fontWeight: 700,
                            lineHeight: 1,
                            width: "1.75rem",
                            paddingTop: "2px",
                          }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>

                        {/* Content */}
                        <div>
                          <Link
                            href={`/category/${article.categorySlug}`}
                            style={{
                              fontSize: "9px",
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              color: "#326891",
                              display: "block",
                              marginBottom: "0.25rem",
                              textDecoration: "none",
                            }}
                          >
                            {article.category}
                          </Link>
                          <h3
                            style={{
                              fontSize: "13px",
                              color: "#1a1a1a",
                              fontWeight: 500,
                              lineHeight: 1.35,
                              marginBottom: "0.25rem",
                            }}
                          >
                            <Link
                              href={`/reviews/${article.slug}`}
                              className="hover:text-[#326891] transition-colors"
                              style={{ textDecoration: "none", color: "inherit" }}
                            >
                              {article.title}
                            </Link>
                          </h3>
                          <span style={{ fontSize: "10px", color: "#888" }}>
                            {formatDate(article.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── Latest Reviews (3-column card grid) ──────────────── */}
        {latest.length > 0 && (
          <section
            className="py-12 border-b border-[#d8d4cc]"
            style={{ borderBottomWidth: "0.5px" }}
          >
            <h2
              className="font-medium text-[#888] uppercase tracking-widest"
              style={{ fontSize: "11px", marginBottom: "1.5rem" }}
            >
              Latest Reviews
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {latest.map((article) => (
                <div
                  key={article.slug}
                  className="flex flex-col hover:border-[#326891] transition-colors"
                  style={{
                    border: "0.5px solid #d8d4cc",
                    borderRadius: "8px",
                    overflow: "hidden",
                    background: "#fdfaf5",
                  }}
                >
                  {/* Image well */}
                  <div
                    style={{
                      height: "160px",
                      background: "#f4f0e8",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    {article.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={article.image}
                        alt={article.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            background: "#ece8de",
                            display: "block",
                          }}
                          aria-hidden="true"
                        />
                      </div>
                    )}
                  </div>

                  {/* Card body */}
                  <div
                    className="flex flex-col flex-1"
                    style={{ padding: "0.75rem" }}
                  >
                    {/* Category tag */}
                    <Link
                      href={`/category/${article.categorySlug}`}
                      style={{
                        fontSize: "9px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#326891",
                        display: "block",
                        marginBottom: "0.3rem",
                        textDecoration: "none",
                      }}
                    >
                      {article.category}
                    </Link>

                    {/* Headline */}
                    <h3
                      className="font-serif"
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#1a1a1a",
                        lineHeight: 1.35,
                        marginBottom: "0.625rem",
                        flex: 1,
                      }}
                    >
                      <Link
                        href={`/reviews/${article.slug}`}
                        className="hover:text-[#326891] transition-colors"
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {article.title}
                      </Link>
                    </h3>

                    {/* Score + date */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {article.scorecard && (
                        <span
                          style={{
                            background: "#e8f1f7",
                            color: "#1a3a52",
                            fontSize: "11px",
                            fontWeight: 500,
                            padding: "0.2rem 0.5rem",
                            borderRadius: "4px",
                            display: "inline-block",
                          }}
                        >
                          {(article.scorecard.overallRating / 2).toFixed(1)}&thinsp;/&thinsp;5.0
                        </span>
                      )}
                      <span style={{ fontSize: "10px", color: "#888" }}>
                        {formatDate(article.date)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════
          Subscribe — full width
      ═══════════════════════════════════════════════════════════ */}
      <section style={{ background: "#1a1a1a", width: "100%" }} className="py-16 text-center">
        <div className="max-w-md mx-auto px-4">
          <h2
            className="font-serif"
            style={{ fontSize: "20px", color: "#fdfaf5", marginBottom: "0.5rem" }}
          >
            Stay clinician-forward
          </h2>
          <p
            style={{
              fontSize: "12px",
              color: "#777",
              lineHeight: 1.65,
              marginBottom: "2rem",
            }}
          >
            New reviews every week. No sponsored content. Ever.
          </p>
          <form className="flex flex-col sm:flex-row gap-2 w-full">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 w-full outline-none focus:border-[#326891] transition-colors placeholder-[#666]"
              style={{
                background: "#2a2a2a",
                border: "0.5px solid #444",
                borderRadius: "4px",
                color: "#fdfaf5",
                fontSize: "13px",
                padding: "0.5rem 0.75rem",
                minHeight: "44px",
              }}
            />
            <button
              type="submit"
              className="hover:bg-[#1a3a52] transition-colors w-full sm:w-auto"
              style={{
                background: "#326891",
                color: "#fff",
                borderRadius: "4px",
                fontSize: "12px",
                padding: "0.5rem 1rem",
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontWeight: 500,
                minHeight: "44px",
              }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          Category browser — back in contained column
      ═══════════════════════════════════════════════════════════ */}
      {categories.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <section className="py-12">
            <h2
              className="font-medium text-[#888] uppercase tracking-widest"
              style={{ fontSize: "11px", marginBottom: "1.5rem" }}
            >
              Browse by Category
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="flex flex-col hover:border-[#326891] transition-colors"
                  style={{
                    border: "0.5px solid #d8d4cc",
                    borderRadius: "8px",
                    padding: "0.875rem",
                    background: "#fdfaf5",
                    textDecoration: "none",
                  }}
                >
                  <span
                    style={{
                      fontSize: "20px",
                      color: "#326891",
                      lineHeight: 1,
                      marginBottom: "0.4rem",
                      display: "block",
                    }}
                    aria-hidden="true"
                  >
                    {cat.icon}
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#1a1a1a",
                      marginBottom: "0.2rem",
                      display: "block",
                    }}
                  >
                    {cat.label}
                  </span>
                  <span
                    style={{ fontSize: "11px", color: "#888", display: "block" }}
                  >
                    {cat.count} reviews
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
}

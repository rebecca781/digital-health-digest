import Link from "next/link";
import CategoryTag from "./components/CategoryTag";
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
  { label: "All", slug: "all" },
  { label: "Men's health", slug: "mens-health" },
  { label: "Women's health", slug: "womens-health" },
  { label: "Mental health", slug: "mental-health" },
  { label: "Weight loss", slug: "weight-loss" },
  { label: "Dermatology", slug: "dermatology" },
  { label: "Primary care", slug: "primary-care" },
  { label: "Specialty", slug: "specialty" },
  { label: "Compounding", slug: "compounding" },
];

export default async function HomePage() {
  const [hero, mostRead, latest, categories] = await Promise.all([
    safeFetch<SanityArticle | null>(FEATURED_ARTICLE_QUERY, {}, null),
    safeFetch<SanityArticle[]>(MOST_READ_QUERY, {}, []),
    safeFetch<SanityArticle[]>(LATEST_ARTICLES_QUERY, {}, []),
    safeFetch<SanityCategory[]>(ALL_CATEGORIES_QUERY, {}, []),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-6">

      {/* ── Category filter bar ───────────────────────────────────────── */}
      <div
        className="flex items-center gap-7 overflow-x-auto py-4 border-b border-[#d8d4cc] text-sm"
        style={{ borderBottomWidth: "0.5px" }}
      >
        {FILTER_CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="whitespace-nowrap text-[#4a4a4a] hover:text-[#326891] transition-colors"
          >
            {cat.label}
          </Link>
        ))}
      </div>

      {/* ── Hero + Most Read (2-column grid) ─────────────────────────── */}
      {(hero || mostRead.length > 0) && (
        <section
          className="py-14 border-b border-[#d8d4cc] grid grid-cols-1 md:grid-cols-[3fr_2fr]"
          style={{ borderBottomWidth: "0.5px" }}
        >
          {/* Left — featured article */}
          <div
            className="md:pr-10 md:border-r border-[#d8d4cc] flex flex-col justify-start gap-4"
            style={{ borderRightWidth: "0.5px" }}
          >
            {hero && (
              <>
                <CategoryTag label={hero.category} slug={hero.categorySlug} />

                <h1 className="font-serif text-3xl leading-snug text-[#1a1a1a]">
                  <Link
                    href={`/reviews/${hero.slug}`}
                    className="hover:text-[#326891] transition-colors"
                  >
                    {hero.title}
                  </Link>
                </h1>

                <p className="text-[#4a4a4a] text-base leading-relaxed">
                  {hero.summary}
                </p>

                <div className="flex items-center gap-4 flex-wrap">
                  {hero.scorecard && (
                    <span className="inline-block bg-[#e8f1f7] text-[#1a3a52] text-xs font-medium px-2.5 py-1">
                      {hero.scorecard.overallRating.toFixed(1)}&thinsp;/&thinsp;10
                    </span>
                  )}
                  <p className="text-xs text-[#888]">{formatDate(hero.date)}</p>
                </div>

                <Link
                  href={`/reviews/${hero.slug}`}
                  className="self-start text-sm font-medium text-[#326891] underline underline-offset-2 hover:text-[#1a3a52] transition-colors"
                >
                  Read the review →
                </Link>
              </>
            )}
          </div>

          {/* Right — Most Read sidebar */}
          {mostRead.length > 0 && (
            <div className="md:pl-10 mt-10 md:mt-0">
              <p className="text-xs uppercase tracking-widest font-medium text-[#888] mb-7">
                Most Read
              </p>
              <div className="flex flex-col gap-7">
                {mostRead.map((article, i) => (
                  <div key={article.slug} className="flex gap-4">
                    <span className="font-serif text-xl leading-none text-[#326891] w-7 shrink-0 pt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex flex-col gap-1">
                      <CategoryTag
                        label={article.category}
                        slug={article.categorySlug}
                      />
                      <h3 className="font-serif text-base leading-snug text-[#1a1a1a]">
                        <Link
                          href={`/reviews/${article.slug}`}
                          className="hover:text-[#326891] transition-colors"
                        >
                          {article.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-[#888]">
                        {formatDate(article.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── Latest Reviews (3-column card grid) ──────────────────────── */}
      {latest.length > 0 && (
        <section
          className="py-12 border-b border-[#d8d4cc]"
          style={{ borderBottomWidth: "0.5px" }}
        >
          <h2 className="text-xs uppercase tracking-widest font-medium text-[#888] mb-8">
            Latest Reviews
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latest.map((article) => (
              <div key={article.slug} className="flex flex-col gap-3">
                {/* Image well */}
                <div className="w-full aspect-video bg-[#f4f0e8] flex items-center justify-center overflow-hidden">
                  {article.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="bg-[#ece8de] w-9 h-9 rounded-full" aria-hidden="true" />
                  )}
                </div>

                <CategoryTag
                  label={article.category}
                  slug={article.categorySlug}
                />

                <h3 className="font-serif text-base leading-snug text-[#1a1a1a]">
                  <Link
                    href={`/reviews/${article.slug}`}
                    className="hover:text-[#326891] transition-colors"
                  >
                    {article.title}
                  </Link>
                </h3>

                <div className="flex items-center gap-3 flex-wrap">
                  {article.scorecard && (
                    <span className="inline-block bg-[#e8f1f7] text-[#1a3a52] text-xs font-medium px-2 py-0.5">
                      {article.scorecard.overallRating.toFixed(1)}&thinsp;/&thinsp;10
                    </span>
                  )}
                  <p className="text-xs text-[#888]">{formatDate(article.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Subscribe ─────────────────────────────────────────────────── */}
      <section className="py-16 my-12 bg-[#1a1a1a] text-center px-8">
        <h2 className="font-serif text-2xl text-[#fdfaf5] mb-2">
          Stay clinician-forward
        </h2>
        <p className="text-sm text-[#777] mb-8 max-w-md mx-auto">
          New reviews every week. No sponsored content. Ever.
        </p>
        <form className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="your@email.com"
            className="w-full sm:flex-1 px-4 py-2.5 text-sm border border-[#444] bg-[#2a2a2a] text-[#fdfaf5] placeholder-[#666] outline-none focus:border-[#326891] transition-colors"
            style={{ borderWidth: "0.5px" }}
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-[#326891] text-white text-sm font-medium hover:bg-[#1a3a52] transition-colors whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
      </section>

      {/* ── Category Browser (4-column) ───────────────────────────────── */}
      {categories.length > 0 && (
        <section className="py-12">
          <h2 className="text-xs uppercase tracking-widest font-medium text-[#888] mb-8">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="flex items-center gap-3 border border-[#d8d4cc] px-4 py-4 hover:border-[#326891] transition-colors group"
                style={{ borderWidth: "0.5px" }}
              >
                {/* Flat icon — no circle background */}
                <span className="text-lg text-[#326891] leading-none select-none shrink-0">
                  {cat.icon}
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-[#1a1a1a] group-hover:text-[#326891] transition-colors truncate">
                    {cat.label}
                  </span>
                  <span className="text-xs text-[#888]">
                    {cat.count} reviews
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

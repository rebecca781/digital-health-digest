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

// Revalidate every 60 seconds — bump to 0 in dev if you want live refresh
export const revalidate = 60;

const ALL_CATEGORIES = [
  { label: "All", slug: "all" },
  { label: "Men's health", slug: "mens-health" },
  { label: "Women's health", slug: "womens-health" },
  { label: "Mental health", slug: "mental-health" },
  { label: "Weight loss", slug: "weight-loss" },
  { label: "Dermatology", slug: "dermatology" },
  { label: "Primary care", slug: "primary-care" },
  { label: "Specialty", slug: "specialty" },
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
      {/* Category filter bar */}
      <div
        className="flex items-center gap-7 overflow-x-auto py-4 border-b border-[#e0e0e0] text-sm"
        style={{ borderBottomWidth: "0.5px" }}
      >
        {ALL_CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="whitespace-nowrap text-[#444444] hover:text-[#3B6D11] transition-colors"
          >
            {cat.label}
          </Link>
        ))}
      </div>

      {/* Hero article */}
      {hero && (
        <section
          className="grid grid-cols-1 md:grid-cols-2 gap-12 py-14 border-b border-[#e0e0e0]"
          style={{ borderBottomWidth: "0.5px" }}
        >
          <div className="w-full aspect-[4/3] bg-[#EAF3DE] flex items-center justify-center">
            {hero.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={hero.image}
                alt={hero.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[#3B6D11] text-xs uppercase tracking-widest font-medium">
                Featured image
              </span>
            )}
          </div>
          <div className="flex flex-col justify-center gap-4">
            <CategoryTag label={hero.category} slug={hero.categorySlug} />
            <h1 className="font-serif text-3xl leading-snug text-[#111111]">
              <Link
                href={`/reviews/${hero.slug}`}
                className="hover:text-[#3B6D11] transition-colors"
              >
                {hero.title}
              </Link>
            </h1>
            <p className="text-sm text-[#999999]">{formatDate(hero.date)}</p>
            <p className="text-[#444444] text-base leading-relaxed">
              {hero.summary}
            </p>
            <Link
              href={`/reviews/${hero.slug}`}
              className="mt-2 self-start text-sm font-medium text-[#3B6D11] border border-[#3B6D11] px-4 py-2 hover:bg-[#3B6D11] hover:text-white transition-colors"
              style={{ borderWidth: "0.5px" }}
            >
              Read the review →
            </Link>
          </div>
        </section>
      )}

      {/* Most read */}
      {mostRead.length > 0 && (
        <section
          className="py-12 border-b border-[#e0e0e0]"
          style={{ borderBottomWidth: "0.5px" }}
        >
          <h2 className="text-xs uppercase tracking-widest font-medium text-[#999999] mb-8">
            Most Read
          </h2>
          <div className="flex flex-col">
            {mostRead.map((article, i) => (
              <div
                key={article.slug}
                className="flex items-start gap-6 py-6 border-b border-[#eeeeee]"
                style={{ borderBottomWidth: "0.5px" }}
              >
                <span className="text-2xl font-serif text-[#cccccc] w-8 shrink-0 leading-none pt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-1.5">
                  <CategoryTag
                    label={article.category}
                    slug={article.categorySlug}
                  />
                  <h3 className="font-serif text-xl leading-snug text-[#111111]">
                    <Link
                      href={`/reviews/${article.slug}`}
                      className="hover:text-[#3B6D11] transition-colors"
                    >
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-[#aaaaaa]">
                    {formatDate(article.date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Latest reviews */}
      {latest.length > 0 && (
        <section
          className="py-12 border-b border-[#e0e0e0]"
          style={{ borderBottomWidth: "0.5px" }}
        >
          <h2 className="text-xs uppercase tracking-widest font-medium text-[#999999] mb-8">
            Latest Reviews
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latest.map((article) => (
              <div key={article.slug} className="flex flex-col gap-3">
                <div className="w-full aspect-video bg-[#EAF3DE] flex items-center justify-center overflow-hidden">
                  {article.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[#3B6D11] text-xs uppercase tracking-widest font-medium">
                      Image
                    </span>
                  )}
                </div>
                <CategoryTag
                  label={article.category}
                  slug={article.categorySlug}
                />
                <h3 className="font-serif text-base leading-snug text-[#111111]">
                  <Link
                    href={`/reviews/${article.slug}`}
                    className="hover:text-[#3B6D11] transition-colors"
                  >
                    {article.title}
                  </Link>
                </h3>
                <p className="text-xs text-[#aaaaaa]">
                  {formatDate(article.date)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Email subscribe */}
      <section className="py-16 my-12 bg-[#EAF3DE] text-center px-8">
        <h2 className="font-serif text-2xl text-[#27500A] mb-2">
          Stay current on DTC health
        </h2>
        <p className="text-sm text-[#3B6D11] mb-8 max-w-md mx-auto">
          New reviews, comparison guides, and category deep-dives — delivered
          weekly.
        </p>
        <form className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="your@email.com"
            className="w-full sm:flex-1 px-4 py-2.5 text-sm border border-[#3B6D11] bg-white text-[#111111] placeholder-[#bbbbbb] outline-none focus:ring-1 focus:ring-[#3B6D11]"
            style={{ borderWidth: "0.5px" }}
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-[#3B6D11] text-white text-sm font-medium hover:bg-[#27500A] transition-colors whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
      </section>

      {/* Category browser */}
      {categories.length > 0 && (
        <section className="py-12">
          <h2 className="text-xs uppercase tracking-widest font-medium text-[#999999] mb-8">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="flex items-center gap-4 border border-[#e0e0e0] px-5 py-4 hover:border-[#3B6D11] transition-colors group"
                style={{ borderWidth: "0.5px" }}
              >
                <span className="text-xl text-[#3B6D11]">{cat.icon}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-[#111111] group-hover:text-[#3B6D11] transition-colors">
                    {cat.label}
                  </span>
                  <span className="text-xs text-[#aaaaaa]">
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

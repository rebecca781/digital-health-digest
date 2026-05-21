import { notFound } from "next/navigation";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
import CategoryTag from "@/app/components/CategoryTag";
import Scorecard from "@/app/components/Scorecard";
import { formatDate } from "@/lib/formatDate";
import { safeFetch, sanityIsConfigured } from "@/sanity/lib/client";
import {
  ARTICLE_BY_SLUG_QUERY,
  RELATED_ARTICLES_QUERY,
  ALL_ARTICLE_SLUGS_QUERY,
} from "@/sanity/lib/queries";
import type { SanityArticle, SanityArticleWithBody } from "@/types/sanity";

export const revalidate = 60;

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  if (!sanityIsConfigured) return [];
  const slugs = await safeFetch<string[]>(ALL_ARTICLE_SLUGS_QUERY, {}, []);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const article = await safeFetch<SanityArticleWithBody | null>(
    ARTICLE_BY_SLUG_QUERY,
    { slug: params.slug },
    null
  );
  if (!article) return {};
  return {
    title: `${article.title} | The Digital Health Digest`,
    description: article.summary,
  };
}

/** Portable Text component overrides — matches the site's editorial style */
const ptComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-[#333333] leading-relaxed text-base mb-5">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="font-serif text-xl text-[#111111] mt-10 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-serif text-lg text-[#111111] mt-8 mb-3">{children}</h3>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  },
};

export default async function ReviewPage({ params }: PageProps) {
  const article = await safeFetch<SanityArticleWithBody | null>(
    ARTICLE_BY_SLUG_QUERY,
    { slug: params.slug },
    null
  );

  if (!article) notFound();

  const relatedArticles = await safeFetch<SanityArticle[]>(
    RELATED_ARTICLES_QUERY,
    { slug: params.slug, categorySlug: article.categorySlug },
    []
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <p className="text-xs text-[#aaaaaa] mb-8">
        <Link href="/" className="hover:text-[#3B6D11] transition-colors">
          Home
        </Link>{" "}
        /{" "}
        <Link
          href={`/category/${article.categorySlug}`}
          className="hover:text-[#3B6D11] transition-colors"
        >
          {article.category}
        </Link>{" "}
        / Review
      </p>

      <div className="max-w-2xl">
        <CategoryTag label={article.category} slug={article.categorySlug} />
        <h1 className="font-serif text-4xl leading-snug text-[#111111] mt-3 mb-4">
          {article.title}
        </h1>
        <p className="text-sm text-[#999999] mb-8">{formatDate(article.date)}</p>
      </div>

      {/* Hero image */}
      <div className="w-full aspect-[16/7] bg-[#EAF3DE] flex items-center justify-center mb-12 overflow-hidden">
        {article.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-[#3B6D11] text-xs uppercase tracking-widest font-medium">
            Article image
          </span>
        )}
      </div>

      {/* Scorecard */}
      {article.scorecard && <Scorecard scorecard={article.scorecard} />}

      {/* Summary callout */}
      <div className="max-w-2xl mb-10 border-l-2 border-[#3B6D11] pl-5 py-1">
        <p className="text-base text-[#444444] leading-relaxed italic">
          {article.summary}
        </p>
      </div>

      {/* Body — Portable Text */}
      <div className="max-w-2xl">
        {article.body && article.body.length > 0 ? (
          <PortableText value={article.body} components={ptComponents} />
        ) : (
          <p className="text-sm text-[#aaaaaa] italic">Body content coming soon.</p>
        )}
      </div>

      {/* Divider */}
      <div
        className="border-t border-[#e0e0e0] my-16 max-w-2xl"
        style={{ borderTopWidth: "0.5px" }}
      />

      {/* Related reviews */}
      {relatedArticles.length > 0 && (
        <section className="max-w-2xl">
          <h2 className="text-xs uppercase tracking-widest font-medium text-[#999999] mb-6">
            More in {article.category}
          </h2>
          <div className="flex flex-col gap-6">
            {relatedArticles.map((r) => (
              <div
                key={r.slug}
                className="border-b border-[#eeeeee] pb-6"
                style={{ borderBottomWidth: "0.5px" }}
              >
                <CategoryTag label={r.category} slug={r.categorySlug} />
                <h3 className="font-serif text-lg leading-snug text-[#111111] mt-1.5">
                  <Link
                    href={`/reviews/${r.slug}`}
                    className="hover:text-[#3B6D11] transition-colors"
                  >
                    {r.title}
                  </Link>
                </h3>
                <p className="text-xs text-[#aaaaaa] mt-1">
                  {formatDate(r.date)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

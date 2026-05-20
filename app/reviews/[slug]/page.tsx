import { notFound } from "next/navigation";
import Link from "next/link";
import CategoryTag from "@/app/components/CategoryTag";
import Scorecard from "@/app/components/Scorecard";
import { formatDate } from "@/lib/formatDate";
import articles from "@/data/articles.json";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: PageProps) {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) return {};
  return {
    title: `${article.title} | The Digital Health Digest`,
    description: article.summary,
  };
}

function renderBody(body: string) {
  const paragraphs = body.split("\n\n");
  return paragraphs.map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2
          key={i}
          className="font-serif text-xl text-[#111111] mt-10 mb-4"
        >
          {block.replace("## ", "")}
        </h2>
      );
    }
    return (
      <p key={i} className="text-[#333333] leading-relaxed text-base mb-5">
        {block}
      </p>
    );
  });
}

export default function ReviewPage({ params }: PageProps) {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) notFound();

  const related = articles
    .filter(
      (a) => a.categorySlug === article.categorySlug && a.slug !== article.slug
    )
    .slice(0, 3);

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

      {/* Hero image placeholder */}
      <div className="w-full aspect-[16/7] bg-[#EAF3DE] flex items-center justify-center mb-12">
        <span className="text-[#3B6D11] text-xs uppercase tracking-widest font-medium">
          Article image
        </span>
      </div>

      {/* Scorecard */}
      {article.scorecard && (
        <Scorecard scorecard={article.scorecard} />
      )}

      {/* Summary callout */}
      <div
        className="max-w-2xl mb-10 border-l-2 border-[#3B6D11] pl-5 py-1"
      >
        <p className="text-base text-[#444444] leading-relaxed italic">
          {article.summary}
        </p>
      </div>

      {/* Body */}
      <div className="max-w-2xl">{renderBody(article.body)}</div>

      {/* Divider */}
      <div
        className="border-t border-[#e0e0e0] my-16 max-w-2xl"
        style={{ borderTopWidth: "0.5px" }}
      />

      {/* Related reviews */}
      {related.length > 0 && (
        <section className="max-w-2xl">
          <h2 className="text-xs uppercase tracking-widest font-medium text-[#999999] mb-6">
            More in {article.category}
          </h2>
          <div className="flex flex-col gap-6">
            {related.map((r) => (
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

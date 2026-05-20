import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryTag from "@/app/components/CategoryTag";
import { formatDate } from "@/lib/formatDate";
import articles from "@/data/articles.json";
import categories from "@/data/categories.json";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  const slugs = categories.map((c) => ({ slug: c.slug }));
  return [...slugs, { slug: "all" }];
}

export default function CategoryPage({ params }: PageProps) {
  const { slug } = params;

  const isAll = slug === "all";
  const category = isAll ? null : categories.find((c) => c.slug === slug);

  if (!isAll && !category) notFound();

  const filtered = isAll
    ? articles
    : articles.filter((a) => a.categorySlug === slug);

  const heading = isAll ? "All Reviews" : category!.label;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <p className="text-xs text-[#aaaaaa] mb-6">
        <Link href="/" className="hover:text-[#3B6D11] transition-colors">
          Home
        </Link>{" "}
        / {heading}
      </p>

      <h1 className="font-serif text-3xl text-[#111111] mb-10">{heading}</h1>

      {/* Category pills */}
      <div className="flex flex-wrap gap-3 mb-10">
        <Link
          href="/category/all"
          className={`text-xs px-3 py-1.5 border transition-colors ${
            isAll
              ? "border-[#3B6D11] text-[#3B6D11]"
              : "border-[#e0e0e0] text-[#666666] hover:border-[#3B6D11] hover:text-[#3B6D11]"
          }`}
          style={{ borderWidth: "0.5px" }}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className={`text-xs px-3 py-1.5 border transition-colors ${
              cat.slug === slug
                ? "border-[#3B6D11] text-[#3B6D11]"
                : "border-[#e0e0e0] text-[#666666] hover:border-[#3B6D11] hover:text-[#3B6D11]"
            }`}
            style={{ borderWidth: "0.5px" }}
          >
            {cat.label}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-[#aaaaaa]">No reviews yet in this category.</p>
      ) : (
        <div className="flex flex-col divide-y divide-[#eeeeee]">
          {filtered.map((article) => (
            <div
              key={article.slug}
              className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 py-8"
              style={{ borderBottomWidth: "0.5px" }}
            >
              <div className="w-full aspect-video bg-[#EAF3DE] flex items-center justify-center shrink-0">
                <span className="text-[#3B6D11] text-xs uppercase tracking-widest font-medium">
                  Image
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <CategoryTag
                  label={article.category}
                  slug={article.categorySlug}
                />
                <h2 className="font-serif text-xl leading-snug text-[#111111]">
                  <Link
                    href={`/reviews/${article.slug}`}
                    className="hover:text-[#3B6D11] transition-colors"
                  >
                    {article.title}
                  </Link>
                </h2>
                <p className="text-xs text-[#aaaaaa]">
                  {formatDate(article.date)}
                </p>
                <p className="text-sm text-[#555555] leading-relaxed line-clamp-2">
                  {article.summary}
                </p>
                <Link
                  href={`/reviews/${article.slug}`}
                  className="mt-1 self-start text-xs font-medium text-[#3B6D11] hover:underline"
                >
                  Read the review →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

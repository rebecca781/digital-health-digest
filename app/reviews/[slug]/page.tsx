import { notFound } from "next/navigation";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
import CategoryTag from "@/app/components/CategoryTag";
import { formatDate } from "@/lib/formatDate";
import { safeFetch, sanityIsConfigured } from "@/sanity/lib/client";
import {
  ARTICLE_BY_SLUG_QUERY,
  RELATED_ARTICLES_QUERY,
  ALL_ARTICLE_SLUGS_QUERY,
} from "@/sanity/lib/queries";
import type {
  SanityArticle,
  SanityArticleWithBody,
  SanityScorecard,
  SanityComparisonPlatform,
  SanityComparisonScore,
} from "@/types/sanity";

export const revalidate = 60;

interface PageProps {
  params: { slug: string };
}

// ─── Static params ───────────────────────────────────────────────────────────

export async function generateStaticParams() {
  if (!sanityIsConfigured) return [];
  const slugs = await safeFetch<string[]>(ALL_ARTICLE_SLUGS_QUERY, {}, []);
  return slugs.map((slug) => ({ slug }));
}

// ─── Metadata ────────────────────────────────────────────────────────────────

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

// ─── Portable Text components ─────────────────────────────────────────────────

const ptComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p
        className="mb-6 text-[#1a1a1a]"
        style={{ fontSize: "17px", lineHeight: "1.8" }}
      >
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2
        className="font-serif text-[#1a1a1a] mt-12 mb-4 border-l-[3px] border-[#326891]"
        style={{ fontSize: "26px", lineHeight: "1.3", paddingLeft: "12px" }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        className="font-serif text-[#1a1a1a] mt-10 mb-3"
        style={{ fontSize: "18px", lineHeight: "1.4" }}
      >
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <div
        className="my-8 rounded-lg"
        style={{
          background: "#f4f0e8",
          borderRadius: "8px",
          padding: "1.25rem",
        }}
      >
        <p
          className="text-[#1a1a1a]"
          style={{ fontSize: "16px", lineHeight: "1.7", margin: 0 }}
        >
          {children}
        </p>
      </div>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-[#1a1a1a]">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        className="text-[#326891] no-underline hover:underline transition-colors"
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={value?.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
  },
};

// ─── Per-category score rows ──────────────────────────────────────────────────

const CATEGORY_SCORES: {
  key: keyof Pick<
    SanityScorecard,
    "clinicalQuality" | "pricing" | "privacy" | "patientExperience" | "ongoingCare"
  >;
  label: string;
}[] = [
  { key: "clinicalQuality",   label: "Clinical quality"   },
  { key: "pricing",           label: "Pricing"            },
  { key: "privacy",           label: "Privacy"            },
  { key: "patientExperience", label: "Patient experience" },
  { key: "ongoingCare",       label: "Ongoing care"       },
];

// ─── Scorecard sidebar (desktop right column) ─────────────────────────────────

function ScorecardSidebar({ sc }: { sc: SanityScorecard }) {
  // overallRating is stored 0–10; display as /5.0
  const displayScore = (sc.overallRating / 2).toFixed(1);

  return (
    <div
      className="border border-[#d8d4cc] overflow-hidden"
      style={{ borderWidth: "0.5px" }}
    >
      {/* Overall score */}
      <div className="px-5 pt-5 pb-4">
        <div
          className="rounded-[6px] bg-[#e8f1f7] px-5 py-5 text-center"
        >
          <div className="flex items-baseline justify-center gap-1 leading-none">
            <span
              className="font-serif font-bold text-[#1a3a52]"
              style={{ fontSize: "48px" }}
            >
              {displayScore}
            </span>
            <span className="text-base text-[#326891] font-medium">
              &thinsp;/ 5.0
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-[#326891] mt-2.5">
            Overall score
          </p>
        </div>
      </div>

      <div className="border-t border-[#d8d4cc]" style={{ borderTopWidth: "0.5px" }} />

      {/* Per-category scores */}
      <div className="px-5 py-4 flex flex-col gap-3.5">
        {CATEGORY_SCORES.map(({ key, label }) => {
          const score = sc[key] ?? 0;
          const pct = Math.min((score / 5) * 100, 100);
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] uppercase tracking-wide text-[#888]">
                  {label}
                </span>
                <span
                  className="text-[#1a3a52] tabular-nums"
                  style={{ fontSize: "13px" }}
                >
                  {score.toFixed(1)}
                </span>
              </div>
              <div
                className="w-full bg-[#e8f1f7]"
                style={{ height: "4px" }}
              >
                <div
                  className="h-full bg-[#326891]"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-[#d8d4cc]" style={{ borderTopWidth: "0.5px" }} />

      {/* Meta rows */}
      <div className="px-5 py-4 flex flex-col gap-3">
        {[
          { label: "Winner",     value: sc.winner    },
          { label: "Best for",   value: sc.bestFor   },
          { label: "Price tier", value: sc.priceTier },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-start justify-between gap-3">
            <span className="text-[10px] uppercase tracking-widest text-[#888] pt-0.5 shrink-0">
              {label}
            </span>
            <span
              className="font-semibold text-[#1a1a1a] text-right"
              style={{ fontSize: "13px" }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-[#d8d4cc]" style={{ borderTopWidth: "0.5px" }} />

      {/* Pros */}
      <div className="px-5 pt-4 pb-3">
        <p className="text-[10px] uppercase tracking-widest text-[#326891] mb-2.5">
          Pros
        </p>
        <ul className="flex flex-col gap-1.5">
          {sc.pros.map((pro, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-[#1a1a1a]"
              style={{ fontSize: "12px", lineHeight: "1.5" }}
            >
              <span className="text-[#326891] shrink-0 font-medium leading-snug">
                +
              </span>
              {pro}
            </li>
          ))}
        </ul>
      </div>

      {/* Cons */}
      <div className="px-5 pt-3 pb-4 border-t border-[#d8d4cc]" style={{ borderTopWidth: "0.5px" }}>
        <p className="text-[10px] uppercase tracking-widest text-[#888] mb-2.5">
          Cons
        </p>
        <ul className="flex flex-col gap-1.5">
          {sc.cons.map((con, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-[#4a4a4a]"
              style={{ fontSize: "12px", lineHeight: "1.5" }}
            >
              <span className="text-[#888] shrink-0 font-medium leading-snug">
                −
              </span>
              {con}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-[#d8d4cc]" style={{ borderTopWidth: "0.5px" }} />

      {/* How we score */}
      <div className="px-5 py-3 text-center">
        <Link
          href="/how-we-score"
          className="text-[#326891] hover:underline"
          style={{ fontSize: "11px" }}
        >
          How we score →
        </Link>
      </div>
    </div>
  );
}

// ─── Comparison sidebar helpers ──────────────────────────────────────────────

/** Returns a bar fill color based on score value (0–5 scale). */
function barColor(score: number): string {
  if (score >= 4)   return "#2a7a4f"; // green  — high
  if (score >= 2.5) return "#c07e00"; // amber  — mid
  return                "#be3737";    // red    — low
}

function ScoreRow({
  dimension,
  value,
  compact,
}: {
  dimension: string;
  value: number;
  compact: boolean;
}) {
  const pct = Math.min((value / 5) * 100, 100);
  return (
    <div style={{ marginBottom: compact ? "0.4rem" : "0.55rem" }}>
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: "3px" }}
      >
        <span
          className="uppercase tracking-wide text-[#888]"
          style={{ fontSize: compact ? "9px" : "10px", letterSpacing: "0.07em" }}
        >
          {dimension}
        </span>
        <span
          className="tabular-nums text-[#1a3a52]"
          style={{ fontSize: compact ? "11px" : "12px", fontWeight: 500 }}
        >
          {value.toFixed(1)}
        </span>
      </div>
      <div
        className="w-full bg-[#e8f1f7]"
        style={{ height: compact ? "3px" : "4px", borderRadius: "2px" }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: barColor(value),
            borderRadius: "2px",
          }}
        />
      </div>
    </div>
  );
}

// ─── Comparison sidebar (multi-platform) ─────────────────────────────────────

function ComparisonSidebar({ platforms }: { platforms: SanityComparisonPlatform[] }) {
  // Sort: isWinner === true always first, then by overallScore descending.
  // Use a stable copy so we never mutate the prop.
  const sorted = [...platforms].sort((a, b) => {
    if (a.isWinner && !b.isWinner) return -1;
    if (!a.isWinner && b.isWinner) return 1;
    return b.overallScore - a.overallScore;
  });

  const [first, ...rest] = sorted;

  return (
    <div
      className="border border-[#d8d4cc] overflow-hidden"
      style={{ borderWidth: "0.5px" }}
    >
      {/* ── Top-pick badge — only when the first item is the actual winner ── */}
      {first.isWinner && (
        <div className="px-5 pt-5 pb-3">
          <span
            style={{
              display: "inline-block",
              background: "#326891",
              color: "#fff",
              fontSize: "9px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "0.25rem 0.65rem",
              borderRadius: "999px",
            }}
          >
            Top pick
          </span>
        </div>
      )}

      {/* ── First (winner) card ───────────────────────────── */}
      <div style={{ padding: "1.25rem", paddingTop: first.isWinner ? "0.5rem" : "1.25rem" }}>
        {/* Name + platform type */}
        <p
          className="text-[#1a1a1a] font-semibold"
          style={{ fontSize: "15px", marginBottom: "2px" }}
        >
          {first.url ? (
            <a
              href={first.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#326891] transition-colors"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {first.name}
            </a>
          ) : (
            first.name
          )}
        </p>
        {first.platformType && (
          <p
            className="uppercase tracking-wide text-[#888]"
            style={{ fontSize: "9px", letterSpacing: "0.08em", marginBottom: "0.6rem" }}
          >
            {first.platformType}
          </p>
        )}

        {/* Overall score box */}
        <div
          className="rounded-[6px] bg-[#e8f1f7] px-4 py-4 text-center"
          style={{ marginBottom: "1rem" }}
        >
          <div className="flex items-baseline justify-center gap-1 leading-none">
            <span
              className="font-serif font-bold text-[#1a3a52]"
              style={{ fontSize: "32px" }}
            >
              {first.overallScore.toFixed(1)}
            </span>
            <span className="text-[#326891] font-medium" style={{ fontSize: "14px" }}>
              &thinsp;/ 5.0
            </span>
          </div>
          <p
            className="uppercase tracking-widest text-[#326891]"
            style={{ fontSize: "9px", marginTop: "0.4rem" }}
          >
            Overall score
          </p>
        </div>

        {/* Dimension bars — full size */}
        {first.scores.map((s: SanityComparisonScore) => (
          <ScoreRow
            key={s.dimension}
            dimension={s.dimension}
            value={s.value}
            compact={false}
          />
        ))}
      </div>

      {/* ── Remaining platforms ───────────────────────────── */}
      {rest.length > 0 && (
        <>
          <div
            className="border-t border-[#d8d4cc]"
            style={{ borderTopWidth: "0.5px" }}
          />
          {/* Section label */}
          <div className="px-5 py-2.5 text-center">
            <span
              className="uppercase tracking-widest text-[#888]"
              style={{ fontSize: "9px", letterSpacing: "0.1em" }}
            >
              How the others scored
            </span>
          </div>

          {/* Loop through every remaining platform */}
          {rest.map((platform) => (
            <div key={platform.name}>
              <div
                className="border-t border-[#d8d4cc]"
                style={{ borderTopWidth: "0.5px" }}
              />
              <div style={{ padding: "1.25rem" }}>
                {/* Name + score inline */}
                <div
                  className="flex items-start justify-between gap-2"
                  style={{ marginBottom: "0.6rem" }}
                >
                  <div className="min-w-0">
                    <p
                      className="text-[#1a1a1a] font-medium truncate"
                      style={{ fontSize: "12px", marginBottom: "1px" }}
                    >
                      {platform.url ? (
                        <a
                          href={platform.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#326891] transition-colors"
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          {platform.name}
                        </a>
                      ) : (
                        platform.name
                      )}
                    </p>
                    {platform.platformType && (
                      <p
                        className="uppercase tracking-wide text-[#888]"
                        style={{ fontSize: "9px", letterSpacing: "0.07em" }}
                      >
                        {platform.platformType}
                      </p>
                    )}
                  </div>
                  <span
                    className="font-serif font-bold text-[#4a4a4a] shrink-0"
                    style={{ fontSize: "20px", lineHeight: 1 }}
                  >
                    {platform.overallScore.toFixed(1)}
                  </span>
                </div>

                {/* Dimension bars — compact */}
                {platform.scores.map((s: SanityComparisonScore) => (
                  <ScoreRow
                    key={s.dimension}
                    dimension={s.dimension}
                    value={s.value}
                    compact={true}
                  />
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {/* ── How we score footer link ──────────────────────── */}
      <div
        className="border-t border-[#d8d4cc] px-5 py-3 text-center"
        style={{ borderTopWidth: "0.5px" }}
      >
        <Link
          href="/how-we-score"
          className="text-[#326891] hover:underline"
          style={{ fontSize: "11px" }}
        >
          How we score →
        </Link>
      </div>
    </div>
  );
}

// ─── Mobile comparison stack (inline, below lg breakpoint) ───────────────────
// Rendered between the hero image and the article body on small screens.
// Mirrors the sidebar sort logic: isWinner first, then by overallScore desc.

function MobileComparisonStack({ platforms }: { platforms: SanityComparisonPlatform[] }) {
  const sorted = [...platforms].sort((a, b) => {
    if (a.isWinner && !b.isWinner) return -1;
    if (!a.isWinner && b.isWinner) return 1;
    return b.overallScore - a.overallScore;
  });

  return (
    <div className="lg:hidden flex flex-col gap-4 py-8">
      {sorted.map((platform) => (
        <div
          key={platform.name}
          className="border border-[#d8d4cc] overflow-hidden"
          style={{ borderWidth: "0.5px" }}
        >
          {/* Top-pick badge — only on the actual winner */}
          {platform.isWinner && (
            <div className="px-4 pt-4 pb-2">
              <span
                style={{
                  display: "inline-block",
                  background: "#326891",
                  color: "#fff",
                  fontSize: "9px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "0.25rem 0.65rem",
                  borderRadius: "999px",
                }}
              >
                Top pick
              </span>
            </div>
          )}

          {/* Card body */}
          <div
            style={{
              padding: "1.25rem",
              paddingTop: platform.isWinner ? "0.5rem" : "1.25rem",
            }}
          >
            {/* Name */}
            <p
              className="text-[#1a1a1a] font-semibold"
              style={{ fontSize: "15px", marginBottom: "2px" }}
            >
              {platform.url ? (
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#326891] transition-colors"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {platform.name}
                </a>
              ) : (
                platform.name
              )}
            </p>

            {platform.platformType && (
              <p
                className="uppercase tracking-wide text-[#888]"
                style={{ fontSize: "9px", letterSpacing: "0.08em", marginBottom: "0.75rem" }}
              >
                {platform.platformType}
              </p>
            )}

            {/* Overall score */}
            <div className="flex items-baseline gap-1" style={{ marginBottom: "0.875rem" }}>
              <span
                className="font-serif font-bold text-[#1a3a52]"
                style={{ fontSize: platform.isWinner ? "32px" : "24px" }}
              >
                {platform.overallScore.toFixed(1)}
              </span>
              <span className="text-[#326891] font-medium" style={{ fontSize: "13px" }}>
                &thinsp;/ 5.0
              </span>
            </div>

            {/* Dimension score bars */}
            {platform.scores.map((s: SanityComparisonScore) => (
              <ScoreRow
                key={s.dimension}
                dimension={s.dimension}
                value={s.value}
                compact={!platform.isWinner}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="text-center">
        <Link
          href="/how-we-score"
          className="text-[#326891] hover:underline"
          style={{ fontSize: "11px" }}
        >
          How we score →
        </Link>
      </div>
    </div>
  );
}

// ─── Related article card ─────────────────────────────────────────────────────

function RelatedCard({ article }: { article: SanityArticle }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="w-full aspect-video bg-[#f4f0e8] flex items-center justify-center overflow-hidden">
        {article.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span
            className="rounded-full bg-[#ece8de]"
            style={{ width: "36px", height: "36px" }}
            aria-hidden="true"
          />
        )}
      </div>
      <CategoryTag label={article.category} slug={article.categorySlug} />
      <h3
        className="font-serif leading-snug text-[#1a1a1a]"
        style={{ fontSize: "15px" }}
      >
        <Link
          href={`/reviews/${article.slug}`}
          className="hover:text-[#326891] transition-colors"
        >
          {article.title}
        </Link>
      </h3>
      <div className="flex items-center gap-3 flex-wrap">
        {article.scorecard && (
          <span className="inline-block bg-[#e8f1f7] text-[#1a3a52] font-medium px-2 py-0.5" style={{ fontSize: "11px" }}>
            {(article.scorecard.overallRating / 2).toFixed(1)}&thinsp;/&thinsp;5.0
          </span>
        )}
        <p className="text-[#888]" style={{ fontSize: "12px" }}>
          {formatDate(article.date)}
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

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
    <div className="max-w-6xl mx-auto px-6">

      {/* ── 1. Article header ─────────────────────────────────────────── */}
      <header
        className="pt-10 pb-8 border-b border-[#d8d4cc]"
        style={{ borderBottomWidth: "0.5px" }}
      >
        {/* Breadcrumb */}
        <nav className="text-[#888] mb-5" style={{ fontSize: "12px" }}>
          <Link
            href="/category/all"
            className="hover:text-[#326891] transition-colors"
          >
            Reviews
          </Link>
          <span className="mx-2">→</span>
          <Link
            href={`/category/${article.categorySlug}`}
            className="hover:text-[#326891] transition-colors"
          >
            {article.category}
          </Link>
        </nav>

        {/* Category eyebrow */}
        <p
          className="uppercase tracking-widest text-[#326891] mb-4"
          style={{ fontSize: "10px" }}
        >
          {article.category}
        </p>

        {/* Headline */}
        <h1
          className="font-serif text-[#1a1a1a] leading-tight mb-5"
          style={{ fontSize: "clamp(28px, 4vw, 42px)", maxWidth: "780px" }}
        >
          {article.title}
        </h1>

        {/* Dek */}
        <p
          className="text-[#4a4a4a] mb-6"
          style={{ fontSize: "16px", lineHeight: "1.65", maxWidth: "680px" }}
        >
          {article.summary}
        </p>

        {/* Byline */}
        <p className="text-[#888]" style={{ fontSize: "13px" }}>
          By The Digital Health Digest&nbsp;&nbsp;·&nbsp;&nbsp;{formatDate(article.date)}
        </p>
      </header>

      {/* ── 2. Hero image ─────────────────────────────────────────────── */}
      <div
        className="w-full bg-[#f4f0e8] overflow-hidden"
        style={{ maxHeight: "420px" }}
      >
        {article.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.image}
            alt={article.title}
            className="w-full object-cover"
            style={{ maxHeight: "420px", display: "block" }}
          />
        ) : (
          <div
            className="w-full flex items-center justify-center bg-[#f4f0e8]"
            style={{ height: "280px" }}
          >
            <span
              className="rounded-full bg-[#ece8de]"
              style={{ width: "56px", height: "56px", display: "block" }}
              aria-hidden="true"
            />
          </div>
        )}
      </div>

      {/* ── 3. Mobile comparison stack (hidden on lg+) ───────────────── */}
      {Array.isArray(article.comparisonPlatforms) &&
        article.comparisonPlatforms.length > 0 && (
          <MobileComparisonStack platforms={article.comparisonPlatforms} />
        )}

      {/* ── 4. Content grid ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-12 pt-12 pb-16">

        {/* Left — article body */}
        <div style={{ maxWidth: "640px" }}>
          {article.body && article.body.length > 0 ? (
            <PortableText value={article.body} components={ptComponents} />
          ) : (
            <p className="text-[#888] italic" style={{ fontSize: "15px" }}>
              Body content coming soon.
            </p>
          )}
        </div>

        {/* Right — sticky sidebar (desktop only)
            Priority: comparisonPlatforms (non-empty array) → scorecard → nothing.
            Array.isArray guard ensures null/undefined from GROQ never slips through. */}
        {(() => {
          const hasComparisons =
            Array.isArray(article.comparisonPlatforms) &&
            article.comparisonPlatforms.length > 0;
          const hasSidebar = hasComparisons || Boolean(article.scorecard);
          if (!hasSidebar) return null;
          return (
            <aside className="hidden lg:block">
              <div className="sticky" style={{ top: "2rem" }}>
                {hasComparisons ? (
                  <ComparisonSidebar platforms={article.comparisonPlatforms!} />
                ) : (
                  <ScorecardSidebar sc={article.scorecard!} />
                )}
              </div>
            </aside>
          );
        })()}
      </div>

      {/* ── 4. Editorial independence note ───────────────────────────── */}
      <div
        className="border-t border-[#d8d4cc] pt-8 pb-6 text-center"
        style={{ borderTopWidth: "0.5px" }}
      >
        <p className="italic text-[#888]" style={{ fontSize: "12px" }}>
          The Digital Health Digest is editorially independent. We do not accept
          payment from the brands we review.
        </p>
      </div>

      {/* ── 5. More reviews ──────────────────────────────────────────── */}
      {relatedArticles.length > 0 && (
        <section
          className="border-t border-[#d8d4cc] pt-10 pb-16"
          style={{ borderTopWidth: "0.5px" }}
        >
          <h2
            className="uppercase tracking-widest font-medium text-[#888] mb-8"
            style={{ fontSize: "11px" }}
          >
            More reviews
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.map((r) => (
              <RelatedCard key={r.slug} article={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

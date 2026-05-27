import type { Metadata } from "next";
import Link from "next/link";
import { safeFetch } from "@/sanity/lib/client";
import { HOW_WE_SCORE_QUERY } from "@/sanity/lib/queries";
import type { SanityHowWeScore } from "@/types/sanity";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "How We Score | The Telehealth Review",
  description:
    "Every review on The Telehealth Review is based on the same five criteria. Here's exactly how we evaluate telehealth platforms.",
};

export default async function HowWeScorePage() {
  const page = await safeFetch<SanityHowWeScore | null>(HOW_WE_SCORE_QUERY, {}, null);

  const heading = page?.heading ?? "How We Score";
  const subheading =
    page?.subheading ??
    "Every review on The Telehealth Review is based on the same criteria. Here’s exactly how we evaluate telehealth platforms.";
  const criteria = page?.criteria ?? [];
  const independenceNote = page?.independenceNote ?? null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <p className="text-xs text-[#888] mb-8">
        <Link href="/" className="hover:text-[#326891] transition-colors">
          Home
        </Link>{" "}
        / How We Score
      </p>

      {/* Header */}
      <div className="pb-10 border-b border-[#d8d4cc] mb-14" style={{ borderBottomWidth: "0.5px" }}>
        <h1 className="font-serif text-4xl leading-snug text-[#1a1a1a] mb-4 max-w-2xl">
          {heading}
        </h1>
        <p className="text-lg text-[#4a4a4a] leading-relaxed max-w-xl">
          {subheading}
        </p>
      </div>

      {/* Criteria */}
      <div className="max-w-2xl">
        {criteria.length > 0 && (
          <ol className="flex flex-col">
            {criteria.map((item, i) => (
              <li
                key={item.title}
                className={`flex gap-8 py-10 ${
                  i < criteria.length - 1 ? "border-b border-[#d8d4cc]" : ""
                }`}
                style={i < criteria.length - 1 ? { borderBottomWidth: "0.5px" } : {}}
              >
                {/* Ordinal number in accent blue */}
                <span
                  className="font-serif text-3xl leading-none text-[#326891] select-none shrink-0 w-9 text-right"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Text */}
                <div>
                  <h2 className="font-serif text-xl text-[#1a1a1a] mb-3">
                    {item.title}
                  </h2>
                  <p className="text-[#4a4a4a] leading-relaxed text-base">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}

        {/* Independence note */}
        <div
          className="mt-14 pt-10 border-t border-[#d8d4cc]"
          style={{ borderTopWidth: "0.5px" }}
        >
          <p className="text-xs uppercase tracking-widest font-medium text-[#888] mb-3">
            Editorial independence
          </p>
          <p className="text-sm text-[#4a4a4a] leading-relaxed">
            {independenceNote ? (
              <>
                {independenceNote}{" "}
                <Link
                  href="/contact"
                  className="text-[#326891] underline underline-offset-2 hover:text-[#1a3a52] transition-colors"
                >
                  Contact us
                </Link>{" "}
                if you believe a review is inaccurate or out of date.
              </>
            ) : (
              <>
                The Telehealth Review is editorially independent. We do not
                accept payment, free product, or any other form of compensation from
                the brands we review. Our only source of revenue is reader support.
                If you believe a review is inaccurate or out of date,{" "}
                <Link
                  href="/contact"
                  className="text-[#326891] underline underline-offset-2 hover:text-[#1a3a52] transition-colors"
                >
                  contact us
                </Link>
                .
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

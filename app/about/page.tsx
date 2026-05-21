import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
import { safeFetch } from "@/sanity/lib/client";
import { ABOUT_PAGE_QUERY } from "@/sanity/lib/queries";
import type { SanityAboutPage } from "@/types/sanity";

export const revalidate = 60;

export async function generateMetadata() {
  const page = await safeFetch<SanityAboutPage | null>(ABOUT_PAGE_QUERY, {}, null);
  return {
    title: page?.pageTitle
      ? `${page.pageTitle} | The Digital Health Digest`
      : "About | The Digital Health Digest",
    description: page?.tagline ?? undefined,
  };
}

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
    strong: ({ children }) => (
      <strong className="font-semibold text-[#111111]">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        className="text-[#3B6D11] underline underline-offset-2 hover:text-[#27500A] transition-colors"
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={value?.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
  },
};

// Placeholder shown before the Sanity document is published
const PLACEHOLDER: SanityAboutPage = {
  pageTitle: "About The Digital Health Digest",
  tagline:
    "Independent editorial reviews of direct-to-consumer telehealth brands — so you can make smarter decisions about your care.",
  image: null,   // kept on type for Studio; not rendered by this page
  imageAlt: null,
  body: [
    {
      _type: "block",
      _key: "p1",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "s1",
          text: "The Digital Health Digest is an independent editorial site that researches, tests, and compares direct-to-consumer telehealth brands across men's health, women's health, mental health, weight loss, dermatology, primary care, and specialty categories.",
          marks: [],
        },
      ],
    },
    {
      _type: "block",
      _key: "p2",
      style: "h2",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "s2",
          text: "How we review",
          marks: [],
        },
      ],
    },
    {
      _type: "block",
      _key: "p3",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "s3",
          text: "We enroll in every platform we review. We go through the intake process, speak with providers, receive prescriptions when applicable, and use the products for a minimum of four weeks before writing. We don't accept compensation from any brand we cover — our only income is reader support.",
          marks: [],
        },
      ],
    },
    {
      _type: "block",
      _key: "p4",
      style: "h2",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "s4",
          text: "Editorial standards",
          marks: [],
        },
      ],
    },
    {
      _type: "block",
      _key: "p5",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "s5",
          text: "All reviews are updated when platforms change their pricing, formularies, or clinical protocols. We disclose conflicts of interest clearly and correct errors promptly. If you spot something wrong, email us.",
          marks: [],
        },
      ],
    },
  ],
};

export default async function AboutPage() {
  const data = await safeFetch<SanityAboutPage | null>(ABOUT_PAGE_QUERY, {}, null);
  const page = data ?? PLACEHOLDER;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <p className="text-xs text-[#aaaaaa] mb-8">
        <Link href="/" className="hover:text-[#3B6D11] transition-colors">
          Home
        </Link>{" "}
        / About
      </p>

      {/* Title + tagline */}
      <div
        className="pb-10 border-b border-[#e0e0e0] mb-12"
        style={{ borderBottomWidth: "0.5px" }}
      >
        <h1 className="font-serif text-4xl leading-snug text-[#111111] mb-4 max-w-2xl">
          {page.pageTitle}
        </h1>
        <p className="text-lg text-[#555555] leading-relaxed max-w-xl">
          {page.tagline}
        </p>
      </div>

      {/* Body copy — single column, no image */}
      <div className="max-w-2xl">
        <PortableText value={page.body} components={ptComponents} />
      </div>
    </div>
  );
}

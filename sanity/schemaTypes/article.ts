import { defineField, defineType } from "sanity";

export const articleType = defineType({
  name: "article",
  title: "Article",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Men's health", value: "Men's health" },
          { title: "Women's health", value: "Women's health" },
          { title: "Mental health", value: "Mental health" },
          { title: "Weight loss", value: "Weight loss" },
          { title: "Dermatology", value: "Dermatology" },
          { title: "Primary care", value: "Primary care" },
          { title: "Specialty", value: "Specialty" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "categorySlug",
      title: "Category Slug",
      type: "string",
      description:
        "URL-safe version of the category (e.g. mens-health). Auto-filled if you use the list above.",
      options: {
        list: [
          { title: "mens-health", value: "mens-health" },
          { title: "womens-health", value: "womens-health" },
          { title: "mental-health", value: "mental-health" },
          { title: "weight-loss", value: "weight-loss" },
          { title: "dermatology", value: "dermatology" },
          { title: "primary-care", value: "primary-care" },
          { title: "specialty", value: "specialty" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "Publish Date",
      type: "date",
      options: { dateFormat: "YYYY-MM-DD" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      description: "1–2 sentence deck shown on cards and at the top of the article.",
      validation: (Rule) => Rule.required().max(400),
    }),
    defineField({
      name: "featured",
      title: "Featured (hero)",
      type: "boolean",
      description: "Only one article should be featured at a time.",
      initialValue: false,
    }),
    defineField({
      name: "mostRead",
      title: "Most Read",
      type: "boolean",
      description: "Appears in the homepage Most Read section.",
      initialValue: false,
    }),
    defineField({
      name: "image",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "scorecard",
      title: "Scorecard",
      type: "object",
      fields: [
        defineField({
          name: "winner",
          title: "Winner / Top Pick",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "overallRating",
          title: "Overall Rating",
          type: "number",
          validation: (Rule) => Rule.required().min(0).max(10).precision(1),
        }),
        defineField({
          name: "bestFor",
          title: "Best For",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "priceTier",
          title: "Price Tier",
          type: "string",
          options: {
            list: [
              { title: "$ — Budget", value: "$" },
              { title: "$$ — Moderate", value: "$$" },
              { title: "$$$ — Premium", value: "$$$" },
              { title: "$$$$ — Luxury", value: "$$$$" },
            ],
            layout: "radio",
          },
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "pros",
          title: "Pros",
          type: "array",
          of: [{ type: "string" }],
          validation: (Rule) => Rule.required().min(1),
        }),
        defineField({
          name: "cons",
          title: "Cons",
          type: "array",
          of: [{ type: "string" }],
          validation: (Rule) => Rule.required().min(1),
        }),
        // Per-category scores — 0–5 scale, optional for backwards compat
        defineField({
          name: "clinicalQuality",
          title: "Clinical Quality Score",
          type: "number",
          description: "0–5 scale. Leave blank to show as 0.",
          initialValue: 0,
          validation: (Rule) => Rule.min(0).max(5).precision(1),
        }),
        defineField({
          name: "pricing",
          title: "Pricing Score",
          type: "number",
          description: "0–5 scale. Leave blank to show as 0.",
          initialValue: 0,
          validation: (Rule) => Rule.min(0).max(5).precision(1),
        }),
        defineField({
          name: "privacy",
          title: "Privacy Score",
          type: "number",
          description: "0–5 scale. Leave blank to show as 0.",
          initialValue: 0,
          validation: (Rule) => Rule.min(0).max(5).precision(1),
        }),
        defineField({
          name: "patientExperience",
          title: "Patient Experience Score",
          type: "number",
          description: "0–5 scale. Leave blank to show as 0.",
          initialValue: 0,
          validation: (Rule) => Rule.min(0).max(5).precision(1),
        }),
        defineField({
          name: "ongoingCare",
          title: "Ongoing Care Score",
          type: "number",
          description: "0–5 scale. Leave blank to show as 0.",
          initialValue: 0,
          validation: (Rule) => Rule.min(0).max(5).precision(1),
        }),
      ],
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Paragraph",  value: "normal"     },
            { title: "Heading 2",  value: "h2"         },
            { title: "Heading 3",  value: "h3"         },
            { title: "Pull quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "image",
    },
  },
  orderings: [
    {
      title: "Publish Date (newest first)",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
});

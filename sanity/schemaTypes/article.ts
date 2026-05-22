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
    // ── Multi-platform comparison scorecard (optional) ─────────────────────────
    // If present, the sidebar renders a comparison table instead of the single scorecard.
    defineField({
      name: "comparisonPlatforms",
      title: "Comparison Platforms",
      type: "array",
      description:
        "Optional. Add two or more platforms to display a multi-platform comparison sidebar. If filled, replaces the single Scorecard in the sidebar.",
      of: [
        {
          type: "object",
          preview: {
            select: { title: "name", subtitle: "overallScore" },
            prepare({ title, subtitle }: { title?: string; subtitle?: number }) {
              return {
                title: title ?? "Unnamed platform",
                subtitle: subtitle != null ? `Overall: ${subtitle.toFixed(1)} / 5.0` : "",
              };
            },
          },
          fields: [
            defineField({
              name: "name",
              title: "Platform Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "url",
              title: "Platform URL",
              type: "url",
            }),
            defineField({
              name: "platformType",
              title: "Platform Type",
              type: "string",
              description: 'Short descriptor shown below the name, e.g. "Specialty anorectal"',
            }),
            defineField({
              name: "isWinner",
              title: "Top Pick / Winner",
              type: "boolean",
              description: "Mark exactly one platform per article as the top pick.",
              initialValue: false,
            }),
            defineField({
              name: "overallScore",
              title: "Overall Score (0–5)",
              type: "number",
              validation: (Rule) => Rule.required().min(0).max(5).precision(1),
            }),
            defineField({
              name: "scores",
              title: "Dimension Scores",
              type: "array",
              description:
                "Add one entry per scoring dimension. Use the same dimension names across all platforms in the article.",
              of: [
                {
                  type: "object",
                  preview: {
                    select: { title: "dimension", subtitle: "value" },
                  },
                  fields: [
                    defineField({
                      name: "dimension",
                      title: "Dimension",
                      type: "string",
                      description:
                        'e.g. "Clinical quality", "Pricing", "Privacy", "Patient experience", "Ongoing care"',
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: "value",
                      title: "Score (0–5)",
                      type: "number",
                      validation: (Rule) =>
                        Rule.required().min(0).max(5).precision(1),
                    }),
                  ],
                },
              ],
            }),
          ],
        },
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
            { title: "Paragraph",        value: "normal"           },
            { title: "Heading 2",        value: "h2"               },
            { title: "Heading 3",        value: "h3"               },
            { title: "Pull quote",       value: "blockquote"       },
            { title: "Dimension heading", value: "dimensionHeading" },
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

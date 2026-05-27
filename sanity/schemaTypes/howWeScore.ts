import { defineField, defineType } from "sanity";

/**
 * Singleton document — there is exactly one "How We Score" page.
 * The Studio sidebar opens it directly via a fixed documentId ("howWeScore")
 * rather than showing a list.
 */
export const howWeScoreType = defineType({
  name: "howWeScore",
  title: "How We Score",
  type: "document",

  fields: [
    defineField({
      name: "heading",
      title: "Page Heading",
      type: "string",
      description: 'Large serif heading at the top of the page. Default: "How We Score"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subheading",
      title: "Intro Paragraph",
      type: "text",
      rows: 3,
      description: "The sentence(s) shown beneath the heading, introducing the scoring methodology.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "criteria",
      title: "Scoring Criteria",
      type: "array",
      description: "Ordered list of scoring dimensions. Rendered numbered 01, 02, … based on position.",
      of: [
        {
          type: "object",
          preview: {
            select: { title: "title", subtitle: "description" },
          },
          fields: [
            defineField({
              name: "title",
              title: "Criterion Title",
              type: "string",
              description: 'Short label, e.g. "Clinical quality"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 4,
              description: "2–4 sentence explanation of what is evaluated under this criterion.",
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "independenceNote",
      title: "Editorial Independence Statement",
      type: "text",
      rows: 4,
      description:
        'Plain-text note shown at the bottom of the page. A hardcoded "contact us" link is always appended by the component.',
    }),
  ],

  preview: {
    select: { title: "heading" },
    prepare({ title }: { title?: string }) {
      return { title: title ?? "How We Score" };
    },
  },
});

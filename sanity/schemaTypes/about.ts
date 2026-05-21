import { defineField, defineType } from "sanity";

/**
 * Singleton document — there is exactly one About page.
 * The Studio sidebar opens it directly via a fixed documentId ("about")
 * rather than showing a list.
 */
export const aboutType = defineType({
  name: "about",
  title: "About Page",
  type: "document",

  // Note: singleton enforcement is handled by the Studio structure config —
  // the "About Page" sidebar entry opens the fixed documentId directly,
  // so editors have no way to create duplicate About documents.

  fields: [
    defineField({
      name: "pageTitle",
      title: "Page Title",
      type: "string",
      description: 'Displayed as the large heading. E.g. "About The Digital Health Digest"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline / Subheadline",
      type: "string",
      description: "One-line description shown beneath the title.",
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      description: "Main page content. Supports multiple paragraphs, headings, bold, and italic.",
      of: [
        {
          type: "block",
          styles: [
            { title: "Paragraph", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  defineField({
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (Rule) =>
                      Rule.uri({ allowRelative: true, scheme: ["http", "https", "mailto"] }),
                  }),
                ],
              },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Headshot / Team Photo",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Describe the image for screen readers and SEO.",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
  ],

  preview: {
    select: { title: "pageTitle", subtitle: "tagline", media: "image" },
  },
});

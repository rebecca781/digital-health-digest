import { defineField, defineType } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "label", maxLength: 64 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "count",
      title: "Review Count",
      type: "number",
      description: "Displayed on the homepage category browser. Update when you publish new reviews.",
      initialValue: 0,
      validation: (Rule) => Rule.required().min(0).integer(),
    }),
    defineField({
      name: "icon",
      title: "Icon (single character or emoji)",
      type: "string",
      description: "Single character used as the visual icon in the category grid.",
    }),
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "count",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: `${subtitle ?? 0} reviews`,
      };
    },
  },
});

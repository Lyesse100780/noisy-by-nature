import { defineField, defineType } from "sanity";

const inTheWildItem = defineType({
  name: "inTheWildItem",
  title: "In The Wild Item",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
    }),
  ],
  preview: {
    select: {
      title: "caption",
      media: "image",
    },
  },
});

export default inTheWildItem;

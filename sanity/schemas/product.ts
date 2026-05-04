const product = {
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string" },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
    { name: "category", title: "Category", type: "string" },
    { name: "shortDescription", title: "Short Description", type: "text", rows: 3 },
    { name: "price", title: "Price", type: "number" },
    {
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Available", value: "available" },
          { title: "Sold Out", value: "sold_out" },
          { title: "Coming Soon", value: "coming_soon" },
        ],
        layout: "radio",
      },
      initialValue: "coming_soon",
    },
    { name: "mainImage", title: "Main Image", type: "image", options: { hotspot: true } },
    { name: "featured", title: "Featured", type: "boolean", initialValue: false },
    { name: "order", title: "Order", type: "number" },
  ],
};

export default product;

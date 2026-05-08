import { groq } from "next-sanity";
import type { PortableTextBlock } from "next-sanity";

export type FeaturedProduct = {
  title: string;
  slug: string;
  shortDescription?: string;
  price?: number;
  status?: "available" | "sold_out" | "coming_soon";
  imageUrl?: string;
};

export const featuredProductsQuery = groq`
  *[_type == "product" && featured == true] | order(order asc, title asc) {
    title,
    "slug": slug.current,
    shortDescription,
    price,
    status,
    "imageUrl": mainImage.asset->url
  }
`;

export type WorkshopPostSummary = {
  title: string;
  slug: string;
  excerpt?: string;
  category?: string;
  publishedAt?: string;
  imageUrl?: string;
};

export type WorkshopPost = WorkshopPostSummary & {
  body?: PortableTextBlock[];
};

export type InTheWildItem = {
  imageUrl: string;
  caption: string;
};

const workshopPostFields = groq`
  title,
  "slug": slug.current,
  excerpt,
  category,
  publishedAt,
  "imageUrl": mainImage.asset->url
`;

export const featuredWorkshopPostsQuery = groq`
  *[_type == "workshopPost" && featured == true && defined(slug.current)] | order(order asc, publishedAt desc) [0...6] {
    ${workshopPostFields}
  }
`;

export const inTheWildItemsQuery = groq`
  *[_type == "inTheWildItem" && defined(image.asset)] | order(order asc, _createdAt desc) {
    caption,
    "imageUrl": image.asset->url
  }
`;

export const workshopPostsQuery = groq`
  *[_type == "workshopPost" && defined(slug.current)] | order(order asc, publishedAt desc) {
    ${workshopPostFields}
  }
`;

export const workshopPostBySlugQuery = groq`
  *[_type == "workshopPost" && slug.current == $slug][0] {
    ${workshopPostFields},
    body[]{
      ...,
      _type == "image" => {
        ...,
        "asset": asset->{url}
      }
    }
  }
`;

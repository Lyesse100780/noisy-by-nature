import { products as rawCaseProducts } from "@/app/data/products";

type RawProduct = (typeof rawCaseProducts)[number];

export type ShopProduct = RawProduct & {
  priceAmount: number;
  currency: "eur";
  available: boolean;
  stockQuantity: number;
  category: "controller" | "case";
};

const productCheckoutData: Record<
  string,
  Pick<ShopProduct, "priceAmount" | "currency" | "available" | "stockQuantity">
> = {
  sagebloom: { priceAmount: 23000, currency: "eur", available: true, stockQuantity: 1 },
  coraldust: { priceAmount: 21000, currency: "eur", available: true, stockQuantity: 1 },
  frontiergreen: { priceAmount: 22000, currency: "eur", available: false, stockQuantity: 0 },
  ashtrail: { priceAmount: 43000, currency: "eur", available: false, stockQuantity: 0 },
  oxbloodmesa: { priceAmount: 46000, currency: "eur", available: false, stockQuantity: 0 },
  "black-and-silver": { priceAmount: 39000, currency: "eur", available: true, stockQuantity: 1 },
  burntleather: { priceAmount: 43000, currency: "eur", available: false, stockQuantity: 0 },
};

export const controllerProducts: ShopProduct[] = [
  {
    slug: "fad3rs",
    name: "FAD3RS",
    price: "EUR 179 · Limited First Runs",
    priceAmount: 17900,
    currency: "eur",
    available: false,
    stockQuantity: 0,
    category: "controller",
    description: `
A class-compliant MIDI controller built around three 100mm Alps faders for expressive automation and precise control.`,
    specs: [
      "Class-compliant MIDI over USB",
      "Three 100mm Alps faders",
      "Change CC assignments on the fly",
      "Five response curves",
      "Extra-low profile desktop format",
    ],
    images: ["/images/brand/fad3rs-img1.png"],
  },
];

export const caseProducts: ShopProduct[] = rawCaseProducts.map((product) => ({
  ...product,
  priceAmount: productCheckoutData[product.slug]?.priceAmount ?? 0,
  price: productCheckoutData[product.slug]?.priceAmount
    ? `EUR ${(productCheckoutData[product.slug].priceAmount / 100).toFixed(0)}`
    : product.price,
  currency: productCheckoutData[product.slug]?.currency ?? "eur",
  available: productCheckoutData[product.slug]?.available ?? false,
  stockQuantity: productCheckoutData[product.slug]?.stockQuantity ?? 0,
  category: "case",
}));

export const shopProducts: ShopProduct[] = [...controllerProducts, ...caseProducts];

export function getShopProduct(slug: string) {
  return shopProducts.find((product) => product.slug === slug);
}

import { products as rawCaseProducts } from "@/app/data/products";
import { fad3rsUsbVariants, getFad3rsRemainingStock, type Fad3rsUsbVariant } from "@/lib/fad3rs-inventory";

type RawProduct = (typeof rawCaseProducts)[number];

export type ShopProduct = RawProduct & {
  priceAmount: number;
  currency: "eur";
  available: boolean;
  stockQuantity: number;
  category: "controller" | "case" | "test";
  variants?: Fad3rsUsbVariant[];
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
    name: "FAD3RS Black Edition",
    price: "EUR 179 · Limited First Runs",
    priceAmount: 17900,
    currency: "eur",
    available: getFad3rsRemainingStock() > 0,
    stockQuantity: getFad3rsRemainingStock(),
    category: "controller",
    description: `
A class-compliant MIDI controller built around three 100mm Alps faders for expressive automation and precise control.`,
    specs: [
      "Class-compliant MIDI over USB",
      "Three 100mm Alps faders",
      "Change CC assignments on the fly",
      "Five response curves",
      "Black western floral Tolex finish",
      "Dimensions: 20 × 9.6 × 2 cm",
      "Includes an approx. 1.8 m USB cable",
      "Extra-low profile desktop format",
    ],
    variants: fad3rsUsbVariants,
    images: [
      "/images/brand/fad3rs-black-edition/fad3rs-black-edition-1.png",
      "/images/brand/fad3rs-black-edition/fad3rs-black-edition-2.png",
      "/images/brand/fad3rs-black-edition/fad3rs-black-edition-3.png",
    ],
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

const hiddenTestProducts: ShopProduct[] = [
  {
    slug: "checkout-test-1eur",
    name: "Checkout Test — 1 EUR",
    price: "EUR 1",
    priceAmount: 100,
    currency: "eur",
    available: true,
    stockQuantity: 99,
    category: "test",
    description: "Hidden checkout smoke-test product for validating the live Stripe checkout flow.",
    specs: ["Hidden from the public shop", "No physical shipment", "For payment testing only"],
    images: ["/images/brand/fad3rs-black-edition/fad3rs-black-edition-1.png"],
  },
];

export const shopProducts: ShopProduct[] = [...controllerProducts, ...caseProducts, ...hiddenTestProducts];

export function getShopProduct(slug: string) {
  return shopProducts.find((product) => product.slug === slug);
}

export function getShopProductStockQuantity(product: ShopProduct, variantId?: string) {
  if (product.variants?.length && variantId) {
    return product.variants.find((variant) => variant.id === variantId)?.stockQuantity ?? 0;
  }

  return product.stockQuantity;
}

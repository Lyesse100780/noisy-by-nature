import type { ShopProduct } from "@/lib/shop-products";

export type ShippingMethodId = "colissimo" | "mondial-relay";
export type ShippingTier = "controller" | "controller-pair" | "small-case" | "large-case";

export type ShippingCountry = {
  code: string;
  label: string;
  zone: "france" | "europe-1" | "europe-2";
};

export type ShippingOption = {
  id: ShippingMethodId;
  label: string;
  amount: number;
};

export const shippingCountries: ShippingCountry[] = [
  { code: "FR", label: "France", zone: "france" },
  { code: "BE", label: "Belgium", zone: "europe-1" },
  { code: "NL", label: "Netherlands", zone: "europe-1" },
  { code: "DE", label: "Germany", zone: "europe-1" },
  { code: "ES", label: "Spain", zone: "europe-1" },
  { code: "PT", label: "Portugal", zone: "europe-1" },
  { code: "IT", label: "Italy", zone: "europe-1" },
  { code: "AT", label: "Austria", zone: "europe-1" },
  { code: "CH", label: "Switzerland", zone: "europe-2" },
  { code: "CZ", label: "Czech Republic", zone: "europe-2" },
  { code: "EE", label: "Estonia", zone: "europe-2" },
  { code: "SE", label: "Sweden", zone: "europe-2" },
  { code: "SI", label: "Slovenia", zone: "europe-2" },
  { code: "FI", label: "Finland", zone: "europe-2" },
  { code: "GR", label: "Greece", zone: "europe-2" },
  { code: "RO", label: "Romania", zone: "europe-2" },
  { code: "GB", label: "United Kingdom", zone: "europe-2" },
];

const colissimoRates: Record<ShippingTier, Record<ShippingCountry["zone"], number | null>> = {
  controller: { france: 1300, "europe-1": 1600, "europe-2": 2000 },
  "controller-pair": { france: 1400, "europe-1": null, "europe-2": null },
  "small-case": { france: 1500, "europe-1": 2000, "europe-2": 2500 },
  "large-case": { france: 1800, "europe-1": 2200, "europe-2": 2800 },
};

const mondialRelayRates: Record<ShippingTier, number | null> = {
  controller: 800,
  "controller-pair": null,
  "small-case": 1000,
  "large-case": 1400,
};

export function getShippingCountry(code: string) {
  return shippingCountries.find((country) => country.code === code);
}

export function getProductShippingTier(product: ShopProduct): ShippingTier {
  const title = product.name.toLowerCase();

  if (product.category === "controller" || title.includes("fad3rs") || title.includes("mast3r")) {
    return "controller";
  }

  if (title.includes("84hp") || title.includes("96hp")) {
    return "large-case";
  }

  return "small-case";
}

export function getCartShippingTier(products: ShopProduct[]): ShippingTier {
  const totalWeight = products.reduce((sum, product) => {
    const tier = getProductShippingTier(product);

    if (tier === "large-case") return sum + 5;
    if (tier === "small-case") return sum + 3.5;
    return sum + 0.8;
  }, 0);

  if (totalWeight <= 0.8) return "controller";
  if (totalWeight <= 2) return "controller-pair";
  if (totalWeight <= 4) return "small-case";
  return "large-case";
}

export function getShippingOptions(countryCode: string, products: ShopProduct[]): ShippingOption[] {
  const country = getShippingCountry(countryCode);
  if (!country || products.length === 0) return [];

  const tier = getCartShippingTier(products);
  const colissimoAmount = colissimoRates[tier][country.zone];
  const options: ShippingOption[] = [];

  if (colissimoAmount !== null) {
    options.push({
      id: "colissimo",
      label: "Colissimo",
      amount: colissimoAmount,
    });
  }

  const mondialRelayAmount = mondialRelayRates[tier];

  if (country.zone === "france" && mondialRelayAmount !== null) {
    options.push({
      id: "mondial-relay",
      label: "Mondial Relay",
      amount: mondialRelayAmount,
    });
  }

  return options;
}

export function formatAmount(amount: number) {
  return `EUR ${(amount / 100).toFixed(2)}`;
}

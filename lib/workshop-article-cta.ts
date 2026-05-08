/**
 * If slug/title heuristics miss a workshop post, add the exact Sanity slug below.
 */
export type WorkshopArticleCta = {
  href: string;
  label: string;
  /** Optional line above the CTA button */
  intro?: string;
};

const PRIMARY_CTA_BY_SLUG: Record<string, WorkshopArticleCta> = {
  "100mm-faders-change-the-way-you-perform": { href: "/shop/fad3rs", label: "Shop - FAD3RS" },
  "restoring-physical-expression-to-digital-music": { href: "/fad3rs", label: "FAD3RS" },
  "why-noisy-by-nature-cases-are-built-by-hand": { href: "/shop/cases", label: "Shop - In-stock cases" },
  "designing-your-own-case": {
    href: "/bespoke",
    label: "Configure bespoke build",
    intro: "Start configuring your bespoke case now.",
  },
};

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

/** Primary CTA: FAD3RS shop page / bespoke / shop cases based on slug and title. */
export function resolveWorkshopArticleCta(post: { slug: string; title?: string | null }): WorkshopArticleCta | null {
  const slug = post.slug.toLowerCase().trim();
  const titleNorm = normalize(post.title ?? "");

  const fromMap = PRIMARY_CTA_BY_SLUG[slug];
  if (fromMap) return fromMap;

  if (titleNorm.includes("cases by hand") || /\bcases[\s-]?by[\s-]?hand\b/i.test(slug)) {
    return { href: "/shop/cases", label: "Shop - In-stock cases" };
  }

  if (
    titleNorm.includes("configurator") ||
    titleNorm.includes("configurateur") ||
    slug.includes("configurator") ||
    slug.includes("configurat") ||
    slug.includes("configureur")
  ) {
    return { href: "/bespoke", label: "Bespoke builds" };
  }

  const isMastArticle = /\bmast\s*3\s*r\b/i.test(post.title ?? "") || /mast3r/i.test(slug);
  const isFad3rsArticle =
    !isMastArticle &&
    (slug.includes("fad3rs") ||
      slug.includes("fad3r") ||
      /\bfad\s*3\s*rs\b/i.test(post.title ?? "") ||
      /\bfad3rs\b/i.test(post.title ?? ""));

  if (isFad3rsArticle) {
    return { href: "/shop/fad3rs", label: "Shop - FAD3RS" };
  }

  return null;
}

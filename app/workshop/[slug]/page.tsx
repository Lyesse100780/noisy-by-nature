import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import SiteNav from "@/components/SiteNav";
import PortableTextRenderer from "@/components/PortableTextRenderer";
import { resolveWorkshopArticleCta } from "@/lib/workshop-article-cta";
import { isSanityConfigured, sanityClient } from "@/lib/sanity/client";
import { workshopPostBySlugQuery, type WorkshopPost } from "@/lib/sanity/queries";

export const revalidate = 60;

type WorkshopArticlePageProps = {
  params: Promise<{ slug: string }>;
};

const formatDate = (date?: string) => {
  if (!date) return null;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

const getWorkshopPost = async (slug: string) => {
  if (!isSanityConfigured || !sanityClient) return null;

  try {
    return await sanityClient.fetch<WorkshopPost | null>(workshopPostBySlugQuery, { slug });
  } catch {
    return null;
  }
};

export default async function WorkshopArticlePage({ params }: WorkshopArticlePageProps) {
  const { slug } = await params;
  const post = await getWorkshopPost(slug);

  if (!post) notFound();

  const primaryCta = resolveWorkshopArticleCta({ slug: post.slug, title: post.title });

  const exploreLinksBase = [
    { href: "/shop", label: "Shop" },
    { href: "/shop/cases", label: "Cases" },
    { href: "/fad3rs", label: "FAD3RS" },
    { href: "/mast3r", label: "MAST3R" },
    { href: "/bespoke", label: "Bespoke" },
    { href: "/#join-list", label: "Mailing list" },
  ];

  const exploreLinks = exploreLinksBase.filter(({ href }) => {
    if (!primaryCta) return true;
    if (href === primaryCta.href) return false;
    if (primaryCta.href === "/shop/fad3rs" && href === "/fad3rs") return false;
    return true;
  });

  return (
    <main className="topographic-surface min-h-screen bg-[#1A1410] text-[#F5EBDD]">
      <div className="relative z-[80] border-b border-[#8f5c32]/18 bg-[#100b08]">
        <SiteNav />
      </div>

      <article className="px-6 py-14 md:px-12 md:py-20 lg:px-20">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center gap-3 text-[0.58rem] font-medium uppercase tracking-[0.24em] text-[#d5a06a]/72">
            {post.category ? <span>{post.category}</span> : null}
            {post.category && post.publishedAt ? <span className="text-[#8f5c32]/70">/</span> : null}
            {post.publishedAt ? <span>{formatDate(post.publishedAt)}</span> : null}
          </div>

          <h1 className="[font-family:var(--font-playfair)] mt-5 text-[clamp(1.5rem,3.5vw,2.8rem)] font-medium uppercase leading-none tracking-[0.12em] text-[#dbc6a8]">
            {post.title}
          </h1>

          {post.excerpt ? (
            <p className="mt-7 max-w-3xl text-xl font-light leading-9 text-[#e6d9c5]/76">
              {post.excerpt}
            </p>
          ) : null}

          {post.imageUrl ? (
            <div className="my-12 overflow-hidden border border-[#8f5c32]/18 bg-[#0f0a07]">
              <img src={post.imageUrl} alt={post.title} className="h-auto w-full object-cover opacity-90" />
            </div>
          ) : null}

          <PortableTextRenderer value={post.body} />

          {primaryCta ? (
            <div className="mt-14 border border-[#c69054]/46 bg-[#120c08]/40 px-6 py-5 sm:px-7">
              <p className="[font-family:var(--font-inter)] text-[0.55rem] font-medium uppercase tracking-[0.22em] text-[#d5a06a]/72">
                Continue
              </p>
              {primaryCta.intro ? (
                <p className="mt-3 max-w-xl text-[0.94rem] font-light leading-relaxed text-[#e6d9c5]/74">
                  {primaryCta.intro}
                </p>
              ) : null}
              <Link
                href={primaryCta.href}
                className="mt-4 inline-flex border border-[#d5a06a]/60 bg-[#d5a06a]/12 px-5 py-3 [font-family:var(--font-inter)] text-[0.65rem] font-medium uppercase tracking-[0.22em] text-[#efd1a2] transition hover:border-[#efd1a2]/76 hover:bg-[#d5a06a]/16"
              >
                {primaryCta.label}
              </Link>
            </div>
          ) : null}

          <aside className="mt-10 border border-[#8f5c32]/18 bg-[#120c08]/28 px-5 py-6 sm:px-6">
            <p className="[font-family:var(--font-inter)] text-[0.55rem] font-medium uppercase tracking-[0.22em] text-[#d5a06a]/72">
              Keep exploring
            </p>
            <nav className="mt-4 flex flex-wrap gap-x-4 gap-y-2 [font-family:var(--font-inter)] text-[0.58rem] font-medium uppercase tracking-[0.18em]" aria-label="Site sections">
              {exploreLinks.map((linkItem, idx) => (
                <Fragment key={linkItem.href}>
                  {idx > 0 ? (
                    <span key={`sep-${linkItem.href}`} className="text-[#8f5c32]/50" aria-hidden>
                      /
                    </span>
                  ) : null}
                  <Link
                    href={linkItem.href}
                    className="text-[#d5a06a]/88 transition-colors hover:text-[#e4c89e]"
                  >
                    {linkItem.label}
                  </Link>
                </Fragment>
              ))}
            </nav>
          </aside>

          <footer className="mt-10 border-t border-[#8f5c32]/18 pt-8">
            <Link
              href="/workshop"
              className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-[#d5a06a] transition-colors hover:text-[#e4c89e]"
            >
              <span aria-hidden className="text-[#e2c8a2]">
                ←
              </span>
              Back to Workshop
            </Link>
          </footer>
        </div>
      </article>
    </main>
  );
}

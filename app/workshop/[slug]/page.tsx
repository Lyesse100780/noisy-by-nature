import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import PortableTextRenderer from "@/components/PortableTextRenderer";
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

          <h1 className="[font-family:var(--font-playfair)] mt-5 text-[clamp(2.6rem,6.4vw,5.7rem)] font-medium uppercase leading-none tracking-[0.12em] text-[#dbc6a8]">
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
        </div>
      </article>
    </main>
  );
}

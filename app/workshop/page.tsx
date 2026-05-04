import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import { isSanityConfigured, sanityClient } from "@/lib/sanity/client";
import { workshopPostsQuery, type WorkshopPostSummary } from "@/lib/sanity/queries";

export const revalidate = 60;

const getWorkshopPosts = async () => {
  if (!isSanityConfigured || !sanityClient) return [];

  try {
    return await sanityClient.fetch<WorkshopPostSummary[]>(workshopPostsQuery);
  } catch {
    return [];
  }
};

const formatDate = (date?: string) => {
  if (!date) return null;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

export default async function WorkshopPage() {
  const posts = await getWorkshopPosts();

  return (
    <main className="topographic-surface min-h-screen bg-[#1A1410] text-[#F5EBDD]">
      <section className="site-hero relative w-full overflow-hidden bg-[#100b08] text-[#f4ead8] [--hero-desktop-height:23vh] [--hero-mobile-height:8.75rem]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-100"
          style={{ backgroundImage: "url('/images/brand/background-topography-v2.png')" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(177,105,48,0.09),transparent_30%),linear-gradient(90deg,rgba(8,5,4,0.91),rgba(17,11,8,0.58)_46%,rgba(7,5,4,0.91)),linear-gradient(180deg,rgba(5,4,3,0.6),rgba(15,10,7,0.32)_52%,#1A1410_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-[#1A1410]" />

        <SiteNav />

        <div className="site-hero__content relative z-10 mx-auto flex w-full max-w-7xl items-center justify-center px-6 md:px-10 lg:px-14">
          <div className="text-center">
            <h1
              className="[font-family:var(--font-playfair)] text-[clamp(2.35rem,5.2vw,4.85rem)] font-medium uppercase leading-none tracking-[0.18em]"
              style={{
                color: "rgba(219, 198, 168, 0.92)",
                WebkitTextStroke: "0.18px rgba(255, 236, 202, 0.08)",
                textShadow:
                  "0 1px 0 rgba(255, 238, 207, 0.08), 0 -1px 0 rgba(0, 0, 0, 0.72), 0 10px 26px rgba(0, 0, 0, 0.45)",
              }}
            >
              WORKSHOP
            </h1>
            <div className="mx-auto mt-3 flex w-full max-w-[min(76vw,28rem)] items-center justify-center gap-3 text-[#c38a50]/70 md:mt-4 md:gap-4">
              <span className="hidden h-px flex-1 bg-current opacity-36 sm:block" />
              <p className="[font-family:var(--font-inter)] whitespace-nowrap text-[clamp(0.52rem,1.25vw,0.68rem)] font-medium uppercase leading-none tracking-[0.24em] text-[#d5a06a]/86">
                Inside Noisy by Nature
              </p>
              <span className="hidden h-px flex-1 bg-current opacity-36 sm:block" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-14 md:px-12 md:py-20 lg:px-20">
        <div className="mx-auto max-w-6xl">
          {posts.length === 0 ? (
            <div className="border-t border-[#8f5c32]/18 pt-10">
              <p className="max-w-xl text-[1.05rem] font-light leading-8 text-[#e6d9c5]/68">
                Workshop notes are coming soon.
              </p>
            </div>
          ) : (
            <div className="grid gap-12 md:grid-cols-2">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/workshop/${post.slug}`}
                  className="group border-t border-[#8f5c32]/18 pt-8 transition-opacity hover:opacity-95"
                >
                  {post.imageUrl ? (
                    <div className="mb-6 h-72 overflow-hidden border border-[#8f5c32]/18 bg-[#0f0a07] md:h-80">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="h-full w-full object-cover opacity-88 transition duration-500 group-hover:scale-[1.018] group-hover:opacity-100"
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-wrap items-center gap-3 text-[0.58rem] font-medium uppercase tracking-[0.24em] text-[#d5a06a]/72">
                    {post.category ? <span>{post.category}</span> : null}
                    {post.category && post.publishedAt ? <span className="text-[#8f5c32]/70">/</span> : null}
                    {post.publishedAt ? <span>{formatDate(post.publishedAt)}</span> : null}
                  </div>
                  <h2 className="[font-family:var(--font-inter)] mt-4 text-2xl font-medium uppercase tracking-[0.12em] text-[#e2c8a2] md:text-3xl">
                    {post.title}
                  </h2>
                  {post.excerpt ? (
                    <p className="mt-4 max-w-xl text-[1rem] font-light leading-7 text-[#e6d9c5]/68">
                      {post.excerpt}
                    </p>
                  ) : null}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

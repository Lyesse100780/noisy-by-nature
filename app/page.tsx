"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Newsletter from "@/components/Newsletter";
import SiteNav from "@/components/SiteNav";
import { isSanityConfigured, sanityClient } from "@/lib/sanity/client";
import {
  featuredWorkshopPostsQuery,
  inTheWildItemsQuery,
  type InTheWildItem,
  type WorkshopPostSummary,
} from "@/lib/sanity/queries";

const mapFeaturedWorkshopPosts = (posts: WorkshopPostSummary[]) =>
  posts.filter((post) => post.title && post.slug && post.imageUrl);

export default function Home() {
  const [showContact, setShowContact] = useState(false);
  const [workshopPosts, setWorkshopPosts] = useState<WorkshopPostSummary[]>([]);
  const [inTheWildItems, setInTheWildItems] = useState<InTheWildItem[]>([]);
  const [activeEcosystemSlide, setActiveEcosystemSlide] = useState(0);
  const [ecosystemCarouselHeight, setEcosystemCarouselHeight] = useState<number | null>(null);
  const [activeWorkshopPost, setActiveWorkshopPost] = useState(0);
  const ecosystemCarouselRef = useRef<HTMLDivElement | null>(null);
  const workshopCarouselRef = useRef<HTMLDivElement | null>(null);
  const inTheWildCarouselRef = useRef<HTMLDivElement | null>(null);
  const inTheWildAutoScrollFrameRef = useRef<number | null>(null);
  const inTheWildAutoScrollPausedRef = useRef(false);
  const inTheWildAutoScrollEnabledRef = useRef(false);
  const inTheWildResumeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const el = ecosystemCarouselRef.current;
    if (!el) return;

    const updateHeight = (index: number) => {
      const slide = el.children[index] as HTMLElement | undefined;
      if (!slide) return;
      setEcosystemCarouselHeight(slide.offsetHeight);
    };

    const updateActiveSlide = () => {
      const slides = Array.from(el.children) as HTMLElement[];
      if (!slides.length) return;

      const nextIndex = slides.reduce(
        (closest, slide, index) => {
          const distance = Math.abs(slide.offsetLeft - el.scrollLeft);
          return distance < closest.distance ? { index, distance } : closest;
        },
        { index: 0, distance: Number.POSITIVE_INFINITY },
      ).index;

      setActiveEcosystemSlide(nextIndex);
      updateHeight(nextIndex);
    };

    updateActiveSlide();
    el.addEventListener("scroll", updateActiveSlide, { passive: true });
    window.addEventListener("resize", updateActiveSlide);

    const images = Array.from(el.querySelectorAll("img"));
    images.forEach((image) => image.addEventListener("load", updateActiveSlide));

    return () => {
      el.removeEventListener("scroll", updateActiveSlide);
      window.removeEventListener("resize", updateActiveSlide);
      images.forEach((image) => image.removeEventListener("load", updateActiveSlide));
    };
  }, []);

  const scrollEcosystemTo = (index: number) => {
    const el = ecosystemCarouselRef.current;
    const slide = el?.children[index] as HTMLElement | undefined;
    if (!el || !slide) return;
    el.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
  };

  useEffect(() => {
    const el = workshopCarouselRef.current;
    if (!el || workshopPosts.length < 2) return;

    const updateActivePost = () => {
      const cards = Array.from(el.children) as HTMLElement[];
      if (!cards.length) return;

      const nextIndex = cards.reduce(
        (closest, card, index) => {
          const distance = Math.abs(card.offsetLeft - el.scrollLeft);
          return distance < closest.distance ? { index, distance } : closest;
        },
        { index: 0, distance: Number.POSITIVE_INFINITY },
      ).index;

      setActiveWorkshopPost(nextIndex);
    };

    updateActivePost();
    el.addEventListener("scroll", updateActivePost, { passive: true });
    return () => el.removeEventListener("scroll", updateActivePost);
  }, [workshopPosts.length]);

  const scrollWorkshopTo = (index: number) => {
    const el = workshopCarouselRef.current;
    const card = el?.children[index] as HTMLElement | undefined;
    if (!el || !card) return;
    el.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
  };

  useEffect(() => {
    if (!isSanityConfigured || !sanityClient) return;

    let ignore = false;
    const client = sanityClient;

    const loadSanityContent = async () => {
      try {
        const [featuredPosts, wildItems] = await Promise.all([
          client.fetch<WorkshopPostSummary[]>(featuredWorkshopPostsQuery),
          client.fetch<InTheWildItem[]>(inTheWildItemsQuery),
        ]);

        if (ignore) return;

        const sanityWorkshopPosts = mapFeaturedWorkshopPosts(featuredPosts || []);
        const sanityInTheWildItems = (wildItems || []).filter((item) => item.caption && item.imageUrl);

        setWorkshopPosts(sanityWorkshopPosts);
        setInTheWildItems(sanityInTheWildItems);
      } catch {
        if (!ignore) {
          setWorkshopPosts([]);
          setInTheWildItems([]);
        }
      }
    };

    loadSanityContent();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const el = inTheWildCarouselRef.current;
    if (!el || inTheWildItems.length < 2) return;

    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const setAutoScrollState = () => {
      inTheWildAutoScrollEnabledRef.current = !mediaQuery.matches && !reducedMotionQuery.matches;
    };

    const stop = () => {
      if (inTheWildAutoScrollFrameRef.current !== null) {
        cancelAnimationFrame(inTheWildAutoScrollFrameRef.current);
        inTheWildAutoScrollFrameRef.current = null;
      }
    };

    const scheduleResume = (delayMs = 1400) => {
      if (inTheWildResumeTimerRef.current !== null) {
        window.clearTimeout(inTheWildResumeTimerRef.current);
      }
      inTheWildResumeTimerRef.current = window.setTimeout(() => {
        inTheWildAutoScrollPausedRef.current = false;
      }, delayMs);
    };

    const pauseForManualControl = (delayMs = 1400) => {
      inTheWildAutoScrollPausedRef.current = true;
      scheduleResume(delayMs);
    };

    const run = () => {
      if (!inTheWildAutoScrollEnabledRef.current) return;
      let direction = 1;

      const tick = () => {
        if (!inTheWildCarouselRef.current || !inTheWildAutoScrollEnabledRef.current) return;

        if (!inTheWildAutoScrollPausedRef.current) {
          const carousel = inTheWildCarouselRef.current;
          const maxScrollLeft = Math.max(0, carousel.scrollWidth - carousel.clientWidth);

          if (maxScrollLeft > 0) {
            carousel.scrollLeft += 0.32 * direction;

            if (carousel.scrollLeft >= maxScrollLeft - 2) {
              direction = -1;
            } else if (carousel.scrollLeft <= 2) {
              direction = 1;
            }
          }
        }

        inTheWildAutoScrollFrameRef.current = requestAnimationFrame(tick);
      };

      inTheWildAutoScrollFrameRef.current = requestAnimationFrame(tick);
    };

    const onMouseEnter = () => {
      inTheWildAutoScrollPausedRef.current = true;
    };

    const onMouseLeave = () => {
      scheduleResume(300);
    };

    const onPointerDown = () => {
      pauseForManualControl(1800);
    };

    const onPointerUp = () => {
      scheduleResume(1200);
    };

    const onTouchStart = () => {
      pauseForManualControl(1800);
    };

    const onTouchEnd = () => {
      scheduleResume(1400);
    };

    const onModeChange = () => {
      setAutoScrollState();
      stop();
      run();
    };

    setAutoScrollState();
    run();

    el.addEventListener("mouseenter", onMouseEnter);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("pointerup", onPointerUp);
    mediaQuery.addEventListener("change", onModeChange);
    reducedMotionQuery.addEventListener("change", onModeChange);

    return () => {
      stop();
      el.removeEventListener("mouseenter", onMouseEnter);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("pointerup", onPointerUp);
      mediaQuery.removeEventListener("change", onModeChange);
      reducedMotionQuery.removeEventListener("change", onModeChange);
      if (inTheWildResumeTimerRef.current !== null) {
        window.clearTimeout(inTheWildResumeTimerRef.current);
      }
    };
  }, [inTheWildItems]);

  return (
    <>
      {/* --- HERO SECTION --- */}
      <section
        id="hero"
        className="site-hero relative w-full overflow-hidden bg-[#100b08] text-[#f4ead8] [--hero-desktop-height:18vh] [--hero-mobile-height:6.35rem] max-[460px]:[--hero-mobile-height:6.8rem]"
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-100"
          style={{ backgroundImage: "url('/images/brand/background-topography-v2.png')" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(177,105,48,0.09),transparent_30%),linear-gradient(90deg,rgba(8,5,4,0.91),rgba(17,11,8,0.58)_46%,rgba(7,5,4,0.91)),linear-gradient(180deg,rgba(5,4,3,0.6),rgba(15,10,7,0.32)_52%,#1A1410_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-[#1A1410]" />

        <SiteNav onContact={() => setShowContact(true)} joinHref="#join-list" showHomeInMobileMenu={false} />

        <div className="site-hero__content relative z-10 mx-auto flex w-full max-w-7xl translate-y-5 items-center justify-center px-6 md:translate-y-0 md:px-10 lg:px-14">
          <div className="text-center">
            <h1
              className="[font-family:var(--font-playfair)] font-medium uppercase leading-none tracking-[0.18em] text-[rgba(219,198,168,0.92)] [text-shadow:0_1px_0_rgba(255,238,207,0.08),0_-1px_0_rgba(0,0,0,0.72),0_10px_26px_rgba(0,0,0,0.45)] [-webkit-text-stroke:0.18px_rgba(255,236,202,0.08)]"
            >
              <span className="block whitespace-nowrap text-[clamp(1rem,6.35vw,3.25rem)] tracking-[0.14em] md:text-[clamp(1.5rem,3.8vw,3.4rem)] md:tracking-[0.18em]">
                Noisy by Nature
              </span>
            </h1>
            <div className="mx-auto mt-3 flex w-full max-w-[min(86vw,44rem)] items-center justify-center gap-3 text-[#c38a50]/70 md:mt-4 md:gap-4">
              <span className="hidden h-px flex-1 bg-current opacity-40 sm:block" />
              <span className="h-1 w-1 rounded-full bg-current opacity-70" />
              <p className="[font-family:var(--font-inter)] whitespace-nowrap text-[clamp(0.42rem,1.1vw,0.6rem)] font-medium uppercase leading-none tracking-[0.22em] text-[#d5a06a]/88">
                Handcrafted Tools for Expressive Creators
              </p>
              <span className="h-1 w-1 rounded-full bg-current opacity-70" />
              <span className="hidden h-px flex-1 bg-current opacity-40 sm:block" />
            </div>
          </div>
        </div>
      </section>

      {/* --- PRODUCT ECOSYSTEM --- */}
      <div className="topographic-surface bg-[#1A1410]">
      <section id="controllers" className="text-[#F5EBDD] px-6 pb-16 pt-2 md:px-12 md:pb-24 md:pt-10 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-7 md:space-y-10">
            <div className="border-t border-[#8f5c32]/18 pt-6 md:pt-10">
              <div
                ref={ecosystemCarouselRef}
                className="no-scrollbar -mx-6 flex snap-x snap-mandatory items-start gap-6 overflow-x-auto overflow-y-hidden scroll-smooth px-6 pb-2 touch-pan-x transition-[height] duration-500 ease-out md:-mx-8 md:px-8 lg:-mx-10 lg:gap-10 lg:px-10"
                style={ecosystemCarouselHeight ? { height: ecosystemCarouselHeight + 8 } : undefined}
              >
              <article className="w-[88vw] shrink-0 snap-center md:w-[min(88vw,78rem)] lg:w-full">
              <div className="mb-6 md:mb-10">
                <p className="[font-family:var(--font-inter)] text-[0.62rem] font-medium uppercase tracking-[0.32em] text-[#c69054]/82">
                  Controllers
                </p>
              </div>
              <div className="space-y-10">
                <Link
                  id="fad3rs"
                  href="/fad3rs"
                  className="group grid gap-7 focus:outline-none min-[720px]:grid-cols-[0.42fr_0.58fr] min-[720px]:items-center min-[720px]:gap-7 min-[980px]:grid-cols-[0.48fr_0.52fr] min-[980px]:gap-10 lg:grid-cols-[0.52fr_0.48fr] lg:gap-18"
                  aria-label="View FAD3RS"
                >
                  <div className="relative h-[22rem] w-full overflow-hidden border border-[#8f5c32]/18 bg-[#0f0a07] shadow-[0_30px_76px_rgba(0,0,0,0.34)] min-[720px]:h-[30rem] min-[980px]:h-[34rem] lg:h-[40rem]">
                    <img
                      src="/images/brand/fad3rs-img1.png"
                      alt="FAD3RS MIDI controller on a wood surface"
                      className="h-full w-full object-cover object-center opacity-88 transition duration-500 group-hover:scale-[1.018] group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,8,6,0.01),rgba(12,8,6,0.18)),linear-gradient(90deg,rgba(14,9,7,0.2),transparent_42%,rgba(14,9,7,0.18))]" />
                  </div>
                  <div className="min-[720px]:py-3 min-[980px]:py-6 lg:py-10">
                    <h3 className="text-[clamp(1.42rem,3.5vw,3.15rem)] font-semibold uppercase leading-none tracking-[0.15em] text-[#dbc6a8] transition-colors duration-300 group-hover:text-[#e4c89e] lg:text-[clamp(2rem,4.45vw,3.9rem)]">
                      <span className="[font-family:var(--font-playfair)] font-medium">FAD</span>
                      <span className="[font-family:var(--font-inter)] [font-variant-numeric:tabular-nums]">3</span>
                      <span className="[font-family:var(--font-playfair)] font-medium">RS</span>
                    </h3>
                    <p className="mt-5 max-w-xl text-[1.02rem] font-light leading-relaxed text-[#e6d9c5]/78 md:text-base min-[980px]:text-lg">
                      A class-compliant MIDI controller built around three 100mm Alps faders for expressive automation and precise control.
                    </p>
                    <p className="mt-4 max-w-xl text-[1.02rem] font-light leading-relaxed text-[#e6d9c5]/70 md:text-base min-[980px]:text-lg">
                      Designed for composers, sound designers, and tactile workflows where drawing curves with a mouse breaks the musical flow.
                    </p>
                    <p className="[font-family:var(--font-inter)] mt-5 text-xs font-medium uppercase tracking-[0.24em] text-[#d5a06a]/86">
                      Stop clicking. Start drawing.
                    </p>
                  </div>
                </Link>
              </div>
              </article>

              <article className="w-[88vw] shrink-0 snap-center md:w-[min(88vw,78rem)] lg:w-full">
              <div className="mb-5 md:mb-6">
                <p className="[font-family:var(--font-inter)] text-[0.62rem] font-medium uppercase tracking-[0.32em] text-[#c69054]/82">
                  Cases
                </p>
              </div>
              <div className="grid gap-10 min-[720px]:grid-cols-[0.42fr_0.58fr] min-[720px]:items-center min-[720px]:gap-8 lg:grid-cols-[0.44fr_0.56fr] lg:gap-20">
                <div className="space-y-12 min-[720px]:py-8 lg:py-14">
                  <Link
                    href="/shop/cases"
                    className="group block transition-opacity duration-300 hover:opacity-90 focus:outline-none"
                    aria-label="View Eurorack Cases"
                  >
                    <h3 className="[font-family:var(--font-inter)] text-lg font-medium uppercase tracking-[0.24em] text-[#e2c8a2]/88 md:text-xl">
                      Eurorack Cases
                    </h3>
                    <p className="mt-5 max-w-md text-[1rem] font-light leading-relaxed text-[#e6d9c5]/74">
                      Our Eurorack modules have become true pieces of craftsmanship — why should their enclosure be any different?
                    </p>
                    <p className="mt-5 max-w-md text-[1rem] font-light leading-relaxed text-[#e6d9c5]/68">
                      Discover a refined selection of handcrafted cases, built with meticulous attention to detail and a deeply artisanal approach.
                    </p>
                    <p className="mt-5 max-w-md text-[1rem] font-light leading-relaxed text-[#e6d9c5]/68">
                      Inspiration also comes from the tools we use — and the stories they tell us.
                    </p>
                  </Link>
                  <Link
                    id="bespoke"
                    href="/bespoke"
                    className="group block border-l border-[#8f5c32]/20 pl-6 transition-colors duration-300 hover:border-[#c69054]/42 focus:outline-none"
                    aria-label="View Bespoke Builds"
                  >
                    <h3 className="[font-family:var(--font-inter)] text-sm font-medium uppercase tracking-[0.26em] text-[#e2c8a2]/86">
                      Bespoke Builds
                    </h3>
                    <p className="mt-5 max-w-sm text-[1rem] font-light leading-relaxed text-[#e6d9c5]/68">
                      Need a specific format,
                      <br />
                      finish, or workflow?
                    </p>
                    <p className="[font-family:var(--font-inter)] mt-7 text-xs font-medium uppercase tracking-[0.22em] text-[#d5a06a]/82">
                      Design yours now.
                    </p>
                  </Link>
                </div>
                <Link
                  href="/shop/cases"
                  className="group block focus:outline-none"
                  aria-label="View Eurorack Cases"
                >
                  <div className="relative h-[24rem] w-full overflow-hidden border border-[#8f5c32]/18 bg-[#0f0a07] shadow-[0_28px_70px_rgba(0,0,0,0.3)] md:h-[30rem] lg:h-[34rem]">
                    <img
                      src="/images/brand/cases-img1.png"
                      alt="Handcrafted Eurorack case in a workshop setting"
                      className="h-full w-full object-cover object-center opacity-86 transition duration-500 group-hover:scale-[1.018] group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,8,6,0.06),rgba(12,8,6,0.22)),linear-gradient(90deg,rgba(14,9,7,0.18),transparent_46%,rgba(14,9,7,0.16))]" />
                  </div>
                </Link>
              </div>
              </article>
              </div>

              <div className="mt-5 flex justify-center gap-2" aria-label="Product family carousel navigation">
                {["Controllers", "Cases"].map((label, index) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => scrollEcosystemTo(index)}
                    aria-label={`Go to ${label}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeEcosystemSlide === index
                        ? "w-7 bg-[#d5a06a]/78"
                        : "w-1.5 bg-[#8f5c32]/42 hover:bg-[#d5a06a]/58"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="border-t border-[#8f5c32]/18 py-1 md:py-2">
              <Newsletter id="join-list" />
            </div>

          </div>

          <div id="workshop" className="mt-7 border-t border-[#8f5c32]/18 pt-6 md:mt-14 md:pt-8">
            {workshopPosts.length > 0 ? (
              <div className="mb-0">
                <div className="mb-6 flex items-end justify-between gap-6">
                  <div>
                    <p className="[font-family:var(--font-inter)] text-[0.58rem] font-medium uppercase tracking-[0.28em] text-[#d5a06a]/74">
                      From the Workshop
                    </p>
                    <h2 className="[font-family:var(--font-inter)] mt-3 text-xl font-medium uppercase tracking-[0.16em] text-[#e2c8a2] md:text-2xl">
                      Notes, builds, and process
                    </h2>
                  </div>
                  <Link
                    href="/workshop"
                    className="[font-family:var(--font-inter)] hidden text-[0.58rem] font-medium uppercase tracking-[0.22em] text-[#d5a06a]/78 transition-colors hover:text-[#e4c89e] sm:block"
                  >
                    View all
                  </Link>
                </div>
                <div className="relative -mx-6 sm:mx-0">
                  <div
                    ref={workshopCarouselRef}
                    className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-3 touch-pan-x sm:gap-6 sm:px-0"
                  >
                    {workshopPosts.map((post) => (
                      <Link
                        key={post.slug}
                        href={`/workshop/${post.slug}`}
                        className="group relative h-[17rem] w-[84vw] max-w-none flex-shrink-0 snap-center overflow-hidden border border-[#8f5c32]/18 bg-[#0f0a07] shadow-[0_24px_62px_rgba(0,0,0,0.28)] sm:h-72 sm:w-[25rem] sm:snap-start md:h-76 md:w-[26rem]"
                      >
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="h-full w-full object-cover opacity-82 transition duration-500 group-hover:scale-[1.018] group-hover:opacity-96"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,8,6,0.05),rgba(12,8,6,0.76)),linear-gradient(90deg,rgba(14,9,7,0.18),transparent_50%,rgba(14,9,7,0.12))]" />
                        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                          {post.category ? (
                            <p className="[font-family:var(--font-inter)] text-[0.52rem] font-medium uppercase tracking-[0.22em] text-[#d5a06a]/78 sm:text-[0.55rem] sm:tracking-[0.24em]">
                              {post.category}
                            </p>
                          ) : null}
                          <h3 className="[font-family:var(--font-inter)] mt-3 text-base font-medium uppercase leading-snug tracking-[0.11em] text-[#f0dbc0] sm:text-lg sm:tracking-[0.12em]">
                            {post.title}
                          </h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
                {workshopPosts.length > 1 ? (
                  <div className="mt-3 flex justify-center gap-2" aria-label="Workshop carousel navigation">
                    {workshopPosts.map((post, index) => (
                      <button
                        key={post.slug}
                        type="button"
                        onClick={() => scrollWorkshopTo(index)}
                        aria-label={`Go to workshop post ${index + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          activeWorkshopPost === index
                            ? "w-6 bg-[#d5a06a]/78"
                            : "w-1.5 bg-[#8f5c32]/38 hover:bg-[#d5a06a]/54"
                        }`}
                      />
                    ))}
                  </div>
                ) : null}
                <Link
                  href="/workshop"
                  className="[font-family:var(--font-inter)] mt-3 inline-block text-[0.58rem] font-medium uppercase tracking-[0.22em] text-[#d5a06a]/78 transition-colors hover:text-[#e4c89e] sm:hidden"
                >
                  View all
                </Link>
              </div>
            ) : null}
          </div>

          {inTheWildItems.length > 0 ? (
            <section className="mt-7 border-t border-[#8f5c32]/18 pt-6 md:mt-14 md:pt-8">
              <div className="mb-6 flex items-end justify-between gap-6">
                <p className="[font-family:var(--font-inter)] text-[0.58rem] font-medium uppercase tracking-[0.28em] text-[#d5a06a]/74">
                  Noisy owners
                </p>
                <span className="[font-family:var(--font-inter)] hidden text-[0.54rem] font-medium uppercase tracking-[0.2em] text-[#d5a06a]/58 sm:block">
                  Real rigs, real spaces
                </span>
              </div>
              <h2 className="[font-family:var(--font-inter)] mb-6 text-xl font-medium uppercase tracking-[0.16em] text-[#e2c8a2] md:text-2xl">
                In the Wild
              </h2>
              <div className="relative -mx-6 sm:mx-0">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#1A1410] to-transparent sm:w-14" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#1A1410] to-transparent sm:w-14" />
                <div
                  ref={inTheWildCarouselRef}
                  className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-3 touch-pan-x sm:gap-6 sm:px-0"
                  style={{ touchAction: "pan-x" }}
                >
                  {inTheWildItems.map((item, index) => (
                    <article
                      key={`${item.caption}-${index}`}
                      className="group relative h-[17rem] w-[84vw] max-w-none flex-shrink-0 snap-center overflow-hidden border border-[#8f5c32]/18 bg-[#0f0a07] shadow-[0_24px_62px_rgba(0,0,0,0.28)] sm:h-72 sm:w-[25rem] sm:snap-start md:h-76 md:w-[26rem]"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.caption}
                        className="h-full w-full object-cover opacity-82 transition duration-500 group-hover:scale-[1.018] group-hover:opacity-96"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,8,6,0.02),rgba(12,8,6,0.68)),linear-gradient(90deg,rgba(14,9,7,0.14),transparent_52%,rgba(14,9,7,0.12))]" />
                      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                        <p className="[font-family:var(--font-inter)] text-sm font-medium uppercase tracking-[0.14em] text-[#f0dbc0] sm:text-base">
                          {item.caption}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          ) : null}
        </div>
      </section>

      </div>

      {/* --- CONTACT MODAL --- */}
      {showContact && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4 bg-black/70 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-[#1A1410] text-[#F5EBDD] rounded-lg p-8 max-w-md w-full shadow-xl relative animate-[scaleIn_0.25s_ease-out]">
            <button
              onClick={() => setShowContact(false)}
              className="absolute top-3 right-3 text-[#E6D9C5]/60 hover:text-noisy-copper transition-colors text-lg"
            >
              âœ•
            </button>
            <h2 className="text-2xl font-display mb-4 text-noisy-copper">Contact Me</h2>
            <form
              action="mailto:contact@noisybynature.eu"
              method="post"
              encType="text/plain"
              className="space-y-4"
            >
              <input
                type="text"
                name="name"
                placeholder="Your name"
                required
                className="w-full px-4 py-2 bg-transparent border border-[#b89c7a]/40 text-[#F5EBDD] placeholder-[#D9C9B2]/60 rounded-md focus:outline-none focus:border-noisy-copper"
              />
              <input
                type="email"
                name="email"
                placeholder="Your email"
                required
                className="w-full px-4 py-2 bg-transparent border border-[#b89c7a]/40 text-[#F5EBDD] placeholder-[#D9C9B2]/60 rounded-md focus:outline-none focus:border-noisy-copper"
              />
              <textarea
                name="message"
                rows={4}
                placeholder="Your message..."
                required
                className="w-full px-4 py-2 bg-transparent border border-[#b89c7a]/40 text-[#F5EBDD] placeholder-[#D9C9B2]/60 rounded-md focus:outline-none focus:border-noisy-copper resize-none"
              />
              <button
                type="submit"
                className="w-full bg-noisy-copper hover:bg-noisy-copper/80 text-white py-2 rounded-md transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

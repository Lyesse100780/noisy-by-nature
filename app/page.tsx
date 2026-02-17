"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  const [showContact, setShowContact] = useState(false);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const scrollInterval = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number | null>(null);

  // --- AUTO-SCROLL DESKTOP ---
  useEffect(() => {
    const el = carouselRef.current;
    if (!el || window.innerWidth < 768) return;
    let pos = 0;
    const step = () => {
      pos += 0.6;
      if (pos >= el.scrollWidth - el.clientWidth) pos = 0;
      el.scrollLeft = pos;
      scrollInterval.current = requestAnimationFrame(step);
    };
    scrollInterval.current = requestAnimationFrame(step);
    return () => {
      if (scrollInterval.current) cancelAnimationFrame(scrollInterval.current);
    };
  }, []);

  // --- TOUCH INTERACTIONS MOBILE ---
  const handleTouchStart = (e: React.TouchEvent<HTMLAnchorElement>) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
    e.currentTarget.classList.add("scale-[1.03]");
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLAnchorElement>, href: string) => {
    const dx = Math.abs((e.changedTouches[0].clientX ?? 0) - (touchStartX.current ?? 0));
    const dy = Math.abs((e.changedTouches[0].clientY ?? 0) - (touchStartY.current ?? 0));
    const dt = Date.now() - (touchStartTime.current ?? 0);
    e.currentTarget.classList.remove("scale-[1.03]");
    if (dx < 10 && dy < 10 && dt < 250) window.location.href = href;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLAnchorElement>) => {
    e.currentTarget.classList.remove("scale-[1.03]");
  };

  // --- FLÈCHES DESKTOP ---
  const scroll = (direction: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;
    const scrollAmount = window.innerWidth > 1024 ? 350 : 280;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // --- DONNÉES DU CARROUSEL ---
  const items = [
    { file: "Sagebloom 1.jpg", name: "Sagebloom – 6U / 62HP", link: "/shop/sagebloom", tone: "dark" },
    { file: "Coral Dust 1.jpg", name: "Coral Dust – 6U / 60HP", link: "/shop/coraldust", tone: "dark" },
    { file: "Frontier Green 7.png", name: "Frontier Green – 6U / 62HP", link: "/shop/frontiergreen", tone: "dark" },
    { file: "Ash Trail 1.jpg", name: "Ash Trail – 6U / 96HP", link: "/shop/ashtrail", tone: "dark" },
    { file: "Oxblood Mesa 1.jpg", name: "Oxblood Mesa – 6U / 84HP", link: "/shop/oxbloodmesa", tone: "light" },
    { file: "Burnt Leather 1.jpg", name: "Burnt Leather – 6U / 96HP", link: "/shop/burntleather", tone: "light" },
  ];

  return (
    <>
      {/* --- HERO SECTION --- */}
      <section
        id="hero"
        className="relative h-[48vh] md:h-[42vh] w-full bg-cover bg-center flex flex-col text-[#F5EBDD]
        bg-[url('/banner-mobile.jpg')] md:bg-[url('/banner-desktop.jpg')]"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1410]/60 via-transparent"></div>

        <header className="absolute top-0 left-0 w-full z-20 flex justify-center items-center px-8 py-5">
          <nav className="flex items-center justify-center space-x-6 text-xs md:text-sm uppercase tracking-wider text-[#F5EBDD]/80">
            <a href="#hero" className="hover:text-noisy-copper transition-colors">
              Home
            </a>
            <a href="/shop" className="hover:text-noisy-copper transition-colors">
              Shop
            </a>
            <button
              onClick={() => setShowContact(true)}
              className="hover:text-noisy-copper transition-colors"
            >
              CONTACT
            </button>
            <a
              href="https://www.instagram.com/noisy_by_nature_lab"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F5EBDD]/70 hover:text-noisy-copper transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-4 h-4 md:w-5 md:h-5 align-middle"
              >
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.25-.75a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z" />
              </svg>
            </a>
          </nav>
        </header>

        <div className="relative z-10 flex flex-col items-center text-center px-6 mt-[14vh] md:mt-[13vh]">
  {/* LOGO */}
  <picture>
    {/* Logo vertical uniquement pour mobile PORTRAIT */}
    <source media="(max-width: 767px) and (orientation: portrait)" srcSet="/logo-vertical.png" />
    {/* Logo horizontal pour tout le reste */}
    <img
      src="/logo-main.png"
      alt="Noisy by Nature"
      className="h-32 md:h-36 w-auto mb-4 drop-shadow-lg transition-all duration-300"
    />
  </picture>

  {/* TEXTES */}
  <p className="text-base md:text-2xl font-body mb-2 text-[#F5EBDD]/90">
    Premium Eurorack Cases
  </p>
  <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-noisy-copper font-medium">
    Handcrafted in Paris
  </p>
</div>





      </section>

      {/* --- CONCEPT SECTION --- */}
      <section id="concept" className="bg-[#1A1410] text-[#F5EBDD] py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-screen-lg mx-auto space-y-6 text-[17px] font-body leading-relaxed font-light">
          <p>
            I’m Lyesse, a professional composer. When I looked for a new case for my Eurorack modules, I quickly faced a simple truth — none of the available ones truly honored the instruments they were meant to hold.
          </p>

          <p>
            So, I decided to build my own. A case worthy of the small treasures our modern modules have become. Over time, the process evolved — new ideas appeared, and essential features revealed themselves through trial and error.
          </p>

          <p>
            Today, I’m offering you the same cases I wanted for myself — handcrafted with care, precision, and passion. Inspired by vintage design and a love for <strong>textures</strong>, I craft each case using tolex, fabrics and high-quality vinyls. Every creation is unique. Every collection is limited, shaped by the materials I find and the mood of the moment.
          </p>

          <p>
            I also take custom orders depending on my schedule and material availability — feel free to drop me a line at{" "}
            <a
              href="mailto:contact@noisybynature.eu"
              className="text-noisy-copper hover:text-noisy-copper/80 underline underline-offset-2 transition-colors"
            >
              contact@noisybynature.eu
            </a>{" "}
            if you’d like to discuss the case of your dreams.
          </p>

          {/* --- NEWSLETTER --- */}
<Newsletter />


        </div>
      </section>

      {/* --- FEATURED DROP --- */}
      <section id="shop" className="bg-[#1A1410] text-[#F5EBDD] pt-0 pb-6 px-6 md:px-12 lg:px-20 overflow-hidden">
        <div className="max-w-screen-xl mx-auto text-center mb-10">
          <h2 className="text-4xl font-display mb-2 text-noisy-copper">Featured Drop: Western Floral</h2>
          <p className="text-base font-body text-[#E6D9C5]/80">
            Limited collections, handcrafted with passion.
          </p>
        </div>

        <div className="relative w-full">
          <div
            ref={carouselRef}
            className="overflow-x-auto scroll-smooth snap-x snap-mandatory flex gap-6 pb-4 no-scrollbar touch-pan-x"
          >
            {items.map((item, i) => (
              <a
                key={i}
                href={item.link}
                className="snap-center flex-shrink-0 relative w-[280px] md:w-[320px] h-[280px] md:h-[320px] rounded-lg overflow-hidden shadow-lg group transition-transform duration-300 ease-in-out active:scale-[0.98]"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={(e) => handleTouchEnd(e, item.link)}
              >
                <img
                  src={`/images/western-floral/${item.file}`}
                  alt={item.name}
                  draggable="false"
                  className="w-full h-full object-cover pointer-events-none transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#1A1410]/60 via-transparent to-transparent py-4 text-center">
                  <p
                    className={`text-sm font-body tracking-wide ${
                      item.tone === "light" ? "text-black" : "text-white"
                    }`}
                  >
                    {item.name}
                  </p>
                </div>
              </a>
            ))}
          </div>

          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 bg-[#1A1410]/70 hover:bg-[#1A1410]/90 text-[#F5EBDD] p-3 rounded-full backdrop-blur-sm transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 bg-[#1A1410]/70 hover:bg-[#1A1410]/90 text-[#F5EBDD] p-3 rounded-full backdrop-blur-sm transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mt-10">
          <a
            href="/shop"
            className="inline-block bg-noisy-copper hover:bg-noisy-copper/80 text-white px-8 py-3 rounded-md transition-colors duration-300 font-body"
          >
            View All Cases
          </a>
        </div>
      </section>

      {/* --- CONTACT MODAL --- */}
      {showContact && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4 bg-black/70 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-[#1A1410] text-[#F5EBDD] rounded-lg p-8 max-w-md w-full shadow-xl relative animate-[scaleIn_0.25s_ease-out]">
            <button
              onClick={() => setShowContact(false)}
              className="absolute top-3 right-3 text-[#E6D9C5]/60 hover:text-noisy-copper transition-colors text-lg"
            >
              ✕
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

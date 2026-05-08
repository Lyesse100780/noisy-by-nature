"use client";

import SiteNav from "@/components/SiteNav";
import { openNewsletterPopup } from "@/lib/newsletter";

export default function Mast3rPage() {
  return (
    <main className="topographic-surface min-h-screen bg-[#1A1410] text-[#F5EBDD]">
      <section className="site-hero relative overflow-hidden bg-[#100b08] text-[#f4ead8] [--hero-desktop-height:23vh] [--hero-mobile-height:8rem]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-100"
          style={{ backgroundImage: "url('/images/brand/background-topography-v2.png')" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(177,105,48,0.09),transparent_32%),linear-gradient(90deg,rgba(8,5,4,0.92),rgba(17,11,8,0.56)_48%,rgba(7,5,4,0.92)),linear-gradient(180deg,rgba(5,4,3,0.62),rgba(15,10,7,0.32)_54%,#1A1410_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-[#1A1410]" />

        <SiteNav />

        <div className="site-hero__content relative z-10 mx-auto flex w-full max-w-7xl items-center justify-center px-6 md:px-10 lg:px-14">
          <h1 className="text-[clamp(1.75rem,4vw,3.5rem)] font-semibold uppercase leading-none tracking-[0.18em] text-[rgba(219,198,168,0.92)]">
            <span className="[font-family:var(--font-playfair)] font-medium">MAST</span>
            <span className="[font-family:var(--font-inter)] [font-variant-numeric:tabular-nums]">3</span>
            <span className="[font-family:var(--font-playfair)] font-medium">R</span>
          </h1>
        </div>
      </section>

      <section className="px-6 py-8 md:px-10 md:py-10 lg:px-14">
        <div className="mx-auto max-w-4xl border-t border-[#8f5c32]/18 pt-4 text-center">
          <p className="[font-family:var(--font-inter)] text-[0.62rem] font-medium uppercase tracking-[0.24em] text-[#d5a06a]/76">
            Future controller
          </p>
          <h2 className="[font-family:var(--font-inter)] mt-2 text-2xl font-medium uppercase tracking-[0.14em] text-[#e2c8a2] md:text-3xl">
            The perfect monitoring remote solution
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[1rem] leading-relaxed text-[#e6d9c5]/72 md:text-[1.05rem]">
            MAST3R is in active development. We are refining ergonomics, controls, and integration to build a focused
            tool for modern monitoring workflows.
          </p>
          <p className="[font-family:var(--font-inter)] mt-4 text-xs font-medium uppercase tracking-[0.24em] text-[#d5a06a]/82">
            Coming soon
          </p>

          <button
            type="button"
            onClick={() => openNewsletterPopup("mast3r")}
            className="mt-6 inline-block border border-[#c69054]/46 px-5 py-2.5 [font-family:var(--font-inter)] text-[0.62rem] font-medium uppercase tracking-[0.2em] text-[#d5a06a] transition hover:border-[#d5a06a]/76 hover:bg-[#d5a06a]/10 hover:text-[#efd1a2]"
          >
            Notify me when available
          </button>
        </div>
      </section>
    </main>
  );
}

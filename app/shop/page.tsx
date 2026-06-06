"use client";

import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import SiteNav from "@/components/SiteNav";
import { openNewsletterPopup } from "@/lib/newsletter";
import { caseProducts, controllerProducts } from "@/lib/shop-products";

export default function Shop() {
  return (
    <main className="topographic-surface min-h-screen bg-[#1A1410] text-[#F5EBDD]">
      <section className="site-hero relative overflow-hidden bg-[#100b08] text-[#f4ead8] [--hero-desktop-height:23vh] [--hero-mobile-height:8.75rem]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-100"
          style={{ backgroundImage: "url('/images/brand/background-topography-v2.png')" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(177,105,48,0.09),transparent_32%),linear-gradient(90deg,rgba(8,5,4,0.92),rgba(17,11,8,0.56)_48%,rgba(7,5,4,0.92)),linear-gradient(180deg,rgba(5,4,3,0.62),rgba(15,10,7,0.32)_54%,#1A1410_100%)]" />
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
              Shop
            </h1>
            <div className="mx-auto mt-3 flex w-full max-w-[min(76vw,24rem)] items-center justify-center gap-3 text-[#c38a50]/70 md:mt-4 md:gap-4">
              <span className="hidden h-px flex-1 bg-current opacity-36 sm:block" />
              <p className="[font-family:var(--font-inter)] whitespace-nowrap text-[clamp(0.52rem,1.25vw,0.68rem)] font-medium uppercase leading-none tracking-[0.24em] text-[#d5a06a]/86">
                Objects for the studio
              </p>
              <span className="hidden h-px flex-1 bg-current opacity-36 sm:block" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-10 md:px-10 md:py-12 lg:px-14">
        <div className="mx-auto max-w-7xl">
          <nav className="flex flex-wrap gap-3 border-y border-[#8f5c32]/18 py-4 [font-family:var(--font-inter)] text-[0.62rem] font-medium uppercase tracking-[0.24em] text-[#d5a06a]/76">
            <a href="#controllers-shop" className="transition-colors hover:text-[#efd1a2]">
              Controllers
            </a>
            <span className="text-[#8f5c32]/48">/</span>
            <Link href="/shop/cases" className="transition-colors hover:text-[#efd1a2]">
              In Stock Cases
            </Link>
          </nav>

          <section id="controllers-shop" className="border-b border-[#8f5c32]/18 py-10 md:py-12">
            <p className="[font-family:var(--font-inter)] text-[0.58rem] font-medium uppercase tracking-[0.28em] text-[#d5a06a]/74">
              Controllers
            </p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <article
                className="group flex flex-col overflow-hidden border border-[#8f5c32]/18 bg-[#120c08]/26 shadow-[0_24px_62px_rgba(0,0,0,0.24)] transition-colors hover:border-[#d5a06a]/42"
              >
                <Link href="/shop/fad3rs" className="relative block h-[22rem] overflow-hidden bg-[#0f0a07]">
                  <img
                    src={controllerProducts[0].images[0]}
                    alt="FAD3RS MIDI controller"
                    className="h-full w-full object-cover object-center opacity-88 grayscale-[0.18] transition duration-500 group-hover:scale-[1.018] group-hover:opacity-96"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,8,6,0.02),rgba(12,8,6,0.34)),linear-gradient(90deg,rgba(14,9,7,0.16),transparent_52%,rgba(14,9,7,0.16))]" />
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0c0806]/30">
                    <span className="border border-[#d5a06a]/46 bg-[#120c08]/74 px-5 py-2 [font-family:var(--font-inter)] text-[0.62rem] font-medium uppercase tracking-[0.28em] text-[#efd1a2] shadow-[0_18px_42px_rgba(0,0,0,0.42)]">
                      Out of Stock
                    </span>
                  </div>
                </Link>
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <Link href="/shop/fad3rs">
                      <h2 className="[font-family:var(--font-inter)] text-lg font-medium uppercase tracking-[0.2em] text-[#e2c8a2]">
                        FAD3RS
                      </h2>
                    </Link>
                    <p className="mt-3 text-sm leading-6 text-[#e6d9c5]/66">
                      Class-compliant MIDI controller built around three 100mm Alps faders.
                    </p>
                  </div>
                  <div className="mt-6">
                    <p className="text-sm font-medium text-[#e6d9c5]/84">EUR 179 launch price</p>
                    <button
                      type="button"
                      onClick={() => openNewsletterPopup("fad3rs")}
                      className="mt-4 block w-full border border-[#c69054]/46 bg-[#d5a06a]/8 px-5 py-2.5 text-center [font-family:var(--font-inter)] text-[0.62rem] font-medium uppercase tracking-[0.2em] text-[#d5a06a] transition hover:border-[#d5a06a]/76 hover:bg-[#d5a06a]/12 hover:text-[#efd1a2]"
                    >
                      Notify me when available
                    </button>
                  </div>
                </div>
              </article>
              <Link
                href="/mast3r"
                className="group border border-[#8f5c32]/18 bg-[#120c08]/20 p-5 transition-colors hover:border-[#d5a06a]/46"
              >
                <h2 className="[font-family:var(--font-inter)] text-lg font-medium uppercase tracking-[0.2em] text-[#e2c8a2]">
                  MAST3R
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#e6d9c5]/66">Future desktop controller.</p>
              </Link>
            </div>
          </section>

          <section id="cases-shop" className="py-10 md:py-12">
            <div className="mb-8">
              <p className="[font-family:var(--font-inter)] text-[0.58rem] font-medium uppercase tracking-[0.28em] text-[#d5a06a]/74">
                In stock cases
              </p>
              <h2 className="[font-family:var(--font-inter)] mt-3 text-xl font-medium uppercase tracking-[0.16em] text-[#e2c8a2] md:text-2xl">
                Eurorack Cases
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {caseProducts.map((product) => (
                <a
                  key={product.slug}
                  href={`/shop/${product.slug}`}
                  className="group flex flex-col overflow-hidden border border-[#8f5c32]/18 bg-[#120c08]/26 shadow-[0_24px_62px_rgba(0,0,0,0.24)] transition-colors hover:border-[#d5a06a]/42"
                >
                  <div className="relative h-[18rem] overflow-hidden bg-[#0f0a07]">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className={`h-full w-full object-cover opacity-84 transition duration-500 group-hover:scale-[1.018] group-hover:opacity-96 ${
                        product.stockQuantity === 0 ? "grayscale-[0.28]" : ""
                      }`}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,8,6,0.02),rgba(12,8,6,0.22)),linear-gradient(90deg,rgba(14,9,7,0.14),transparent_52%,rgba(14,9,7,0.12))]" />
                    {product.stockQuantity === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#0c0806]/42 backdrop-blur-[1px]">
                        <span className="border border-[#d5a06a]/46 bg-[#120c08]/74 px-5 py-2 [font-family:var(--font-inter)] text-[0.62rem] font-medium uppercase tracking-[0.28em] text-[#efd1a2] shadow-[0_18px_42px_rgba(0,0,0,0.42)]">
                          Sold Out
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <h3 className="[font-family:var(--font-inter)] text-base font-medium uppercase tracking-[0.18em] text-[#e2c8a2]">
                        {product.name}
                      </h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#e6d9c5]/66">
                        {product.description.split("\n")[1] || ""}
                      </p>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-[#e6d9c5]/84">{product.price}</p>
                        {product.stockQuantity === 0 && (
                          <p className="[font-family:var(--font-inter)] text-[0.56rem] font-medium uppercase tracking-[0.2em] text-[#d5a06a]/70">
                            Sold out
                          </p>
                        )}
                      </div>
                      <AddToCartButton
                        slug={product.slug}
                        available={product.available}
                        maxQuantity={product.stockQuantity}
                        label="Add to Cart"
                        className={`mt-4 w-full border px-5 py-2.5 [font-family:var(--font-inter)] text-[0.62rem] font-medium uppercase tracking-[0.2em] transition ${
                          product.available && product.stockQuantity > 0
                            ? "border-[#c69054]/46 bg-[#d5a06a]/8 text-[#d5a06a] hover:border-[#d5a06a]/76 hover:bg-[#d5a06a]/12 hover:text-[#efd1a2]"
                            : "cursor-not-allowed border-[#8f5c32]/16 bg-[#120c08]/18 text-[#8a7965]"
                        }`}
                      />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

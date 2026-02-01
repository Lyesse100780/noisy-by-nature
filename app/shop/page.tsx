"use client";

import { products } from "../data/products";

export default function Shop() {
  return (
    <section className="bg-[#1A1410] text-[#F5EBDD] min-h-screen relative">

      {/* --- HEADER --- */}
      <header className="absolute top-0 left-0 w-full z-20 flex justify-center md:justify-end items-center px-6 md:px-8 py-3 md:py-5">
        <nav className="flex space-x-6 md:space-x-8 text-[0.8rem] md:text-sm uppercase tracking-wider text-[#F5EBDD]/80 items-center font-body">
          <a href="/" className="hover:text-noisy-copper transition-colors">Home</a>
          <a href="/shop" className="hover:text-noisy-copper transition-colors">Shop</a>
          <a href="#contact" className="hover:text-noisy-copper transition-colors">Contact</a>

          <a
            href="https://instagram.com/noisybynature"
            target="_blank"
            rel="noreferrer"
            className="text-[#F5EBDD]/80 hover:text-noisy-copper transition-colors flex items-center"
            aria-label="Instagram"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-[15px] w-[15px] md:h-5 md:w-5">
              <path d="M7.75 2C4.574 2 2 4.574 2 7.75v8.5C2 19.426 4.574 22 7.75 22h8.5C19.426 22 22 19.426 22 16.25v-8.5C22 4.574 19.426 2 16.25 2h-8.5zM4.5 7.75A3.25 3.25 0 0 1 7.75 4.5h8.5a3.25 3.25 0 0 1 3.25 3.25v8.5a3.25 3.25 0 0 1-3.25 3.25h-8.5A3.25 3.25 0 0 1 4.5 16.25v-8.5zm7.25 2.25a3.25 3.25 0 1 0 0 6.5 3.25 3.25 0 0 0 0-6.5zm0 1.5a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5zm5.25-.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5z" />
            </svg>
          </a>
        </nav>
      </header>

      {/* --- HERO --- */}
      <div
        className="relative h-[20vh] md:h-[22vh] bg-cover bg-center flex items-center justify-center text-center"
        style={{ backgroundImage: "url('/banner-western-floral.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1410]/60 via-[#1A1410]/40 to-[#1A1410]/60" />
        <div className="relative z-10 px-4 mt-[3vh] md:mt-0">
          <h1 className="text-3xl md:text-5xl font-display mb-2 text-noisy-copper">
            Western Floral — Drop 1/2
          </h1>
          <p className="text-sm md:text-lg text-[#E6D9C5]/80">
            Handcrafted collection — November 2025
          </p>
        </div>
      </div>

      {/* --- PRODUCTS --- */}
      <div
        id="shop"
        className="max-w-screen-xl mx-auto py-20 px-6 md:px-12 lg:px-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
      >
        {products.map((product) => (
          <a
            key={product.slug}
            href={`/shop/${product.slug}`}
            className="bg-[#241C17]/60 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all flex flex-col group"
          >
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform"
            />

            <div className="p-6 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="text-2xl font-display text-noisy-copper mb-2">
                  {product.name}
                </h3>
                <p className="text-[#E6D9C5]/80 text-[15px] mb-4 line-clamp-3">
                  {product.description.split("\n")[1] || ""}
                </p>
              </div>

              <div>
                <p className="text-lg font-semibold mb-3">{product.price}</p>

                <button
  type="button"
  disabled={!product.paymentLink}
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.paymentLink) return;
    window.location.assign(product.paymentLink);
  }}
  className={`px-6 py-2 rounded-md w-full transition ${
    product.paymentLink
      ? "bg-noisy-copper hover:bg-noisy-copper/80 text-white"
      : "bg-[#3a2f27] text-white/40 cursor-not-allowed opacity-60"
  }`}
>
  Buy Now
</button>

              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

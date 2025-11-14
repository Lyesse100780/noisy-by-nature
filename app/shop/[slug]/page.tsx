"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { products } from "../../data/products";
import Link from "next/link";


async function handleBuy(priceId: string, country: string) {
  console.log("HANDLE BUY → priceId envoyé au backend =", priceId);
  console.log("HANDLE BUY → country =", country);

  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ priceId, shippingCountry: country }),
  });

  const data = await res.json();

  console.log("STRIPE RESPONSE =", data);

  if (data.url) {
    window.location.href = data.url;
  } else {
    alert("Error initiating checkout");
  }
}

export default function ProductPage() {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);

  // ✅ Country selector (default France)
  const [selectedCountry, setSelectedCountry] = useState("FR");

  console.log("DEBUG PRODUCT (depuis React) =", product);
  console.log("DEBUG PRICE ID =", product?.stripePriceId);

  if (!product) {
    return (
      <div className="text-center text-[#E6D9C5] py-40">
        <h2 className="text-2xl font-display">Product not found</h2>
      </div>
    );
  }

  // --- Média principal (images + vidéos combinés) ---
  const media = [...product.images, ...(product.video ? [product.video] : [])];
  const [activeMedia, setActiveMedia] = useState(media[0] || "");
  const isVideo = (src: string) =>
    src.endsWith(".mp4") || src.endsWith(".mov") || src.endsWith(".webm");

  return (
    <section className="bg-[#1A1410] text-[#F5EBDD] min-h-screen py-20 px-6 md:px-12 lg:px-20 relative overflow-x-hidden">
      {/* --- HEADER --- */}
  <header className="absolute top-0 left-0 w-full z-20 flex justify-between items-center px-8 py-6 backdrop-blur-sm bg-[#1A1410]/40">
    <Link
      href="/shop"
      className="text-[#E6D9C5]/70 hover:text-noisy-copper transition-colors font-body text-sm uppercase tracking-wide flex items-center gap-2"
    >
      <span className="text-noisy-copper">←</span> Back to Shop
    </Link>
  </header>

      {/* --- CONTENU DU PRODUIT --- */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-start mt-20">
        
        {/* --- GALERIE --- */}
        <div className="flex flex-col items-center w-full">

          <div className="relative w-[100vw] md:w-full max-w-[min(100%,820px)] -mx-6 md:mx-0 rounded-lg overflow-hidden">
            {isVideo(activeMedia) ? (
              <video
                key={activeMedia}
                src={activeMedia}
                controls
                playsInline
                muted
                loop
                autoPlay
                preload="metadata"
                className="block w-full h-auto max-h-[72vh] object-contain rounded-lg"
              />
            ) : (
              <img
                key={activeMedia}
                src={activeMedia}
                alt={product.name}
                className="block w-full h-auto max-h-[72vh] object-contain rounded-lg"
              />
            )}
          </div>

          <div className="-mx-6 md:mx-0 w-[100vw] md:w-full mt-4 pb-2 overflow-x-auto no-scrollbar snap-x snap-mandatory touch-pan-x flex gap-3 justify-start md:justify-center">
            {media.map((m, i) => (
              <button
                key={i}
                onClick={() => setActiveMedia(m)}
                className={`flex-shrink-0 snap-center w-20 h-20 rounded-md border-2 overflow-hidden transition-all duration-300 ${
                  activeMedia === m
                    ? "border-noisy-copper opacity-100"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                {isVideo(m) ? (
                  <video
                    src={m}
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={m}
                    alt={`${product.name} ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* --- DESCRIPTION & BUY --- */}
        <div className="space-y-8 pt-4">
          <h1 className="text-4xl font-display text-noisy-copper mb-3">
            {product.name}
          </h1>

          <p className="text-lg text-[#E6D9C5]/90 leading-relaxed whitespace-pre-line font-body">
            {product.description}
          </p>

          {product.specs && (
            <div className="border-l-2 border-noisy-copper/60 pl-6">
              <ul className="text-[#E6D9C5]/80 space-y-3 text-[15px]">
                {product.specs.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2"
                    dangerouslySetInnerHTML={{
                      __html: `<span class='text-noisy-copper'>•</span> ${s}`,
                    }}
                  />
                ))}
              </ul>
            </div>
          )}

          <p className="text-2xl font-semibold mb-6">{product.price}</p>

          {/* --- SELECTEUR DE PAYS (TEMPORAIRE OU DÉFINITIF) --- */}
          <div className="mt-8 mb-4 flex flex-col gap-3 w-full max-w-xs">
  <label className="text-sm text-[#E6D9C5]/70">Shipping country</label>

  <select
    value={selectedCountry}
    onChange={(e) => setSelectedCountry(e.target.value)}
    className="bg-[#1A1410] border border-noisy-copper/50 text-[#F5EBDD]
               px-4 py-3 rounded-md focus:border-noisy-copper
               focus:outline-none transition-all w-full"
  >
    <option value="FR">France</option>
    <option value="BE">Belgium</option>
    <option value="DE">Germany</option>
    <option value="DK">Denmark</option>
    <option value="EE">Estonia</option>
    <option value="ES">Spain</option>
    <option value="FI">Finland</option>
    <option value="IT">Italy</option>
    <option value="LT">Lithuania</option>
    <option value="LV">Latvia</option>
    <option value="NL">Netherlands</option>
    <option value="PL">Poland</option>
    <option value="PT">Portugal</option>
    <option value="RO">Romania</option>
    <option value="SE">Sweden</option>
    <option value="GB">United Kingdom</option>
    <option value="US">United States</option>
    <option value="CA">Canada</option>
  </select>

  <p className="text-xs text-[#E6D9C5]/50">
    * International orders may be subject to customs duties or import taxes. These fees are the
    responsibility of the recipient.
  </p>
</div>


          <button
            onClick={() => handleBuy(product.stripePriceId, selectedCountry)}
            className="inline-block bg-noisy-copper hover:bg-noisy-copper/80 text-white px-10 py-4 rounded-md transition-all duration-300 font-body text-sm tracking-widest uppercase shadow-md hover:shadow-copper/30"
          >
            Buy Now
          </button>
        </div>
      </div>
    </section>
  );
}

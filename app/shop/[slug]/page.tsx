"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import AddToCartButton from "@/components/AddToCartButton";
import { openNewsletterPopup } from "@/lib/newsletter";
import { shopProducts } from "@/lib/shop-products";

export default function ProductPage() {
  const params = useParams();

  // Next can give string | string[] depending on how route is used.
  const slug = useMemo(() => {
    const raw = (params as { slug?: string | string[] })?.slug;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  const product = useMemo(() => {
    if (!slug) return undefined;
    return shopProducts.find((p) => p.slug === slug);
  }, [slug]);

  // Safe media array
  const media = useMemo(() => product?.images ?? [], [product]);

  const [selectedMedia, setSelectedMedia] = useState<Record<string, string>>({});
  const [selectedUsb, setSelectedUsb] = useState<"usb-a" | "usb-c" | "">("");
  const activeMedia = (slug ? selectedMedia[slug] : undefined) || media[0] || "";
  const activeMediaIndex = Math.max(0, media.indexOf(activeMedia));
  const requiresUsbChoice = product?.slug === "fad3rs";
  const usbOptions = requiresUsbChoice ? product?.variants ?? [] : [];
  const selectedUsbOption = usbOptions.find((option) => option.id === selectedUsb);
  const selectedStockQuantity = selectedUsbOption?.stockQuantity ?? product?.stockQuantity ?? 0;
  const selectedUsbSoldOut = requiresUsbChoice && Boolean(selectedUsb) && selectedStockQuantity <= 0;
  const fad3rsFullySoldOut = requiresUsbChoice && (product?.stockQuantity ?? 0) <= 0;

  const selectMediaAt = (index: number) => {
    if (!slug || media.length === 0) return;
    const nextIndex = (index + media.length) % media.length;
    setSelectedMedia((current) => ({ ...current, [slug]: media[nextIndex] }));
  };

  if (!product) {
    return (
      <section className="topographic-surface bg-[#1A1410] text-[#F5EBDD] min-h-screen py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl mx-auto text-center py-40">
          <h2 className="text-2xl font-display text-[#E6D9C5]">
            Product not found
          </h2>
          <p className="text-[#E6D9C5]/60 mt-4 font-body">
            This item may have been removed or the link is incorrect.
          </p>
          <div className="mt-8">
            <Link
              href="/shop"
              className="text-[#E6D9C5]/70 hover:text-noisy-copper transition-colors font-body text-sm uppercase tracking-wide"
            >
              ← Back to Shop
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="topographic-surface bg-[#1A1410] text-[#F5EBDD] min-h-screen py-20 px-6 md:px-12 lg:px-20 relative overflow-x-hidden">
      {/* --- HEADER --- */}
      <header className="absolute top-0 left-0 w-full z-20 flex justify-between items-center px-8 py-6 backdrop-blur-sm bg-[#1A1410]/40">
        <Link
          href="/shop"
          className="text-[#E6D9C5]/70 hover:text-noisy-copper transition-colors font-body text-sm uppercase tracking-wide flex items-center gap-2"
        >
          <span className="text-noisy-copper">←</span> Back to Shop
        </Link>
      </header>

      {/* --- CONTENU --- */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-start mt-20">
        {/* --- GALERIE --- */}
        <div className="flex flex-col items-center w-full">
          <div className="relative w-[100vw] md:w-full max-w-[min(100%,820px)] -mx-6 md:mx-0 rounded-lg overflow-hidden">
            {activeMedia ? (
              <div className="relative">
                <img
                  src={activeMedia}
                  alt={product.name}
                  className={`block w-full h-auto max-h-[72vh] object-contain rounded-lg ${
                    product.stockQuantity === 0 ? "grayscale-[0.2]" : ""
                  }`}
                />
                {product.stockQuantity === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0c0806]/28">
                    <span className="border border-[#d5a06a]/46 bg-[#120c08]/78 px-6 py-2.5 font-body text-xs font-medium uppercase tracking-[0.28em] text-[#efd1a2] shadow-[0_18px_42px_rgba(0,0,0,0.42)]">
                      Sold Out
                    </span>
                  </div>
                )}
                {media.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => selectMediaAt(activeMediaIndex - 1)}
                      className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#d5a06a]/34 bg-[#0c0806]/58 text-xl leading-none text-[#efd1a2] backdrop-blur-sm transition hover:border-[#d5a06a]/68 hover:bg-[#0c0806]/78"
                      aria-label="Previous FAD3RS image"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => selectMediaAt(activeMediaIndex + 1)}
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#d5a06a]/34 bg-[#0c0806]/58 text-xl leading-none text-[#efd1a2] backdrop-blur-sm transition hover:border-[#d5a06a]/68 hover:bg-[#0c0806]/78"
                      aria-label="Next FAD3RS image"
                    >
                      ›
                    </button>
                    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                      {media.map((m, index) => (
                        <button
                          key={`dot-${m}`}
                          type="button"
                          onClick={() => selectMediaAt(index)}
                          className={`h-1.5 rounded-full transition-all ${
                            index === activeMediaIndex ? "w-5 bg-[#d5a06a]" : "w-1.5 bg-[#efd1a2]/42"
                          }`}
                          aria-label={`View FAD3RS image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="w-full h-[50vh] flex items-center justify-center bg-[#201915] text-[#E6D9C5]/60">
                No image available
              </div>
            )}
          </div>

          {media.length > 1 && (
            <div className="-mx-6 md:mx-0 w-[100vw] md:w-full mt-4 pb-2 overflow-x-auto no-scrollbar snap-x snap-mandatory touch-pan-x flex gap-3 justify-start md:justify-center">
              {media.map((m, i) => (
                <button
                  key={`${m}-${i}`}
                  type="button"
                  onClick={() => selectMediaAt(i)}
                  className={`flex-shrink-0 snap-center w-20 h-20 rounded-md border-2 overflow-hidden transition-all duration-300 ${
                    activeMedia === m
                      ? "border-noisy-copper opacity-100"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <img
                    src={m}
                    alt={`${product.name} ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- DESCRIPTION & BUY --- */}
        <div className="space-y-4 pt-4">
          <h1 className="text-3xl font-display text-noisy-copper mb-3">
            {product.name}
          </h1>

          <p className="text-lg text-[#E6D9C5]/90 leading-relaxed whitespace-pre-line font-body">
            {product.description}
          </p>

          {Array.isArray(product.specs) && product.specs.length > 0 && (
            <div className="border-l-2 border-noisy-copper/60 pl-6">
              <ul className="text-[#E6D9C5]/80 space-y-3 text-[15px]">
                {product.specs.map((s: string, i: number) => (
                  <li key={`${i}-${s}`} className="flex items-start gap-2">
                    <span className="text-noisy-copper">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-baseline gap-4 mb-4">
            <p className="text-2xl font-semibold text-noisy-copper">{product.price}</p>
            {product.slug === "fad3rs" && (
              <p className="text-lg text-[#E6D9C5]/50 line-through">EUR 229</p>
            )}
          </div>

          {requiresUsbChoice && (
            <div className="rounded-md border border-[#8f5c32]/20 bg-[#120c08]/32 p-4">
              <p className="font-body text-xs font-medium uppercase tracking-[0.22em] text-[#d5a06a]/78">
                Choose USB cable
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {usbOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedUsb(option.id)}
                    className={`rounded-md border px-4 py-3 text-left transition-all ${
                      selectedUsb === option.id
                        ? "border-noisy-copper bg-noisy-copper/12 text-[#efd1a2]"
                        : "border-[#8f5c32]/24 bg-[#0f0a07]/60 text-[#e6d9c5]/72 hover:border-noisy-copper/50 hover:text-[#efd1a2]"
                    } ${!option.available ? "opacity-60" : ""}`}
                  >
                    <span className="block font-body text-sm font-medium uppercase tracking-[0.18em]">{option.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-[#e6d9c5]/56">
                      {option.available ? option.detail : `${option.detail} · sold out`}
                    </span>
                  </button>
                ))}
              </div>
              {!selectedUsb && (
                <p className="mt-3 text-xs leading-5 text-[#d5a06a]/66">
                  Select USB-A or USB-C before adding FAD3RS to the cart.
                </p>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {fad3rsFullySoldOut || selectedUsbSoldOut ? (
              <button
                type="button"
                onClick={() => openNewsletterPopup("fad3rs")}
                className="inline-block rounded-md border border-[#c69054]/46 bg-[#d5a06a]/8 px-10 py-4 font-body text-sm uppercase tracking-widest text-noisy-copper transition-all duration-300 hover:border-[#d5a06a]/76 hover:bg-[#d5a06a]/12 hover:text-[#efd1a2]"
              >
                Notify me when available
              </button>
            ) : (
              <AddToCartButton
                slug={product.slug}
                available={product.available}
                maxQuantity={selectedStockQuantity}
                label="Add to Cart"
                disabledLabel={requiresUsbChoice && !selectedUsb ? "Choose USB Type" : undefined}
                cartOptions={
                  requiresUsbChoice && selectedUsbOption
                    ? {
                        variantId: selectedUsbOption.id,
                        variantLabel: selectedUsbOption.variantLabel,
                      }
                    : undefined
                }
                className={`inline-block px-10 py-4 rounded-md transition-all duration-300 font-body text-sm tracking-widest uppercase shadow-md ${
                  product.available && selectedStockQuantity > 0 && (!requiresUsbChoice || selectedUsb)
                    ? "bg-noisy-copper hover:bg-noisy-copper/80 text-white hover:shadow-copper/30"
                    : "bg-[#3a2f27] text-white/40 cursor-not-allowed opacity-60"
                }`}
              />
            )}
            {product.available && product.stockQuantity > 0 && (
              <Link
                href="/cart"
                className="inline-block rounded-md border border-noisy-copper/50 px-10 py-4 font-body text-sm uppercase tracking-widest text-noisy-copper transition-all duration-300 hover:bg-noisy-copper/10"
              >
                View Cart
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

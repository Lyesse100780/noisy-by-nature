"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import { CartItem, readCart, removeFromCart, writeCart } from "@/lib/cart";
import { getShopProduct } from "@/lib/shop-products";
import { formatAmount, getShippingOptions, shippingCountries, type ShippingMethodId } from "@/lib/shipping";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [shippingCountry, setShippingCountry] = useState("FR");
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodId>("mondial-relay");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setItems(readCart());
  }, []);

  const cartProducts = useMemo(
    () =>
      items
        .map((item) => {
          const product = getShopProduct(item.slug);
          if (!product) return null;
          return { item, product };
        })
        .filter((entry): entry is NonNullable<typeof entry> => entry !== null),
    [items],
  );

  const total = cartProducts.reduce((sum, entry) => sum + entry.product.priceAmount * entry.item.quantity, 0);
  const shippableProducts = cartProducts.flatMap(({ item, product }) =>
    Array.from({ length: item.quantity }, () => product),
  );
  const shippingOptions = getShippingOptions(shippingCountry, shippableProducts);
  const selectedShipping = shippingOptions.find((option) => option.id === shippingMethod) ?? shippingOptions[0];
  const orderTotal = total + (selectedShipping?.amount ?? 0);

  useEffect(() => {
    if (shippingOptions.length > 0 && !shippingOptions.some((option) => option.id === shippingMethod)) {
      setShippingMethod(shippingOptions[0].id);
    }
  }, [shippingMethod, shippingOptions]);

  const updateQuantity = (slug: string, quantity: number) => {
    const product = getShopProduct(slug);
    const maxQuantity = product?.stockQuantity ?? 1;
    const next = items.map((item) =>
      item.slug === slug ? { ...item, quantity: Math.max(1, Math.min(maxQuantity, quantity)) } : item,
    );
    setItems(next);
    writeCart(next);
  };

  const removeItem = (slug: string) => {
    const next = removeFromCart(slug);
    setItems(next);
  };

  const startCheckout = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shipping: {
            countryCode: shippingCountry,
            methodId: selectedShipping?.id,
          },
        }),
      });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Unable to start checkout.");
      }

      window.location.assign(data.url);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Unable to start checkout.");
      setLoading(false);
    }
  };

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
              Cart
            </h1>
          </div>
        </div>
      </section>

      <section className="px-6 py-12 md:px-10 lg:px-14">
        <div className="mx-auto max-w-7xl border-t border-[#8f5c32]/18 pt-10">
          <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[1fr_22rem]">
            <div>
              <p className="[font-family:var(--font-inter)] text-[0.58rem] font-medium uppercase tracking-[0.28em] text-[#d5a06a]/74">
                Cart
              </p>

              {cartProducts.length === 0 ? (
                <div className="mt-6 max-w-xl">
                  <p className="text-sm leading-7 text-[#e6d9c5]/68">The cart is currently empty.</p>
                  <Link
                    href="/shop"
                    className="mt-6 inline-block border border-[#c69054]/46 px-5 py-2.5 [font-family:var(--font-inter)] text-[0.62rem] font-medium uppercase tracking-[0.2em] text-[#d5a06a] transition hover:border-[#d5a06a]/76 hover:bg-[#d5a06a]/10 hover:text-[#efd1a2]"
                  >
                    Return to Shop
                  </Link>
                </div>
              ) : (
                <div className="mt-7 space-y-5">
                  {cartProducts.map(({ item, product }) => (
                    <div
                      key={product.slug}
                      className="grid gap-4 border border-[#8f5c32]/18 bg-[#120c08]/22 p-4 sm:grid-cols-[8rem_1fr_auto]"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-32 w-full object-cover sm:h-full"
                      />
                      <div>
                        <h2 className="[font-family:var(--font-inter)] text-sm font-medium uppercase tracking-[0.18em] text-[#e2c8a2]">
                          {product.name}
                        </h2>
                        <p className="mt-3 text-sm text-[#e6d9c5]/72">{product.price}</p>
                        {!product.available && (
                          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#b6784d]">Currently unavailable</p>
                        )}
                        {product.available && product.stockQuantity <= 3 && (
                          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#d5a06a]/68">
                            {product.stockQuantity} in stock
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                        <label className="sr-only" htmlFor={`quantity-${product.slug}`}>
                          Quantity
                        </label>
                        <input
                          id={`quantity-${product.slug}`}
                          type="number"
                          min={1}
                          max={product.stockQuantity}
                          value={item.quantity}
                          onChange={(event) => updateQuantity(product.slug, Number(event.target.value))}
                          className="w-16 border border-[#8f5c32]/24 bg-[#0f0a07] px-3 py-2 text-center text-sm text-[#e6d9c5] outline-none focus:border-[#d5a06a]/60"
                        />
                        <button
                          type="button"
                          onClick={() => removeItem(product.slug)}
                          className="[font-family:var(--font-inter)] text-[0.58rem] uppercase tracking-[0.2em] text-[#d5a06a]/70 transition hover:text-[#efd1a2]"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartProducts.length > 0 && (
              <aside className="h-fit border border-[#8f5c32]/18 bg-[#120c08]/30 p-6 shadow-[0_24px_62px_rgba(0,0,0,0.2)]">
                <p className="[font-family:var(--font-inter)] text-[0.58rem] font-medium uppercase tracking-[0.28em] text-[#d5a06a]/74">
                  Summary
                </p>
                <div className="mt-5 flex items-center justify-between border-b border-[#8f5c32]/18 pb-4 text-sm text-[#e6d9c5]/76">
                  <span>Subtotal</span>
                  <span>{formatAmount(total)}</span>
                </div>
                <p className="mt-4 text-xs leading-6 text-[#e6d9c5]/56">
                  Promotion codes are handled securely at checkout.
                </p>
                <div className="mt-5 space-y-4 border-b border-[#8f5c32]/18 pb-5">
                  <label className="block">
                    <span className="[font-family:var(--font-inter)] text-[0.56rem] uppercase tracking-[0.2em] text-[#d5a06a]/70">
                      Shipping country
                    </span>
                    <select
                      value={shippingCountry}
                      onChange={(event) => setShippingCountry(event.target.value)}
                      className="mt-2 w-full border border-[#8f5c32]/24 bg-[#0f0a07] px-3 py-2.5 text-sm text-[#e6d9c5] outline-none focus:border-[#d5a06a]/60"
                    >
                      {shippingCountries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  {shippingOptions.length > 0 ? (
                    <div className="space-y-2">
                      {shippingOptions.map((option) => (
                        <label
                          key={option.id}
                          className={`flex cursor-pointer items-center justify-between gap-3 border px-3 py-2.5 text-sm transition ${
                            selectedShipping?.id === option.id
                              ? "border-[#d5a06a]/52 bg-[#d5a06a]/8 text-[#efd1a2]"
                              : "border-[#8f5c32]/20 bg-[#0f0a07]/48 text-[#e6d9c5]/68 hover:border-[#d5a06a]/36"
                          }`}
                        >
                          <span>{option.label}</span>
                          <span>{formatAmount(option.amount)}</span>
                          <input
                            type="radio"
                            name="shipping-method"
                            value={option.id}
                            checked={selectedShipping?.id === option.id}
                            onChange={() => setShippingMethod(option.id)}
                            className="sr-only"
                          />
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs leading-6 text-[#d28b65]">No shipping option is available for this destination.</p>
                  )}
                  <a
                    href="mailto:contact@noisybynature.eu"
                    className="inline-flex items-center gap-2 [font-family:var(--font-inter)] text-[0.56rem] uppercase tracking-[0.18em] text-[#d5a06a]/68 transition hover:text-[#efd1a2]"
                  >
                    <Mail className="h-3 w-3" strokeWidth={1.6} />
                    Your country is not in the list? Drop me a line.
                  </a>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-[#e6d9c5]/76">
                  <span>Shipping</span>
                  <span>{selectedShipping ? formatAmount(selectedShipping.amount) : "Unavailable"}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm font-medium text-[#e6d9c5]/88">
                  <span>Total</span>
                  <span>{formatAmount(orderTotal)}</span>
                </div>
                <button
                  type="button"
                  disabled={loading || !selectedShipping || cartProducts.some(({ product }) => !product.available)}
                  onClick={startCheckout}
                  className="mt-6 w-full border border-[#c69054]/56 bg-[#d5a06a]/10 px-5 py-3 [font-family:var(--font-inter)] text-[0.62rem] font-medium uppercase tracking-[0.2em] text-[#d5a06a] transition hover:border-[#d5a06a]/80 hover:bg-[#d5a06a]/14 hover:text-[#efd1a2] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {loading ? "Opening Checkout" : "Checkout"}
                </button>
                {error && <p className="mt-4 text-sm leading-6 text-[#d28b65]">{error}</p>}
              </aside>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export type CartItem = {
  slug: string;
  quantity: number;
};

export const cartStorageKey = "nbn-cart-v1";

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(cartStorageKey);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item) => typeof item?.slug === "string")
      .map((item) => ({
        slug: item.slug,
        quantity: Math.max(1, Math.min(9, Number(item.quantity) || 1)),
      }));
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(cartStorageKey, JSON.stringify(items));
  window.dispatchEvent(new Event("cart:updated"));
}

export function addToCart(slug: string, quantity = 1) {
  const cart = readCart();
  const current = cart.find((item) => item.slug === slug);

  if (current) {
    current.quantity = Math.max(1, Math.min(9, current.quantity + quantity));
  } else {
    cart.push({ slug, quantity: Math.max(1, Math.min(9, quantity)) });
  }

  writeCart(cart);
  return cart;
}

export function removeFromCart(slug: string) {
  const cart = readCart().filter((item) => item.slug !== slug);
  writeCart(cart);
  return cart;
}

export function clearCart() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(cartStorageKey);
  window.dispatchEvent(new Event("cart:updated"));
}

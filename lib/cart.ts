export type CartItem = {
  slug: string;
  quantity: number;
  variantId?: string;
  variantLabel?: string;
};

export type AddToCartOptions = Pick<CartItem, "variantId" | "variantLabel">;

export const cartStorageKey = "nbn-cart-v1";

export function getCartItemKey(item: Pick<CartItem, "slug" | "variantId">) {
  return item.variantId ? `${item.slug}:${item.variantId}` : item.slug;
}

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(cartStorageKey);
    if (!stored) return [];

    const parsed = JSON.parse(stored) as CartItem[];
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item) => typeof item?.slug === "string")
      .map((item) => ({
        slug: item.slug,
        quantity: Math.max(1, Math.min(9, Number(item.quantity) || 1)),
        variantId: typeof item.variantId === "string" ? item.variantId : undefined,
        variantLabel: typeof item.variantLabel === "string" ? item.variantLabel : undefined,
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

export function addToCart(slug: string, quantity = 1, options: AddToCartOptions = {}, maxQuantity = 9) {
  const cart = readCart();
  const variantId = options.variantId;
  const current = cart.find((item) => item.slug === slug && item.variantId === variantId);
  const limit = Math.max(1, Math.min(9, maxQuantity));

  if (current) {
    current.quantity = Math.max(1, Math.min(limit, current.quantity + quantity));
  } else {
    cart.push({
      slug,
      quantity: Math.max(1, Math.min(limit, quantity)),
      variantId,
      variantLabel: options.variantLabel,
    });
  }

  writeCart(cart);
  return cart;
}

export function removeFromCart(keyOrSlug: string) {
  const cart = readCart().filter((item) => getCartItemKey(item) !== keyOrSlug && item.slug !== keyOrSlug);
  writeCart(cart);
  return cart;
}

export function clearCart() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(cartStorageKey);
  window.dispatchEvent(new Event("cart:updated"));
}

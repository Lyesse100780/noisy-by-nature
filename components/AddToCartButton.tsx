"use client";

import { useState } from "react";
import { addToCart, type AddToCartOptions } from "@/lib/cart";

type AddToCartButtonProps = {
  slug: string;
  available: boolean;
  maxQuantity?: number;
  className?: string;
  label?: string;
  soldOutLabel?: string;
  disabledLabel?: string;
  cartOptions?: AddToCartOptions;
};

export default function AddToCartButton({
  slug,
  available,
  maxQuantity = 9,
  className,
  label = "Add to Cart",
  soldOutLabel = "Sold out",
  disabledLabel,
  cartOptions,
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const isAvailable = available && maxQuantity > 0;
  const canAdd = isAvailable && !disabledLabel;

  return (
    <button
      type="button"
      disabled={!canAdd}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!canAdd) return;
        addToCart(slug, 1, cartOptions, maxQuantity);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1400);
      }}
      className={className}
    >
      {canAdd ? (added ? "Added" : label) : disabledLabel || soldOutLabel}
    </button>
  );
}

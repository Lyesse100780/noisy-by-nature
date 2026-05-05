"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart";

type AddToCartButtonProps = {
  slug: string;
  available: boolean;
  maxQuantity?: number;
  className?: string;
  label?: string;
  soldOutLabel?: string;
};

export default function AddToCartButton({
  slug,
  available,
  maxQuantity = 9,
  className,
  label = "Add to Cart",
  soldOutLabel = "Sold out",
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const canAdd = available && maxQuantity > 0;

  return (
    <button
      type="button"
      disabled={!canAdd}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!canAdd) return;
        addToCart(slug);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1400);
      }}
      className={className}
    >
      {canAdd ? (added ? "Added" : label) : soldOutLabel}
    </button>
  );
}

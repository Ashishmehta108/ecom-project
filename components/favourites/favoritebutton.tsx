"use client";

import { useState, useTransition } from "react";
import { toggleFavouriteAction } from "@/lib/actions/favourite-actions";

import { useFavouriteState } from "@/lib/states/favorite.state";
import ClickableHeart from "./heartAnimated";
import { toast } from "sonner";

export default function FavoriteButton({ product }: { product: any }) {
  const { items, setFavouriteItems } = useFavouriteState();
  const [isPending, startTransition] = useTransition();

  // Correct image (primary image)
  const primaryImage =
    product.productImages?.find((img: any) => img.position == "0") ||
    product.productImages?.[0];

  const imageUrl = primaryImage?.url ?? "/placeholder.png";

  const isFav = items.some((i) => i.productId === product.id);

  function handleToggle(e: any) {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      const res = await toggleFavouriteAction(product.id, imageUrl);

      if (!res.success) {
        toast.error("Please login first");
        return;
      }

      // 🔥 UPDATE LOCAL STATE IN SYNC WITH BACKEND
      let updatedItems = [...items];

      if (res.removed) {
        updatedItems = updatedItems.filter((i) => i.productId !== product.id);
      } else {
        updatedItems.push({
          productId: product.id,
          name: product.productName,
          price: product.pricing.price,
          image: imageUrl,
        });
      }

      setFavouriteItems(updatedItems);
    });
  }

  return (
    <button
      disabled={isPending}
      onClick={handleToggle}
      className={`absolute right-2 top-2 rounded-full bg-neutral-50 border p-1 border-neutral-200 
        transition 
        ${
          isFav
            ? "text-red-600 dark:bg-red-950 dark:border-red-900"
            : "text-neutral-500"
        }
      `}
    >
      <ClickableHeart filled={isFav} />
    </button>
  );
}

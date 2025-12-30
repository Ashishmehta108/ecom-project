"use client";

import { useFavouriteState } from "@/lib/states/favorite.state";
import ClickableHeart from "./heartAnimated";

export default function FavoriteButton({ product }: { product: any }) {
  const { items, toggleFavourite } = useFavouriteState();

  const primaryImage =
    product?.productImages?.find((img: any) => img.position === "0") ||
    product?.productImages?.[0];
  const imageUrl = primaryImage?.url || "/placeholder.png";

  const name =
    typeof product.productName === "string"
      ? product.productName
      : product.productName?.en || product.productName?.pt || "Product";

  const price = product.pricing?.price ?? 0;

  const isFav = items.some((i) => i.productId === product.id);

  const handleClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavourite({ productId: product.id, name, price, image: imageUrl });
  };

  return (
    <button
      onClick={handleClick}
      className={`absolute right-2 top-2 rounded-full border p-1
        transition
        ${
          isFav
            ? "text-red-600 bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-900"
            : "text-neutral-500 bg-neutral-50 border-neutral-200"
        }
      `}
    >
      <ClickableHeart filled={isFav} />
    </button>
  );
}

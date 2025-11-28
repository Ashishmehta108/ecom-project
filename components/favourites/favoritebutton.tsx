"use client";

import { useFavouriteState } from "@/lib/states/favorite.state";
import ClickableHeart from "@/app/test/page";

export default function FavoriteButton({ product }: { product: any }) {
  const { items, toggleFavourite } = useFavouriteState();
  const isFav = items.some((i) => i.productId === product.id);
  console.log(items);
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavourite({
          productId: product.id,
          name: product.productName,
          image: product.image,
          price: product.price,
        });
      }}
      className={` absolute right-2 top-2 rounded-full bg-neutral-50 border-neutral-200 p-0 border  transition 
        ${
          isFav
            ? " text-red-600 dark:bg-red-950 dark:border-red-900"
            : " text-neutral-500"
        }
      `}
    >
      <ClickableHeart />
    </button>
  );
}

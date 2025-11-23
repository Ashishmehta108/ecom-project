"use client";

import { memo } from "react";
import Link from "next/link";
import { ShoppingBag } from "iconsax-reactjs";

interface CartButtonProps {
  items: number;
}

export function CartButton({ items }: CartButtonProps) {
  return (
    <Link
      href="/cart"
      className="relative p-2 rounded-full hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 transition-colors duration-150"
      aria-label={`Cart with ${items} ${items === 1 ? "item" : "items"}`}
    >
      <ShoppingBag
        size={22}
        className="text-neutral-700 dark:text-neutral-300"
      />

      {items > 0 && (
        <span
          className="
            absolute -top-1.5 -right-1.5
            h-5 min-w-5
            bg-indigo-600 text-white dark:bg-neutral-100 dark:text-neutral-900
            text-xs font-bold rounded-full
            flex items-center justify-center
            px-1
          "
        >
          {items > 99 ? "99+" : items}
        </span>
      )}
    </Link>
  );
}

export default memo(CartButton);

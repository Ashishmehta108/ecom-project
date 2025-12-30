"use client";

import Link from "next/link";
import { ShoppingBag } from "iconsax-reactjs";
import userCartState from "@/lib/states/cart.state";

export default function CartButton() {
  const items = userCartState((s) => s.items.length);

  return (
    <Link href="/cart" className="relative p-2 rounded-full">
      <ShoppingBag size={22} />

      {items > 0 && (
        <span className="absolute -top-1.5 -right-1.5 h-5 min-w-5 text-xs rounded-full font-bold bg-indigo-600 text-white flex items-center justify-center px-1">
          {items > 99 ? "99+" : items}
        </span>
      )}
    </Link>
  );
}

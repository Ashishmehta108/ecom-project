"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="relative w-60 h-60 mb-6 opacity-90">
        <Image
          src="/cartempty.svg"
          alt="Empty Cart"
          fill
          className="object-contain"
        />
      </div>

      <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
        Your cart is empty
      </h2>

      <p className="text-sm mt-2 text-neutral-500 dark:text-neutral-400 max-w-sm">
        Looks like you haven't added anything yet. Explore our products and find
        something you love.
      </p>

      <Link href="/products" className="mt-6">
        <Button variant="default" className="cursor-pointer rounded-xl px-5 py-2">
          Browse Products
        </Button>
      </Link>
    </div>
  );
}

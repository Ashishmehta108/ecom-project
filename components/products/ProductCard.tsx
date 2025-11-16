"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type ProductCardProps = {
  product: {
    id: string;
    productName: string;
    brand: string;
    subCategory: string;
    description: string;
    features: string[];
    pricing: {
      price: number;
      inStock: boolean;
      currency: string;
      discount: number;
    };
    productImages: Array<{
      url: string;
      position: string;
    }>;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.productImages.find((img) => img.position === "0");
  const formattedPrice = `₹${product.pricing.price.toLocaleString("en-IN")}`;

  return (
    <article className="group flex h-[600px] flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
      {/* Image */}
      <Link
        href={`/products/${product.id}`}
        className="relative block overflow-hidden bg-white dark:bg-neutral-800"
      >
        <div className="aspect-square flex items-center justify-center bg-muted/10 rounded-lg">
          <Image
            src={mainImage?.url || "/placeholder.jpg"}
            alt={product.productName}
            width={280}
            height={280}
            className="object-contain transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Stock badge */}
        {!product.pricing.inStock && (
          <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-neutral-700 shadow-sm backdrop-blur-sm dark:bg-neutral-900/95 dark:text-neutral-300">
            Out of stock
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Category */}
        <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          {product.subCategory}
        </p>

        {/* Title */}
        <Link href={`/products/${product.id}`}>
          <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-snug text-neutral-900 transition-colors hover:text-neutral-600 dark:text-neutral-100 dark:hover:text-neutral-300">
            {product.productName}
          </h3>
        </Link>

        {/* Description - hidden on mobile, visible on larger screens */}
        {/* <p className="mt-2 hidden line-clamp-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:block">
          {product.description}
        </p> */}

        {/* Features pills - top 2 only */}
        <div className="mt-3 flex flex-wrap gap-2">
          {product.features.slice(0, 2).map((feature, idx) => (
            <span
              key={idx}
              className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

     
        <div className="mt-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-semibold tracking-tight text-neutral-600 dark:text-neutral-100">
              {formattedPrice}
            </p>
            {product.pricing.discount > 0 && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {product.pricing.discount}% off
              </p>
            )}
          </div>
          <Button
            size="sm"
            className="rounded-full bg-neutral-900 px-5 text-xs font-medium hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
            disabled={!product.pricing.inStock}
          >
            {product.pricing.inStock ? "Add to cart" : "Notify me"}
          </Button>
        </div>
      </div>
    </article>
  );
}

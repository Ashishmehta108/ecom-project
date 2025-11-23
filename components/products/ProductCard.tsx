"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { addItemToCart } from "@/lib/actions/cart-actions";
import { toast } from "sonner";
import { isInCart } from "@/lib/helper/cart/cart.helper";

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
  userId: string;
};

export function ProductCard({ product, userId }: ProductCardProps) {
  const mainImage = product.productImages.find((img) => img.position === "0");
  const formattedPrice = `€${product.pricing.price.toLocaleString("en-IN")}`;

  const addToCart = async (userId: string, productId: string) => {
    const data = await addItemToCart(userId, productId, 1);
    if (data.success) {
      toast.success(`${data.data.name} added to cart successfully`);
    }
  };
  const inCart = isInCart(product.id);
  return (
    <article className="group flex h-[540px] flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
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

        {!product.pricing.inStock && (
          <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-neutral-700 shadow-sm backdrop-blur-sm dark:bg-neutral-900/95 dark:text-neutral-300">
            Out of stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          {product.subCategory}
        </p>

        <Link href={`/products/${product.id}`}>
          <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-snug text-neutral-900 transition-colors hover:text-neutral-600 dark:text-neutral-100 dark:hover:text-neutral-300">
            {product.productName}
          </h3>
        </Link>

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
          {inCart ? (
            <Button
              size="sm"
              variant="outline"
              className="rounded-full px-5 text-xs font-medium flex items-center gap-2 border-green-600 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-950"
            >
              <span className="h-2 w-2 rounded-full bg-green-600 dark:bg-green-300" />
              In Cart
            </Button>
          ) : (
            <Button
              size="sm"
              className="rounded-full bg-neutral-900 px-5 text-xs font-medium hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
              disabled={!product.pricing.inStock}
              onClick={() => addToCart(userId, product.id)}
            >
              {product.pricing.inStock ? "Add to cart" : "Notify me"}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

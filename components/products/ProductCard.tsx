"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { addItemToCart } from "@/lib/actions/cart-actions";
import { toast } from "sonner";
import { isInCart } from "@/lib/helper/cart/cart.helper";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

type ProductCardProps = {
  product: any;
  userId: string;
  listView?: boolean;
};

export function ProductCard({ product, userId, listView }: ProductCardProps) {
  const mainImage = product.productImages.find(
    (img: any) => img.position === "0"
  );

  const pathname = usePathname();
  const user = authClient.useSession();
  const isAdmin = user.data?.user.role === "admin";
  const isInsideAdminProducts = pathname.startsWith("/admin/products");

  // Admin preview mode
  const adminViewOnly = isAdmin && isInsideAdminProducts;

  const productLink = adminViewOnly
    ? `/admin/products/${product.id}`
    : `/products/${product.id}`;

  const stockQty =
    product.pricing.stockQuantity !== undefined
      ? product.pricing.stockQuantity
      : 0;

  const outOfStock = stockQty <= 0;
  const inCart = isInCart(product.id);

  const addToCart = async (userId: string, productId: string) => {
    const data = await addItemToCart(userId, productId, 1);
    if (data.success) toast.success(`product added to cart`);
  };

  return (
    <article
      className={cn(
        "group relative w-full overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:bg-neutral-900",
        "border-neutral-200 dark:border-neutral-800",
        listView
          ? "flex gap-4 p-4 h-auto"
          : `flex ${adminViewOnly ? "h-[420px]" : "h-[540px]"} flex-col`
      )}
    >
      {/* Dim overlay for users only */}
      {!adminViewOnly && outOfStock && (
        <div className="absolute inset-0 z-20 bg-black/5 pointer-events-none rounded-xl" />
      )}

      {/* Product Image */}
      <Link
        href={productLink}
        className={cn(
          "relative overflow-hidden rounded-lg bg-neutral-50 dark:bg-neutral-800",
          listView ? "w-28 h-28 flex-shrink-0" : "aspect-square w-full"
        )}
      >
        {/* Out of stock badge — only for customers */}
        {!adminViewOnly && outOfStock && (
          <span className="absolute right-2 top-2 z-30 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-red-600 shadow-sm backdrop-blur dark:bg-neutral-900/90 dark:text-red-400">
            Out of stock
          </span>
        )}

        <Image
          src={mainImage?.url || "/placeholder.jpg"}
          alt={product.productName}
          fill={!listView}
          width={listView ? 120 : undefined}
          height={listView ? 120 : undefined}
          className="object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105 p-3"
        />
      </Link>

      {/* Content */}
      <div
        className={cn("flex flex-col", listView ? "flex-1 py-1" : "flex-1 p-5")}
      >
        {/* Subcategory */}
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          {product.subCategory}
        </p>

        {/* Name */}
        <Link href={productLink}>
          <h3
            className={cn(
              "mt-2 line-clamp-2 text-base font-semibold leading-snug text-neutral-900 transition-colors hover:text-neutral-600",
              "dark:text-neutral-100 dark:hover:text-neutral-300"
            )}
          >
            {product.productName}
          </h3>
        </Link>

        {/* Features — hidden for admin */}
        {!adminViewOnly && !listView && (
          <div className="mt-3 flex flex-wrap gap-2">
            {product.features
              .slice(0, 2)
              .map((feature: string, idx: number) => (
                <span
                  key={idx}
                  className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                >
                  {feature}
                </span>
              ))}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* ADMIN VIEW — show stock & price but no add to cart */}
        {adminViewOnly && (
          <div className="mt-4 space-y-3">
            {/* Stock */}
            <p
              className={cn(
                "text-sm font-medium",
                outOfStock
                  ? "text-red-600 dark:text-red-400"
                  : "text-neutral-700 dark:text-neutral-300"
              )}
            >
              Stock:{" "}
              <span className="font-semibold">
                {stockQty} {outOfStock && "(Out of Stock)"}
              </span>
            </p>

            {/* Price (same as user price, including discount) */}
            <div className="flex items-center">
              {product.pricing.discount > 0 ? (
                <div className="space-y-0.5">
                  <p className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                    €
                    {(
                      product.pricing.price -
                      (product.pricing.price * product.pricing.discount) / 100
                    ).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>

                  <p className="text-xs line-through text-neutral-500 dark:text-neutral-400">
                    €{product.pricing.price.toLocaleString("en-IN")}
                  </p>

                  <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    {product.pricing.discount}% OFF
                  </p>
                </div>
              ) : (
                <p className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                  €{product.pricing.price.toLocaleString("en-IN")}
                </p>
              )}
            </div>
          </div>
        )}

        {/* USER VIEW — price + cart */}
        {!adminViewOnly && (
          <div
            className={cn(
              "mt-5 flex items-center gap-4",
              listView ? "justify-between" : "justify-between"
            )}
          >
            {/* Price */}
            <div className="flex items-center">
              {product.pricing.discount > 0 ? (
                <div className="space-y-0.5">
                  <p className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                    €
                    {(
                      product.pricing.price -
                      (product.pricing.price * product.pricing.discount) / 100
                    ).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>

                  <p className="text-xs line-through text-neutral-500 dark:text-neutral-400">
                    €{product.pricing.price.toLocaleString("en-IN")}
                  </p>

                  <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    {product.pricing.discount}% OFF
                  </p>
                </div>
              ) : (
                <p className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                  €{product.pricing.price.toLocaleString("en-IN")}
                </p>
              )}
            </div>

            {/* Add to Cart */}
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
                disabled={outOfStock}
                onClick={() => addToCart(userId, product.id)}
                className={cn(
                  "rounded-full px-5 text-xs font-medium transition",
                  outOfStock
                    ? "bg-neutral-300 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400 cursor-not-allowed"
                    : "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                )}
              >
                {outOfStock ? "Coming Soon" : "Add to cart"}
              </Button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

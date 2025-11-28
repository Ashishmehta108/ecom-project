"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ReviewPage from "@/components/reviews/page";
import { Product } from "@/lib/types/product.types";
import AddToCartButton from "@/components/cart/addToCart";
import { authClient } from "@/lib/auth-client";

const FALLBACK_IMG = "https://via.placeholder.com/500x500.png?text=No+Image";

export default function ProductPage({ product }: { product: Product }) {
  const user = authClient.useSession();

  const outOfStock =
    product.pricing?.stockQuantity === 0 || product.pricing?.stockQuantity <= 0;

  const images =
    Array.isArray(product.productImages) && product.productImages.length > 0
      ? product.productImages.map((i) => i.url)
      : [FALLBACK_IMG];

  const [selectedImage, setSelectedImage] = useState(images[0]);

  const price = Number(product.pricing?.price ?? 0);
  const discount = Number(product.pricing?.discount ?? 0);

  const discountedPrice = useMemo(() => {
    if (discount > 0 && discount <= 100) {
      return price - (price * discount) / 100;
    }
    return price;
  }, [price, discount]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 text-neutral-900 dark:text-neutral-100">
      {/* TOP GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* LEFT — IMAGE GALLERY */}
        <div className="flex flex-col lg:flex-row gap-4">
          {images.length > 1 && (
            <div className="flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto pb-1 lg:pb-0 order-2 lg:order-1 scrollbar-thin">
              {images.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(url)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg bg-neutral-100 overflow-hidden transition-all duration-200 hover:bg-neutral-200 ${
                    selectedImage === url
                      ? "ring-0 ring-indigo-600 ring-offset-0 bg-neutral-200  border-[1px] border-neutral-300 dark:ring-offset-neutral-900"
                      : "opacity-80 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={url}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-contain mix-blend-multiply p-2"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Image */}
          <div className="flex-1 rounded-xl bg-white dark:bg-neutral-900 overflow-hidden order-1 lg:order-2 border border-neutral-200 dark:border-neutral-800">
            <div className="relative w-full aspect-square flex items-center justify-center">
              <Image
                src={selectedImage}
                alt={product.productName}
                width={400}
                height={400}
                className="object-contain p-8 transition-opacity duration-200"
              />
            </div>
          </div>
        </div>

        {/* RIGHT — PRODUCT INFO */}
        <div className="flex flex-col space-y-6 lg:space-y-7">
          {/* Brand & Model */}
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
              {product.brand}
            </p>
            <h1 className="text-2xl md:text-4xl font-semibold leading-tight tracking-tight">
              {product.productName}
            </h1>
            {product.model && (
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                Model: {product.model}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-3 pb-6 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-baseline gap-3 flex-wrap">
              <p className="text-xl sm:text-2xl font-normal tracking-tight">
                €{discountedPrice.toLocaleString()}
              </p>

              {discount > 0 && (
                <>
                  <p className="text-sm sm:text-lg text-neutral-400 line-through dark:text-neutral-600">
                    €{price.toLocaleString()}
                  </p>
                  <Badge className="bg-indigo-600 hover:bg-indigo-600 text-white text-xs font-semibold px-2 py-0.5">
                    {discount}% OFF
                  </Badge>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-3">
              {outOfStock ? (
                <Badge className="bg-red-600 hover:bg-red-600 text-white text-xs font-medium px-2.5 py-1">
                  Out of Stock
                </Badge>
              ) : (
                <Badge className="bg-green-600 hover:bg-green-600 text-white text-xs font-medium px-2.5 py-1">
                  In Stock
                </Badge>
              )}

              {/* Stock Quantity */}
              {!outOfStock && (
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Quantity: {product.pricing?.stockQuantity}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart */}
          <div className="pt-2 ">
            {outOfStock ? (
              <Button
                disabled
                className="max-w-sm rounded-lg cursor-not-allowed bg-neutral-300 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-500"
              >
                Out of Stock
              </Button>
            ) : (
              <AddToCartButton productId={product.id} />
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-700 dark:text-neutral-300">
                Description
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-700 dark:text-neutral-300">
                Key Features
              </h3>
              <ul className="space-y-2">
                {product.features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400"
                  >
                    <span className="text-neutral-400 dark:text-neutral-600 mt-0.5">
                      •
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap pt-2">
              {product.tags.map((tag, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 text-xs font-normal px-3 py-1 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SPECIFICATIONS */}
      {product.specifications &&
        Object.keys(product.specifications).length > 0 && (
          <div className="mt-16 md:mt-20">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              Technical Specifications
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(product.specifications || {}).map(
                ([section, items]: any) => (
                  <div
                    key={section}
                    className="rounded-xl bg-neutral-50 dark:bg-neutral-900 p-6"
                  >
                    <h3 className="font-semibold text-base mb-4 capitalize text-neutral-900 dark:text-neutral-100">
                      {section.replace(/([A-Z])/g, " $1").trim()}
                    </h3>

                    <div className="space-y-0">
                      {Object.entries(items).map(([k, v], idx) => (
                        <div
                          key={k}
                          className={`flex justify-between py-3 text-sm ${
                            idx !== Object.entries(items).length - 1
                              ? "border-b border-neutral-200 dark:border-neutral-800"
                              : ""
                          }`}
                        >
                          <span className="font-medium text-neutral-600 dark:text-neutral-400 capitalize">
                            {k.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <span className="text-right text-neutral-900 dark:text-neutral-100 font-medium">
                            {Array.isArray(v) ? v.join(", ") : String(v)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

      {/* REVIEWS */}
      <div className="mt-16 md:mt-20">
        <ReviewPage productId={product.id} />
      </div>
    </div>
  );
}

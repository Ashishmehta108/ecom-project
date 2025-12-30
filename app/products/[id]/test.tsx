"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ReviewPage from "@/components/reviews/page";
import { Product } from "@/lib/types/product.types";
import AddToCartButton from "@/components/cart/addToCart";
import { authClient } from "@/lib/auth-client";
import { useLanguage } from "@/app/context/languageContext";
import {
  getTranslatedText,
  getTranslatedArray,
  resolveSpecValue
} from "@/lib/utils/language";

const FALLBACK_IMG = "https://via.placeholder.com/500x500.png?text=No+Image";

export default function ProductPage({ product }: { product: Product }) {
  const { locale } = useLanguage();
  const user = authClient.useSession();

  // Translation helpers
  const productName = useMemo(() => getTranslatedText(product.productName, locale), [product.productName, locale]);
  const subCategory = useMemo(() => getTranslatedText(product.subCategory, locale), [product.subCategory, locale]);
  const description = useMemo(() => getTranslatedText(product.description, locale), [product.description, locale]);
  const features = useMemo(() => getTranslatedArray(product.features, locale), [product.features, locale]);
  const tags = useMemo(() => getTranslatedArray(product.tags, locale), [product.tags, locale]);

  const resolvedSpecifications = useMemo(() => {
    if (!product.specifications) return null;
    const resolved: Record<string, Record<string, any>> = {};

    Object.entries(product.specifications).forEach(([section, items]) => {
      if (items && typeof items === "object" && !Array.isArray(items)) {
        resolved[section] = {};
        Object.entries(items).forEach(([key, value]) => {
          resolved[section][key] = resolveSpecValue(value, locale);
        });
      }
    });

    return resolved;
  }, [product.specifications, locale]);

  const outOfStock = !product.pricing?.stockQuantity;
  const images = product.productImages?.length
    ? product.productImages.map(i => i.url)
    : [FALLBACK_IMG];

  const [selectedImage, setSelectedImage] = useState(images[0]);
  const price = Number(product.pricing?.price ?? 0);
  const discount = Number(product.pricing?.discount ?? 0);

  const discountedPrice = discount > 0 ? price - (price * discount) / 100 : price;

  return (
    <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 py-6 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">

        {/* IMAGE GALLERY */}
        <div className="flex flex-col gap-3">
          {/* Main Image */}
          <div className="w-full bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={selectedImage}
                alt={productName}
                fill
                className="object-contain p-4"
              />
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {images.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(url)}
                  className={`relative w-16 h-16 rounded-md border transition
                    ${
                      selectedImage === url
                        ? "border-neutral-400 dark:border-neutral-100"
                        : "border-neutral-300 opacity-75 hover:opacity-100"
                    }`}
                >
                  <Image
                    src={url}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-contain p-1"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* PRODUCT INFORMATION */}
        <div className="flex flex-col gap-6">
          {/* Brand */}
          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
              {product.brand}
            </p>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-tight">
              {productName}
            </h1>
            {subCategory && (
              <p className="text-sm text-neutral-500">
                {locale === "pt" ? "Categoria" : "Category"}: {subCategory}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2 border-b pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xl font-semibold">
                €{discountedPrice.toFixed(2)}
              </p>

              {discount > 0 && (
                <>
                  <p className="text-sm line-through text-neutral-400">
                    €{price.toFixed(2)}
                  </p>
                  <Badge className="bg-indigo-600 text-white text-xs">
                    {discount}% OFF
                  </Badge>
                </>
              )}
            </div>

            <Badge
              className={`text-white text-xs px-3 py-0.5 ${
                outOfStock ? "bg-red-600" : "bg-green-600"
              }`}
            >
              {outOfStock
                ? locale === "pt"
                  ? "Fora de Estoque"
                  : "Out of Stock"
                : locale === "pt"
                  ? "Em Estoque"
                  : "In Stock"}
            </Badge>
          </div>

          {/* Add to Cart Button */}
          {!outOfStock ? (
            <AddToCartButton productId={product.id} />
          ) : (
            <Button disabled className="rounded-md bg-neutral-300 text-neutral-600">
              {locale === "pt" ? "Fora de Estoque" : "Out of Stock"}
            </Button>
          )}

          {/* Description */}
          {description && (
            <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <h3 className="font-semibold uppercase text-neutral-800 dark:text-neutral-200 text-xs">
                {locale === "pt" ? "Descrição" : "Description"}
              </h3>
              <p>{description}</p>
            </div>
          )}

          {/* Features */}
          {features?.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold uppercase text-neutral-800 dark:text-neutral-200 text-xs">
                {locale === "pt" ? "Características" : "Key Features"}
              </h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                {features.map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-neutral-400">•</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {tags?.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {tags.map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SPECIFICATIONS */}
      {resolvedSpecifications && (
        <div className="mt-12">
          <h2 className="text-lg md:text-xl font-semibold mb-4">
            {locale === "pt" ? "Especificações Técnicas" : "Technical Specifications"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(resolvedSpecifications).map(([section, items]) => (
              <div
                key={section}
                className="border rounded-lg p-4 bg-neutral-50 dark:bg-neutral-900"
              >
                <h3 className="font-semibold text-base mb-3 capitalize">
                  {section.replace(/([A-Z])/g, " $1")}
                </h3>
                <div className="space-y-2 text-sm">
                  {Object.entries(items).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-neutral-600">{key.replace(/([A-Z])/g, " $1")}</span>
                      <span className="font-medium text-neutral-900 dark:text-neutral-100">
                        {Array.isArray(value) ? value.join(", ") : value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REVIEWS */}
      <div className="mt-12">
        <ReviewPage productId={product.id} />
      </div>
    </div>
  );
}

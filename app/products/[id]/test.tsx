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
import { ProductImageZoom } from "@/components/products/ProductImageZoom";


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
    <div className="mx-auto  md:max-w-6xl w-full px-4 sm:px-4 lg:px-8 py-3 sm:py-6 md:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 lg:gap-10">

        {/* IMAGE GALLERY */}
        <div className="flex flex-col gap-2 sm:gap-3">
          {/* Main Image */}
          <div className="w-full max-w-[280px] sm:max-w-none mx-auto bg-white dark:bg-neutral-900 rounded-lg  overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={selectedImage}
                alt={productName}
                fill
                className="object-contain p-2 sm:p-4"
              />
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none max-w-[280px] sm:max-w-none mx-auto">
              {images.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(url)}
                  className={`relative w-10 h-10 sm:w-16 sm:h-16 rounded border transition flex-shrink-0
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
                    className="object-contain p-0.5 sm:p-1"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* PRODUCT INFORMATION */}
        <div className="flex flex-col gap-3 sm:gap-5">
          {/* Brand & Title */}
          <div className="space-y-1">
            <p className="text-[10px] sm:text-xs font-normal text-neutral-500 uppercase tracking-wide">
              {product.brand}
            </p>
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium leading-snug text-neutral-900 dark:text-neutral-100">
              {productName}
            </h1>
            {subCategory && (
              <p className="text-xs sm:text-sm text-neutral-500 pt-0.5">
                {locale === "pt" ? "Categoria" : "Category"}: {subCategory}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2 border-b border-neutral-200 dark:border-neutral-800 pb-3 sm:pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xl sm:text-2xl font-medium text-neutral-900 dark:text-neutral-100">
                €{discountedPrice.toFixed(2)}
              </p>

              {discount > 0 && (
                <>
                  <p className="text-sm sm:text-base line-through text-neutral-400">
                    €{price.toFixed(2)}
                  </p>
                  <Badge className="bg-indigo-600 text-white text-[10px] sm:text-xs font-normal px-2 py-0.5">
                    {discount}% OFF
                  </Badge>
                </>
              )}
            </div>

            <Badge
              className={`text-white text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 font-normal ${
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
            <Button disabled className="rounded-md bg-neutral-300 text-neutral-600 text-sm font-normal h-9 sm:h-10">
              {locale === "pt" ? "Fora de Estoque" : "Out of Stock"}
            </Button>
          )}

          {/* Description */}
          {description && (
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              <h3 className="font-normal uppercase text-neutral-700 dark:text-neutral-300 text-[10px] sm:text-xs tracking-wide">
                {locale === "pt" ? "Descrição" : "Description"}
              </h3>
              <p className="leading-relaxed">{description}</p>
            </div>
          )}

          {/* Features */}
          {features?.length > 0 && (
            <div className="space-y-1.5 sm:space-y-2">
              <h3 className="font-normal uppercase text-neutral-700 dark:text-neutral-300 text-[10px] sm:text-xs tracking-wide">
                {locale === "pt" ? "Características" : "Key Features"}
              </h3>
              <ul className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                {features.map((f, i) => (
                  <li key={i} className="flex gap-2 leading-relaxed">
                    <span className="text-neutral-400 flex-shrink-0">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {tags?.length > 0 && (
            <div className="flex gap-1.5 sm:gap-2 flex-wrap">
              {tags.map((tag, i) => (
                <Badge key={i} variant="outline" className="text-[10px] sm:text-xs font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SPECIFICATIONS */}
      {resolvedSpecifications && (
        <div className="mt-6 sm:mt-10 md:mt-12">
          <h2 className="text-base sm:text-lg md:text-xl font-medium mb-3 sm:mb-4 text-neutral-900 dark:text-neutral-100">
            {locale === "pt" ? "Especificações Técnicas" : "Technical Specifications"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            {Object.entries(resolvedSpecifications).map(([section, items]) => (
              <div
                key={section}
                className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 sm:p-4 bg-neutral-50 dark:bg-neutral-900"
              >
                <h3 className="font-normal text-xs sm:text-sm mb-2 sm:mb-3 capitalize text-neutral-800 dark:text-neutral-200">
                  {section.replace(/([A-Z])/g, " $1")}
                </h3>
                <div className="space-y-1.5 sm:space-y-2 text-[11px] sm:text-xs">
                  {Object.entries(items).map(([key, value]) => (
                    <div key={key} className="flex justify-between gap-2">
                      <span className="text-neutral-600 dark:text-neutral-400">
                        {key.replace(/([A-Z])/g, " $1")}
                      </span>
                      <span className="font-normal text-neutral-900 dark:text-neutral-100 text-right">
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
      <div className="mt-6 sm:mt-10 md:mt-12">
        <ReviewPage productId={product.id} />
      </div>
    </div>
  );
}
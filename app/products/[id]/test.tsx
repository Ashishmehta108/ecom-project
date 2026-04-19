"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
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
  resolveSpecValue,
} from "@/lib/utils/language";
import { ProductImageZoom } from "@/components/products/ProductImageZoom";

const FALLBACK_IMG = "https://via.placeholder.com/500x500.png?text=No+Image";

type VariantProduct = {
  id: string;
  productName: { en: string; pt: string } | string;
  variantLabel?: string | null;
  variantGroupId?: string | null;
  productImages?: { url: string }[];
};

export default function ProductPage({
  product,
  variants = [],
}: {
  product: Product;
  variants?: VariantProduct[];
}) {
  const { locale } = useLanguage();
  const user = authClient.useSession();

  // Translation helpers
  const productName = useMemo(
    () => getTranslatedText(product.productName, locale),
    [product.productName, locale]
  );
  const subCategory = useMemo(
    () => getTranslatedText(product.subCategory, locale),
    [product.subCategory, locale]
  );
  const description = useMemo(
    () => getTranslatedText(product.description, locale),
    [product.description, locale]
  );
  const features = useMemo(
    () => getTranslatedArray(product.features, locale),
    [product.features, locale]
  );
  const tags = useMemo(
    () => getTranslatedArray(product.tags, locale),
    [product.tags, locale]
  );

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
    ? product.productImages.map((i) => i.url)
    : [FALLBACK_IMG];

  const [selectedImage, setSelectedImage] = useState(images[0]);
  const price = Number(product.pricing?.price ?? 0);
  const discount = Number(product.pricing?.discount ?? 0);
  const discountedPrice = discount > 0 ? price - (price * discount) / 100 : price;

  // Build full variant list: current product + sibling variants
  const currentVariant: VariantProduct = {
    id: product.id,
    productName: product.productName,
    variantLabel: (product as any).variantLabel,
    variantGroupId: (product as any).variantGroupId,
    productImages: product.productImages,
  };
  const allVariants: VariantProduct[] = (product as any).variantGroupId
    ? [currentVariant, ...variants]
    : [];

  const getVariantLabel = (v: VariantProduct) =>
    v.variantLabel ||
    (typeof v.productName === "string"
      ? v.productName
      : (v.productName as any)?.en || "Variant");

  // Maps common color names → actual CSS colors
  // Falls back to a stable hsl hue for non-color labels (e.g. "128GB", "Pro")
  const COLOR_MAP: Record<string, string> = {
    black: "#1a1a1a",
    white: "#f0f0f0",
    grey: "#9ca3af",
    gray: "#9ca3af",
    silver: "#c0c0c0",
    red: "#ef4444",
    blue: "#3b82f6",
    navy: "#1e3a5f",
    green: "#22c55e",
    yellow: "#eab308",
    gold: "#d97706",
    orange: "#f97316",
    pink: "#ec4899",
    purple: "#a855f7",
    violet: "#7c3aed",
    brown: "#92400e",
    beige: "#d4b483",
    cream: "#fffdd0",
    rose: "#fb7185",
    teal: "#14b8a6",
    cyan: "#06b6d4",
    indigo: "#6366f1",
    coral: "#f4845f",
    maroon: "#800000",
    olive: "#808000",
    tan: "#d2b48c",
    lavender: "#e6d5f5",
    mint: "#98ff98",
    champagne: "#f7e7ce",
    charcoal: "#36454f",
    slate: "#64748b",
    titanium: "#878681",
    midnight: "#121063",
    "space gray": "#6e6e73",
    "rose gold": "#b76e79",
    "sky blue": "#87ceeb",
    "forest green": "#228b22",
    "deep purple": "#4b0082",
  };

  const resolveVariantColor = (label: string): string => {
    const key = label.trim().toLowerCase();
    if (COLOR_MAP[key]) return COLOR_MAP[key];
    // Fallback: stable hsl from character codes
    const hue = label.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
    return `hsl(${hue}, 58%, 50%)`;
  };

  return (
    <div className="mx-auto md:max-w-6xl w-full px-4 sm:px-4 lg:px-8 py-3 sm:py-6 md:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 lg:gap-10">
        {/* IMAGE GALLERY */}
        <div className="flex flex-col gap-2 sm:gap-3">
          {/* Main Image */}
          <div className="w-full max-w-[280px] sm:max-w-none mx-auto bg-white dark:bg-neutral-900 rounded-lg overflow-hidden">
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
                  className={`relative w-10 h-10 sm:w-16 sm:h-16 rounded border transition flex-shrink-0 ${selectedImage === url
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

          {/* ── VARIANT SWATCHES ── */}
          {allVariants.length > 1 && (
            <div className="space-y-2.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                  {locale === "pt" ? "Cor" : "Color"}:
                </span>
                <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {getVariantLabel(allVariants.find((v) => v.id === product.id)!)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {allVariants.map((v) => {
                  const isCurrent = v.id === product.id;
                  const label = getVariantLabel(v);
                  const color = resolveVariantColor(label);
                  const LIGHT = ["#f0f0f0","#fffdd0","#e6d5f5","#98ff98","#f7e7ce","#87ceeb","#c0c0c0"];
                  const DARK  = ["#1a1a1a","#121063","#1e3a5f","#800000","#92400e","#36454f"];
                  const innerRing = LIGHT.includes(color)
                    ? "ring-1 ring-inset ring-neutral-300 dark:ring-neutral-500"
                    : DARK.includes(color)
                    ? "ring-1 ring-inset ring-white/20"
                    : "";

                  if (isCurrent) {
                    return (
                      <div
                        key={v.id}
                        title={label}
                        className="cursor-default rounded-full p-1"
                        style={{
                          outline: `2px solid ${color}`,
                          outlineOffset: "1px",
                        }}
                      >
                        <span
                          className={`block w-7 h-7 rounded-full ${innerRing}`}
                          style={{ background: color }}
                        />
                      </div>
                    );
                  }

                  return (
                    <Link key={v.id} href={`/products/${v.id}`} title={label}>
                      <span
                        className={`block w-7 h-7 rounded-full transition-all duration-200 cursor-pointer hover:scale-110 hover:ring-2 hover:ring-offset-2 hover:ring-neutral-400 dark:hover:ring-neutral-500 hover:ring-offset-white dark:hover:ring-offset-neutral-950 ${innerRing}`}
                        style={{ background: color }}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}


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
              className={`text-white text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 font-normal ${outOfStock ? "bg-red-600" : "bg-green-600"
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
            <Button
              disabled
              className="rounded-md bg-neutral-300 text-neutral-600 text-sm font-normal h-9 sm:h-10"
            >
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
                <Badge
                  key={i}
                  variant="outline"
                  className="text-[10px] sm:text-xs font-normal"
                >
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
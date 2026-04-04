"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { addItemToCart } from "@/lib/actions/cart-actions";
import { toast } from "sonner";
import { isInCart } from "@/lib/helper/cart/cart.helper";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { useLanguage } from "@/app/context/languageContext";
import { getTranslatedText, getTranslatedArray } from "@/lib/utils/language";
import { ShoppingCart, Check, Package, LogIn } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import LoginForm from "../LoginForm";

// ─── Types ────────────────────────────────────────────────────────────────────

type BilingualText = { en: string; pt: string };
type BilingualArray = { en: string[]; pt: string[] };

interface ProductPricing {
  price: number;
  currency: string;
  discount: number;
  inStock: boolean;
  stockQuantity: number;
}

interface ProductImage {
  url: string;
  position: string;
}

interface Product {
  id: string;
  productName: BilingualText;
  brand: string;
  model: string;
  subCategory: BilingualText;
  description: BilingualText;
  features: BilingualArray;
  pricing: ProductPricing;
  specifications: {
    general?: Record<string, BilingualText>;
    technical?: Record<string, BilingualText>;
    [key: string]: unknown;
  };
  tags: BilingualArray;
  productImages?: ProductImage[];
  createdAt: Date;
  updatedAt: Date;
}

type Locale = "en" | "pt";

type ProductCardProps = {
  product: Product;
  userId: string;
  listView?: boolean;
  view?: "grid" | "list";
  admin?: boolean;
};

// ─── Price display ────────────────────────────────────────────────────────────

function PriceDisplay({
  displayPrice,
  originalPrice,
  discount,
  formatPrice,
}: {
  displayPrice: number;
  originalPrice: number;
  discount: number;
  formatPrice: (n: number) => string;
}) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 tabular-nums">
        €{formatPrice(displayPrice)}
      </span>
      {discount > 0 && (
        <span className="text-[11px] text-neutral-400 dark:text-neutral-600 line-through tabular-nums">
          €{formatPrice(originalPrice)}
        </span>
      )}
    </div>
  );
}

// ─── Cart CTA ─────────────────────────────────────────────────────────────────

function CartCTA({
  inCart,
  outOfStock,
  adding,
  locale,
  onClick,
}: {
  inCart: boolean;
  outOfStock: boolean;
  adding: boolean;
  locale: Locale;
  onClick: () => void;
}) {
  const pt = locale === "pt";

  if (inCart) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-2.5 py-1.5 text-[11px] font-medium text-neutral-500 dark:text-neutral-400 select-none">
        <Check size={10} strokeWidth={2.5} className="text-neutral-400 dark:text-neutral-500" />
        {pt ? "No Carrinho" : "In Cart"}
      </span>
    );
  }

  return (
    <button
      disabled={outOfStock || adding}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-3 cursor-pointer py-1.5 text-[12px] font-medium transition-all duration-150 active:scale-[0.97]",
        outOfStock
          ? "cursor-not-allowed bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 border border-neutral-200 dark:border-neutral-700"
          : "bg-neutral-900 text-neutral-50 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
      )}
    >
      {!outOfStock && !adding && <ShoppingCart size={10} strokeWidth={2} />}
      {outOfStock
        ? pt ? "Indisponível" : "Unavailable"
        : adding
        ? "..."
        : pt ? "Adicionar" : "Add"}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ProductCard({ product, userId, listView, view }: ProductCardProps) {
  const { locale } = useLanguage() as { locale: Locale };
  const [loginOpen, setLoginOpen] = useState(false);
  const [cartPopupOpen, setCartPopupOpen] = useState(false);
  const [adding, setAdding] = useState(false);

  const isListView = listView || view === "list";
  const pt = locale === "pt";

  const productName = useMemo(
    () => getTranslatedText(product.productName, locale),
    [product.productName, locale]
  );

  const subCategory = useMemo(
    () => getTranslatedText(product.subCategory, locale),
    [product.subCategory, locale]
  );

  const features = useMemo(
    () => getTranslatedArray(product.features, locale),
    [product.features, locale]
  );

  const mainImage = product.productImages?.find((img) => img.position === "0");

  const pathname = usePathname();
  const user = authClient.useSession();
  const isLoggedIn = !!user.data?.user;
  const isAdmin = user.data?.user?.role === "admin";
  const adminViewOnly = isAdmin && pathname.startsWith("/admin/products");
  const productLink = adminViewOnly ? `/admin/products/${product.id}` : `/products/${product.id}`;

  const { stockQuantity, discount, price } = product.pricing;
  const outOfStock = stockQuantity <= 0;
  const inCart = isInCart(product.id);
  const discountedPrice = discount > 0 ? price - (price * discount) / 100 : null;
  const displayPrice = discountedPrice ?? price;

  const formatPrice = (n: number) =>
    n.toLocaleString(pt ? "pt-PT" : "en-US", { minimumFractionDigits: 2 });

  const handleAddToCart = async () => {
    if (!isLoggedIn) { setLoginOpen(true); return; }
    setAdding(true);
    const data = await addItemToCart(userId, product.id, 1);
    setAdding(false);
    if (data.success) {
      toast.success(pt ? "Produto adicionado ao carrinho" : "Product added to cart");
      setCartPopupOpen(true);
    }
  };

  const ctaProps = { inCart, outOfStock, adding, locale, onClick: handleAddToCart };
  const priceProps = { displayPrice, originalPrice: price, discount, formatPrice };

  return (
    <>
      {/* ── Login dialog ──────────────────────────────────────── */}
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              <LogIn size={14} className="text-neutral-500 dark:text-neutral-400" />
              {pt ? "Login Necessário" : "Login Required"}
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500">
              {pt
                ? "Faça login para adicionar produtos ao carrinho."
                : "Please log in to add products to your cart."}
            </DialogDescription>
          </DialogHeader>
          <LoginForm />
        </DialogContent>
      </Dialog>

      {/* ── Cart dialog ───────────────────────────────────────── */}
      <Dialog open={cartPopupOpen} onOpenChange={setCartPopupOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              <Check size={14} className="text-neutral-500" />
              {pt ? "Adicionado ao Carrinho" : "Added to Cart"}
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500">
              {pt
                ? `${productName} foi adicionado ao seu carrinho.`
                : `${productName} has been added to your cart.`}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              className="flex-1 h-8 rounded-md border-neutral-200 dark:border-neutral-700 text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              onClick={() => setCartPopupOpen(false)}
            >
              {pt ? "Continuar" : "Keep Shopping"}
            </Button>
            <Link href="/cart" className="flex-1">
              <Button className="w-full h-8 rounded-md bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 text-xs">
                {pt ? "Ver Carrinho" : "View Cart"}
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── List view ─────────────────────────────────────────── */}
      {isListView ? (
        <article className="group flex gap-3 rounded-lg border border-neutral-150 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 p-3 transition-all duration-150 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-[0_1px_4px_0_rgb(0,0,0,0.06)] dark:hover:shadow-none">
          {/* Thumbnail */}
          <Link
            href={productLink}
            className="relative flex-shrink-0 h-[72px] w-[72px] sm:h-20 sm:w-20 rounded-md overflow-hidden border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/60"
          >
            {outOfStock && !adminViewOnly && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 dark:bg-black/50">
                <span className="text-[9px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                  {pt ? "Esgotado" : "Sold out"}
                </span>
              </div>
            )}
            <Image
              src={mainImage?.url || "/placeholder.jpg"}
              alt={productName}
              fill
              className="object-contain p-2.5 transition-transform duration-300 group-hover:scale-[1.03] mix-blend-multiply dark:mix-blend-normal"
            />
          </Link>

          {/* Body */}
          <div className="flex flex-1 flex-col min-w-0 py-0.5">
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-400 dark:text-neutral-600 truncate">
              {subCategory}
            </p>
            <Link href={productLink}>
              <h3 className="mt-0.5 text-sm font-medium text-neutral-800 dark:text-neutral-200 line-clamp-1 hover:text-neutral-600 dark:hover:text-neutral-100 transition-colors">
                {productName}
              </h3>
            </Link>
            {features.length > 0 && (
              <p className="mt-0.5 text-[11px] text-neutral-400 dark:text-neutral-600 line-clamp-1 truncate">
                {features.slice(0, 2).join(" · ")}
              </p>
            )}
            <div className="mt-auto pt-2 flex items-center justify-between gap-2">
              <PriceDisplay {...priceProps} />
              {!adminViewOnly && <CartCTA {...ctaProps} />}
            </div>
          </div>
        </article>

      ) : (
        /* ── Grid view ────────────────────────────────────────── */
        <article
          className={cn(
            "group relative flex flex-col h-full  rounded-xl border border-neutral-150 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 overflow-hidden transition-all duration-200 hover:border-neutral-250 dark:hover:border-neutral-700 hover:shadow-[0_2px_12px_0_rgb(0,0,0,0.07)] dark:hover:shadow-none",
            outOfStock && !adminViewOnly && "opacity-60"
          )}
        >
          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-start justify-between pointer-events-none">
            {discount > 0 ? (
              <span className="rounded-md bg-neutral-900 dark:bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-neutral-50 dark:text-neutral-900">
                -{discount}%
              </span>
            ) : <span />}
            {outOfStock && !adminViewOnly && (
              <span className="rounded-md border border-neutral-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-800/90 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-neutral-500 dark:text-neutral-400">
                {pt ? "Esgotado" : "Sold out"}
              </span>
            )}
          </div>

          {/* Image */}
          <Link
            href={productLink}
            className="relative aspect-square w-full overflow-hidden bg-neutral-50 dark:bg-neutral-800/50"
          >
            <Image
              src={mainImage?.url || "/placeholder.jpg"}
              alt={productName}
              fill
              className="object-contain p-5 sm:p-6 transition-transform duration-300 group-hover:scale-[1.04] mix-blend-multiply dark:mix-blend-normal"
            />
          </Link>

          {/* Divider */}
          <div className="h-px bg-neutral-100 dark:bg-neutral-800" />

          {/* Content */}
          <div className="flex flex-col flex-1 p-3.5 sm:p-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-400 dark:text-neutral-600 truncate">
              {subCategory}
            </p>

            <Link href={productLink}>
              <h3 className="mt-1 text-sm font-medium leading-snug text-neutral-800 dark:text-neutral-200 line-clamp-2 hover:text-neutral-600 dark:hover:text-neutral-100 transition-colors">
                {productName}
              </h3>
            </Link>

            {!adminViewOnly && features.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {features.slice(0, 2).map((f, i) => (
                  <span
                    key={i}
                    className="rounded-md border border-neutral-150 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/60 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500 dark:text-neutral-500"
                  >
                    {f}
                  </span>
                ))}
              </div>
            )}

            {adminViewOnly && (
              <div className="mt-2 flex items-center gap-1.5">
                <Package size={11} className={outOfStock ? "text-neutral-400" : "text-neutral-400"} />
                <span className={cn("text-xs text-neutral-500 dark:text-neutral-500")}>
                  {pt ? "Estoque" : "Stock"}:{" "}
                  <span className={cn(
                    "font-semibold",
                    outOfStock
                      ? "text-neutral-400 dark:text-neutral-600"
                      : "text-neutral-800 dark:text-neutral-200"
                  )}>
                    {stockQuantity}
                  </span>
                </span>
              </div>
            )}

            <div className="flex-1" />

            {/* Price + CTA */}
            <div className="mt-3 flex items-end justify-between gap-2">
              <PriceDisplay {...priceProps} />
              {!adminViewOnly && <CartCTA {...ctaProps} />}
            </div>
          </div>
        </article>
      )}
    </>
  );
}
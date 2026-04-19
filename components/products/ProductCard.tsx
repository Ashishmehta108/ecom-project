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
import { deleteProductAction } from "@/lib/actions/admin-actions/prods";
import { Trash } from "iconsax-reactjs";

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
  variantGroupId?: string | null;
  variantLabel?: string | null;
}

type Locale = "en" | "pt";

type ProductCardProps = {
  product: Product;
  userId: string;
  listView?: boolean;
  view?: "grid" | "list";
  admin?: boolean;
  allProducts?: Product[];
};

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
        <Check
          size={10}
          strokeWidth={2.5}
          className="text-neutral-400 dark:text-neutral-500"
        />
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
          : "bg-neutral-900 text-neutral-50 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200",
      )}
    >
      {!outOfStock && !adding && <ShoppingCart size={10} strokeWidth={2} />}
      {outOfStock
        ? pt
          ? "Indisponível"
          : "Unavailable"
        : adding
          ? "..."
          : pt
            ? "Adicionar"
            : "Add"}
    </button>
  );
}

// Compact variant color swatches for product cards
const CARD_COLOR_MAP: Record<string, string> = {
  black: "#1a1a1a", white: "#f0f0f0", grey: "#9ca3af", gray: "#9ca3af",
  silver: "#c0c0c0", red: "#ef4444", blue: "#3b82f6", navy: "#1e3a5f",
  green: "#22c55e", yellow: "#eab308", gold: "#d97706", orange: "#f97316",
  pink: "#ec4899", purple: "#a855f7", violet: "#7c3aed", brown: "#92400e",
  beige: "#d4b483", cream: "#fffdd0", rose: "#fb7185", teal: "#14b8a6",
  cyan: "#06b6d4", indigo: "#6366f1", coral: "#f4845f", maroon: "#800000",
  charcoal: "#36454f", slate: "#64748b", titanium: "#878681", midnight: "#121063",
  "space gray": "#6e6e73", "rose gold": "#b76e79", "sky blue": "#87ceeb",
};

function resolveCardColor(label: string): string {
  const key = label.trim().toLowerCase();
  if (CARD_COLOR_MAP[key]) return CARD_COLOR_MAP[key];
  const hue = label.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  return `hsl(${hue}, 58%, 50%)`;
}

function VariantDots({
  product,
  allProducts,
}: {
  product: Product;
  allProducts: Product[];
}) {
  if (!product.variantGroupId) return null;

  const siblings = allProducts.filter(
    (p) => p.variantGroupId === product.variantGroupId
  );

  if (siblings.length <= 1) return null;

  const LIGHT_COLORS = ["#f0f0f0", "#fffdd0", "#87ceeb", "#e6d5f5", "#98ff98", "#f7e7ce"];
  const DARK_COLORS = ["#1a1a1a", "#121063", "#1e3a5f", "#800000", "#92400e", "#36454f"];
  const MAX_SHOW = 5;
  const shown = siblings.slice(0, MAX_SHOW);
  const extra = siblings.length - MAX_SHOW;

  return (
    <div className="flex items-center gap-1.5">
      {shown.map((v) => {
        const isCurrent = v.id === product.id;
        const label =
          v.variantLabel ||
          (typeof v.productName === "string"
            ? v.productName
            : (v.productName as any)?.en || "Variant");
        const color = resolveCardColor(label);
        const borderClass = LIGHT_COLORS.includes(color)
          ? "ring-1 ring-inset ring-neutral-300 dark:ring-neutral-600"
          : DARK_COLORS.includes(color)
            ? "ring-1 ring-inset ring-neutral-600 dark:ring-white/25"
            : "";

        if (isCurrent) {
          return (
            <span
              key={v.id}
              title={label}
              className={`block w-3.5 h-3.5 rounded-full ring-1 ring-offset-1 ring-neutral-600 dark:ring-neutral-400 ring-offset-white dark:ring-offset-neutral-900 flex-shrink-0 ${borderClass}`}
              style={{ background: color }}
            />
          );
        }
        return (
          <Link
            key={v.id}
            href={`/products/${v.id}`}
            onClick={(e) => e.stopPropagation()}
            title={label}
          >
            <span
              className={`block w-3.5 h-3.5 rounded-full opacity-70 hover:opacity-100 hover:scale-110 hover:ring-1 hover:ring-neutral-400 dark:hover:ring-neutral-500 hover:ring-offset-1 hover:ring-offset-white dark:hover:ring-offset-neutral-900 transition-all duration-150 flex-shrink-0 cursor-pointer ${borderClass}`}
              style={{ background: color }}
            />
          </Link>
        );
      })}
      {extra > 0 && (
        <span className="text-[10px] text-neutral-400 dark:text-neutral-600 leading-none">
          +{extra}
        </span>
      )}
    </div>
  );
}

export function ProductCard({
  product,
  userId,
  listView,
  view,
  allProducts = [],
}: ProductCardProps) {
  const { locale } = useLanguage() as { locale: Locale };
  const [loginOpen, setLoginOpen] = useState(false);
  const [cartPopupOpen, setCartPopupOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isListView = listView || view === "list";
  const pt = locale === "pt";

  const productName = useMemo(
    () => getTranslatedText(product.productName, locale),
    [product.productName, locale],
  );

  const subCategory = useMemo(
    () => getTranslatedText(product.subCategory, locale),
    [product.subCategory, locale],
  );

  const features = useMemo(
    () => getTranslatedArray(product.features, locale),
    [product.features, locale],
  );

  const mainImage = product.productImages?.find((img) => img.position === "0");

  const pathname = usePathname();
  const user = authClient.useSession();
  const isLoggedIn = !!user.data?.user;
  const isAdmin = user.data?.user?.role === "admin";
  const adminViewOnly = isAdmin && pathname.startsWith("/admin/products");
  const productLink = adminViewOnly
    ? `/admin/products/${product.id}`
    : `/products/${product.id}`;

  const { stockQuantity, discount, price } = product.pricing;
  const outOfStock = stockQuantity <= 0;
  const inCart = isInCart(product.id);
  const discountedPrice =
    discount > 0 ? price - (price * discount) / 100 : null;
  const displayPrice = discountedPrice ?? price;

  const deleteProduct = async () => {
    if (!deletingId) return;
    const prod = await deleteProductAction(deletingId);
    if (prod.success) {
      toast.success(pt ? "Produto excluído" : "Product deleted");
    } else {
      toast.error(pt ? "Erro ao excluir produto" : "Error deleting product");
    }
    setDeleteConfirmOpen(false);
    setDeletingId(null);
  };

  const formatPrice = (n: number) =>
    n.toLocaleString(pt ? "pt-PT" : "en-US", { minimumFractionDigits: 2 });

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      setLoginOpen(true);
      return;
    }
    setAdding(true);
    const data = await addItemToCart(userId, product.id, 1);
    setAdding(false);
    if (data.success) {
      toast.success(
        pt ? "Produto adicionado ao carrinho" : "Product added to cart",
      );
      setCartPopupOpen(true);
    }
  };

  const ctaProps = {
    inCart,
    outOfStock,
    adding,
    locale,
    onClick: handleAddToCart,
  };
  const priceProps = {
    displayPrice,
    originalPrice: price,
    discount,
    formatPrice,
  };

  return (
    <>
      {/* Login Modal */}
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              <LogIn
                size={14}
                className="text-neutral-500 dark:text-neutral-400"
              />
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

      {/* Cart Popup Modal */}
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

      {/* Delete Confirm Modal */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              <Trash size={14} color="currentColor" className="text-red-500" />
              {pt ? "Excluir Produto" : "Delete Product"}
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500">
              {pt
                ? "Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
                : "Are you sure you want to delete this product? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              className="flex-1 h-8 rounded-md border-neutral-200 dark:border-neutral-700 text-xs"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              {pt ? "Cancelar" : "Cancel"}
            </Button>
            <Button
              className="flex-1 h-8 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs"
              onClick={deleteProduct}
            >
              {pt ? "Excluir" : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {isListView ? (
        <article className="group relative flex gap-3 rounded-lg border border-neutral-150 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 p-3 transition-all duration-150 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-[0_1px_4px_0_rgb(0,0,0,0.06)] dark:hover:shadow-none cursor-pointer">
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

          {/* Delete button — list view */}
          {adminViewOnly && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDeletingId(product.id);
                setDeleteConfirmOpen(true);
              }}
              className="absolute top-1/2 -translate-y-1/2 right-3 z-20 rounded-md p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
            >
              <Trash size={14} color="currentColor" />
            </button>
          )}
        </article>
      ) : (
        <article
          className={cn(
            "group relative flex flex-col h-full rounded-xl border border-neutral-150 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 overflow-hidden transition-all duration-200 hover:border-neutral-250 dark:hover:border-neutral-700 hover:shadow-[0_2px_12px_0_rgb(0,0,0,0.07)] dark:hover:shadow-none cursor-pointer",
            outOfStock && !adminViewOnly && "opacity-60",
          )}
        >
          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-start justify-between pointer-events-none">
            {discount > 0 ? (
              <span className="rounded-md bg-neutral-900 dark:bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-neutral-50 dark:text-neutral-900">
                -{discount}%
              </span>
            ) : (
              <span />
            )}
            {outOfStock && !adminViewOnly && (
              <span className="rounded-md border border-neutral-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-800/90 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-neutral-500 dark:text-neutral-400">
                {pt ? "Esgotado" : "Sold out"}
              </span>
            )}
          </div>

          {/* Delete button — grid view */}
          {adminViewOnly && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDeletingId(product.id);
                setDeleteConfirmOpen(true);
              }}
              className="absolute top-2.5 right-2.5 z-20 rounded-md p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
            >
              <Trash size={14} color="currentColor" />
            </button>
          )}

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

            {/* Variant dots */}
            {!adminViewOnly && (
              <div className="mt-2">
                <VariantDots product={product} allProducts={allProducts} />
              </div>
            )}

            {adminViewOnly && (
              <div className="mt-2 flex items-center gap-1.5">
                <Package size={11} className="text-neutral-400" />
                <span
                  className={cn(
                    "text-xs text-neutral-500 dark:text-neutral-500",
                  )}
                >
                  {pt ? "Estoque" : "Stock"}:{" "}
                  <span
                    className={cn(
                      "font-semibold",
                      outOfStock
                        ? "text-neutral-400 dark:text-neutral-600"
                        : "text-neutral-800 dark:text-neutral-200",
                    )}
                  >
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

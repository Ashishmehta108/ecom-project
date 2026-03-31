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
import { ShoppingCart, Check, Package } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import LoginForm from "../LoginForm";

type ProductCardProps = {
  product: any;
  userId: string;
  listView?: boolean;
  view?: "grid" | "list";
  admin?: boolean;
};

export function ProductCard({ product, userId, listView, view, admin }: ProductCardProps) {
  const { locale } = useLanguage();
  const [loginOpen, setLoginOpen] = useState(false);
  const [cartPopupOpen, setCartPopupOpen] = useState(false);
  const [adding, setAdding] = useState(false);

  const isListView = listView || view === "list";

  const productName = useMemo(() => {
    if (typeof product.productName === "string") return product.productName;
    return getTranslatedText(product.productName, locale);
  }, [product.productName, locale]);

  const subCategory = useMemo(() => {
    if (typeof product.subCategory === "string") return product.subCategory;
    return getTranslatedText(product.subCategory, locale);
  }, [product.subCategory, locale]);

  const features = useMemo(() => {
    if (Array.isArray(product.features) && product.features.length > 0) {
      if (typeof product.features[0] === "string") return product.features;
    }
    return getTranslatedArray(product.features, locale);
  }, [product.features, locale]);

  const mainImage = product.productImages?.find(
    (img: any) => img.position === "0"
  );

  const pathname = usePathname();
  const user = authClient.useSession();
  const isLoggedIn = !!user.data?.user;
  const isAdmin = user.data?.user?.role === "admin";
  const isInsideAdminProducts = pathname.startsWith("/admin/products");
  const adminViewOnly = isAdmin && isInsideAdminProducts;

  const productLink = adminViewOnly
    ? `/admin/products/${product.id}`
    : `/products/${product.id}`;

  const stockQty =
    product.pricing?.stockQuantity !== undefined ? product.pricing.stockQuantity : 0;
  const outOfStock = stockQty <= 0;
  const inCart = isInCart(product.id);

  const discountedPrice =
    product.pricing?.discount > 0
      ? product.pricing.price - (product.pricing.price * product.pricing.discount) / 100
      : null;

  const displayPrice = discountedPrice ?? product.pricing?.price ?? 0;
  const formatPrice = (n: number) =>
    n.toLocaleString(locale === "pt" ? "pt-PT" : "en-US", { minimumFractionDigits: 2 });

  const handleAddToCart = async () => {
    if (!isLoggedIn) { setLoginOpen(true); return; }
    setAdding(true);
    const data = await addItemToCart(userId, product.id, 1);
    setAdding(false);
    if (data.success) {
      toast.success(locale === "pt" ? "Produto adicionado ao carrinho" : "Product added to cart");
      setCartPopupOpen(true);
    }
  };

  return (
    <>
      {/* LOGIN DIALOG */}
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{locale === "pt" ? "Login Necessário" : "Login Required"}</DialogTitle>
            <DialogDescription>
              {locale === "pt"
                ? "Faça login para adicionar produtos ao carrinho."
                : "Please login to add products to your cart."}
            </DialogDescription>
          </DialogHeader>
          <LoginForm />
        </DialogContent>
      </Dialog>

      {/* CART DIALOG */}
      <Dialog open={cartPopupOpen} onOpenChange={setCartPopupOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{locale === "pt" ? "Adicionado ao Carrinho" : "Added to Cart"}</DialogTitle>
            <DialogDescription>
              {locale === "pt"
                ? `${productName} foi adicionado ao seu carrinho.`
                : `${productName} was added to your cart.`}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 mt-4">
            <Button variant="outline" className="w-full" onClick={() => setCartPopupOpen(false)}>
              {locale === "pt" ? "Continuar" : "Continue Shopping"}
            </Button>
            <Link href="/cart" className="w-full">
              <Button className="w-full">{locale === "pt" ? "Ver Carrinho" : "View Cart"}</Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── LIST VIEW ─────────────────────────────────────────── */}
      {isListView ? (
        <article className="group relative flex gap-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3.5 transition-all duration-200 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-sm">
          {/* Image */}
          <Link
            href={productLink}
            className="relative flex-shrink-0 h-24 w-24 rounded-lg overflow-hidden bg-neutral-50 dark:bg-neutral-800"
          >
            {outOfStock && !adminViewOnly && (
              <span className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 dark:bg-black/50 backdrop-blur-[2px]">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-red-500">
                  {locale === "pt" ? "Esgotado" : "Out of stock"}
                </span>
              </span>
            )}
            <Image
              src={mainImage?.url || "/placeholder.jpg"}
              alt={productName}
              fill
              className="object-contain p-2 transition-transform duration-300 group-hover:scale-105 mix-blend-multiply dark:mix-blend-normal"
            />
          </Link>

          {/* Info */}
          <div className="flex flex-1 flex-col min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              {subCategory}
            </p>
            <Link href={productLink}>
              <h3 className="mt-0.5 text-sm font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                {productName}
              </h3>
            </Link>
            {features?.length > 0 && (
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                {features.slice(0, 2).join(" · ")}
              </p>
            )}

            <div className="mt-auto pt-2 flex items-center justify-between gap-3">
              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  €{formatPrice(displayPrice)}
                </span>
                {discountedPrice && (
                  <>
                    <span className="text-xs text-neutral-400 line-through">
                      €{formatPrice(product.pricing.price)}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded-full">
                      -{product.pricing.discount}%
                    </span>
                  </>
                )}
              </div>

              {/* Cart button */}
              {!adminViewOnly && (
                inCart ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                    <Check size={11} />
                    {locale === "pt" ? "No Carrinho" : "In Cart"}
                  </span>
                ) : (
                  <Button
                    size="sm"
                    disabled={outOfStock || adding}
                    onClick={handleAddToCart}
                    className={cn(
                      "h-8 rounded-full px-4 text-xs font-medium",
                      outOfStock
                        ? "bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600 cursor-not-allowed"
                        : "bg-neutral-900 text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
                    )}
                  >
                    {outOfStock
                      ? locale === "pt" ? "Indisponível" : "Unavailable"
                      : locale === "pt" ? "Adicionar" : "Add to Cart"}
                  </Button>
                )
              )}
            </div>
          </div>
        </article>
      ) : (
        /* ── GRID VIEW ────────────────────────────────────────── */
        <article
          className={cn(
            "group relative flex flex-col rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-neutral-200/60 dark:hover:shadow-neutral-900 hover:-translate-y-0.5",
            outOfStock && !adminViewOnly && "opacity-80"
          )}
        >
          {/* Discount badge */}
          {product.pricing?.discount > 0 && (
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-block rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                -{product.pricing.discount}%
              </span>
            </div>
          )}

          {/* Out of stock badge */}
          {outOfStock && !adminViewOnly && (
            <div className="absolute top-3 right-3 z-10">
              <span className="inline-block rounded-full bg-red-100 dark:bg-red-950 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
                {locale === "pt" ? "Esgotado" : "Out of stock"}
              </span>
            </div>
          )}

          {/* Image */}
          <Link
            href={productLink}
            className="relative aspect-square w-full overflow-hidden bg-neutral-50 dark:bg-neutral-800"
          >
            <Image
              src={mainImage?.url || "/placeholder.jpg"}
              alt={productName}
              fill
              className="object-contain p-5 transition-transform duration-500 group-hover:scale-108 mix-blend-multiply dark:mix-blend-normal"
            />
          </Link>

          {/* Divider */}
          <div className="h-px bg-neutral-100 dark:bg-neutral-800" />

          {/* Content */}
          <div className="flex flex-col flex-1 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              {subCategory}
            </p>

            <Link href={productLink}>
              <h3 className="mt-1.5 text-sm font-semibold leading-snug text-neutral-900 dark:text-neutral-100 line-clamp-2 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                {productName}
              </h3>
            </Link>

            {!adminViewOnly && features?.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {features.slice(0, 2).map((f: string, i: number) => (
                  <span
                    key={i}
                    className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-[10px] font-medium text-neutral-600 dark:text-neutral-400"
                  >
                    {f}
                  </span>
                ))}
              </div>
            )}

            <div className="flex-1" />

            {/* Admin stock */}
            {adminViewOnly && (
              <div className="mt-3 flex items-center gap-1.5">
                <Package size={12} className={outOfStock ? "text-red-500" : "text-neutral-400"} />
                <span className={cn("text-xs font-medium", outOfStock ? "text-red-500 dark:text-red-400" : "text-neutral-500 dark:text-neutral-400")}>
                  {locale === "pt" ? "Estoque" : "Stock"}:{" "}
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">{stockQty}</span>
                </span>
              </div>
            )}

            {/* Price + CTA */}
            <div className="mt-3 flex items-end justify-between gap-2">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                    €{formatPrice(displayPrice)}
                  </span>
                  {discountedPrice && (
                    <span className="text-xs text-neutral-400 line-through">
                      €{formatPrice(product.pricing.price)}
                    </span>
                  )}
                </div>
              </div>

              {!adminViewOnly && (
                inCart ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                    <Check size={10} />
                    {locale === "pt" ? "Adicionado" : "In Cart"}
                  </span>
                ) : (
                  <button
                    disabled={outOfStock || adding}
                    onClick={handleAddToCart}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all duration-200",
                      outOfStock
                        ? "bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600 cursor-not-allowed"
                        : "bg-neutral-900 text-white hover:bg-neutral-700 active:scale-95 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
                    )}
                  >
                    {!outOfStock && <ShoppingCart size={11} />}
                    {outOfStock
                      ? locale === "pt" ? "Indisponível" : "Unavailable"
                      : adding
                      ? "..."
                      : locale === "pt" ? "Adicionar" : "Add"}
                  </button>
                )
              )}
            </div>
          </div>
        </article>
      )}
    </>
  );
}
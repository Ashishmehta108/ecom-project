"use client";

import { useEffect, useMemo, useState } from "react";
import userCartState from "@/lib/states/cart.state";
import {
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
} from "@/lib/actions/cart-actions";
import { syncCart } from "@/lib/syncCart";
import EmptyCart from "./EmptyCart";
import CartSkeleton from "./CartSkeleton";
import { Trash2, AlertCircle, ShoppingBag, Minus, Plus } from "lucide-react";
import { useLanguage } from "@/app/context/languageContext";

interface CartPageClientProps {
  userId?: string;
  initialItems: any[];
}

function resolveField(value: any, locale: string): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    return (
      value[locale] ??
      value["en"] ??
      value["pt"] ??
      (Object.values(value)[0] as string) ??
      ""
    );
  }
  return String(value);
}

export default function CartPageClient({
  userId,
  initialItems,
}: CartPageClientProps) {
  const { locale } = useLanguage();

  const t = {
    cart: locale === "pt" ? "Carrinho de Compras" : "Shopping Cart",
    itemsInCart: (n: number) =>
      locale === "pt"
        ? `${n} ${n === 1 ? "item" : "itens"} no carrinho`
        : `${n} ${n === 1 ? "item" : "items"} in your cart`,
    each: locale === "pt" ? "cada" : "each",
    onlyLeft: locale === "pt" ? "Apenas" : "Only",
    left: locale === "pt" ? "em stock" : "left",
    remove: locale === "pt" ? "Remover" : "Remove",
    orderSummary: locale === "pt" ? "Resumo da Encomenda" : "Order Summary",
    subtotal: locale === "pt" ? "Subtotal" : "Subtotal",
    shipping: locale === "pt" ? "Envio" : "Shipping",
    free: locale === "pt" ? "Grátis" : "Free",
    total: locale === "pt" ? "Total" : "Total",
    checkout: locale === "pt" ? "Finalizar Compra" : "Proceed to Checkout",
    clearCart: locale === "pt" ? "Limpar Carrinho" : "Clear Cart",
    failedRemove:
      locale === "pt" ? "Falha ao remover o item" : "Failed to remove item",
    failedQty:
      locale === "pt"
        ? "Falha ao atualizar quantidade"
        : "Failed to update quantity",
  };

  const { items, setItems, addOrUpdate, remove, updateQty } = userCartState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialItems && Array.isArray(initialItems)) {
      setItems(initialItems);
      setLoading(false);
    }
  }, [initialItems, setItems]);

  const handleRemove = async (productId: string) => {
    const cartRow = items.find((x) => x.productId === productId);
    if (!cartRow || !userId) return;
    const itemToRemove = items.find((x) => x.productId === productId);
    remove(productId);
    try {
      await removeItemFromCart(cartRow.id);
      await syncCart(userId);
      setError(null);
    } catch {
      setError(t.failedRemove);
      if (itemToRemove) addOrUpdate(itemToRemove);
    }
  };

  const handleQty = async (productId: string, qty: number) => {
    const cartRow = items.find((x) => x.productId === productId);
    if (!cartRow || !userId || qty < 1) return;
    updateQty(productId, qty);
    try {
      const result = await updateItemQuantity(cartRow.id, qty);
      if (!result.success) {
        setError(t.failedQty);
        if (result.removed) {
          await syncCart(userId);
        } else {
          updateQty(productId, cartRow.quantity);
        }
      } else {
        setError(null);
        await syncCart(userId);
      }
    } catch {
      setError(t.failedQty);
      updateQty(productId, cartRow.quantity);
    }
  };

  const handleClear = async () => {
    if (!userId) return;
    const previousItems = [...items];
    userCartState.getState().clear();
    try {
      await clearCart(userId);
      await syncCart(userId);
      setError(null);
    } catch {
      setError(t.failedRemove);
      setItems(previousItems);
    }
  };

  const total = useMemo(
    () =>
      items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
    [items]
  );

  if (loading) return <CartSkeleton />;
  if (items.length === 0) return <EmptyCart />;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">

        {/* HEADER */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-1">
            <ShoppingBag
              size={20}
              className="text-neutral-400 dark:text-neutral-500"
            />
            <h1 className="text-2xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100">
              {t.cart}
            </h1>
          </div>
          <p className="text-sm text-neutral-400 dark:text-neutral-500 ml-8">
            {t.itemsInCart(items.length)}
          </p>
        </header>

        {/* ERROR */}
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 rounded-xl flex items-center gap-2.5">
            <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* CART ITEMS */}
          <section className="lg:col-span-7 xl:col-span-8 space-y-3">
            {items.map((item) => {
              const isLowStock = item.stockQuantity && item.stockQuantity < 5;
              const itemName = resolveField(item.name, locale);
              const itemImage =
                resolveField(item.imageUrl, locale) || "/placeholder.jpg";
              const itemPrice = Number(item.price);
              const lineTotal = itemPrice * item.quantity;

              return (
                <article
                  key={item.productId}
                  className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm p-4 sm:p-5 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors duration-150 cursor-default"
                >
                  <div className="flex gap-4">
                    {/* IMAGE */}
                    <div className="flex-shrink-0">
                      <img
                        src={itemImage}
                        alt={itemName}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover bg-neutral-100 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700"
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h2 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 leading-snug line-clamp-2">
                            {itemName}
                          </h2>
                          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                            €
                            {itemPrice.toLocaleString(
                              locale === "pt" ? "pt-PT" : "en-US"
                            )}{" "}
                            {t.each}
                          </p>

                          {isLowStock && (
                            <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/50 text-[11px] text-amber-600 dark:text-amber-400">
                              <AlertCircle size={10} />
                              {t.onlyLeft} {item.stockQuantity} {t.left}
                            </span>
                          )}
                        </div>

                        {/* LINE TOTAL */}
                        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 whitespace-nowrap flex-shrink-0">
                          €
                          {lineTotal.toLocaleString(
                            locale === "pt" ? "pt-PT" : "en-US"
                          )}
                        </p>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex items-center justify-between mt-3">
                        {/* QTY CONTROL */}
                        <div className="flex items-center gap-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-600 rounded-lg p-0.5">
                          <button
                            disabled={item.quantity <= 1}
                            onClick={() =>
                              handleQty(item.productId, item.quantity - 1)
                            }
                            className="w-7 h-7 flex items-center justify-center rounded-md text-neutral-500 dark:text-neutral-400 hover:bg-white dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                          >
                            <Minus size={13} />
                          </button>

                          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 min-w-[1.75rem] text-center tabular-nums">
                            {item.quantity}
                          </span>

                          <button
                            disabled={
                              item.stockQuantity !== undefined &&
                              item.quantity >= item.stockQuantity
                            }
                            onClick={() =>
                              handleQty(item.productId, item.quantity + 1)
                            }
                            className="w-7 h-7 flex items-center justify-center rounded-md text-neutral-500 dark:text-neutral-400 hover:bg-white dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        {/* REMOVE */}
                        <button
                          onClick={() => handleRemove(item.productId)}
                          aria-label={t.remove}
                          className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-150 cursor-pointer"
                        >
                          <Trash2 size={13} />
                          <span className="hidden sm:inline">{t.remove}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          {/* ORDER SUMMARY */}
          <aside className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden">

              {/* SUMMARY HEADER */}
              <div className="px-5 pt-5 pb-4 border-b border-neutral-200 dark:border-neutral-700">
                <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {t.orderSummary}
                </h3>
              </div>

              {/* SUMMARY ROWS */}
              <div className="px-5 py-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-500 dark:text-neutral-400">
                    {t.subtotal}
                  </span>
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    €
                    {total.toLocaleString(
                      locale === "pt" ? "pt-PT" : "en-US"
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-500 dark:text-neutral-400">
                    {t.shipping}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-xs font-medium tracking-wide uppercase">
                    {t.free}
                  </span>
                </div>
              </div>

              {/* TOTAL + BUTTONS */}
              <div className="px-5 pt-3 pb-5 border-t border-neutral-200 dark:border-neutral-700">
                <div className="flex justify-between items-baseline mb-5">
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {t.total}
                  </span>
                  <span className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                    €
                    {total.toLocaleString(
                      locale === "pt" ? "pt-PT" : "en-US"
                    )}
                  </span>
                </div>

                <button
                  onClick={() => (window.location.href = "/checkout")}
                  className="w-full py-3 bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 rounded-xl text-sm font-medium tracking-wide transition-colors duration-150 cursor-pointer"
                >
                  {t.checkout}
                </button>

                <button
                  onClick={handleClear}
                  disabled={items.length === 0}
                  className="w-full mt-2.5 py-2.5 text-sm text-neutral-400 dark:text-neutral-500 hover:text-red-500 dark:hover:text-red-400 border border-neutral-200 dark:border-neutral-700 hover:border-red-200 dark:hover:border-red-800/50 rounded-xl transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {t.clearCart}
                </button>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
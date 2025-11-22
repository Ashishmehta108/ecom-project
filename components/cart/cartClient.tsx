"use client";

import { useEffect, useMemo, useState } from "react";
import { ShoppingBag, Trash2, Lock, Truck } from "lucide-react";
import userCartState from "@/lib/states/cart.state";
import {
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
} from "@/lib/actions/cart-actions";

import EmptyCart from "@/components/cart/EmptyCart";
import CartSkeleton from "./CartSkeleton";

interface CartPageClientProps {
  userId?: string;
  initialItems: any[];
}

export default function CartPageClient({
  userId,
  initialItems,
}: CartPageClientProps) {
  const { items, setItems, updateQty, removeItem, clear } = userCartState();

  const [isLoading, setisLoading] = useState(true);

  // Load items that came from the server only once
  useEffect(() => {
    if (initialItems) {
      setisLoading(false);
      setItems(initialItems);
    }
  }, [initialItems, setItems]);

  // Total pricing
  const formattedTotal = useMemo(() => {
    const total = items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );
    return total.toLocaleString("en-IN");
  }, [items]);

  // Item actions
  async function handleRemove(id: string) {
    await removeItemFromCart(id);
    removeItem(id);
  }

  async function handleQtyChange(id: string, qty: number) {
    if (qty < 1) return;
    await updateItemQuantity(id, qty);
    updateQty(id, qty);
  }

  async function handleClear() {
    if (!userId) return;
    await clearCart(userId);
    clear();
  }

  async function handleCheckout() {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

    const res = await fetch(`${baseUrl}/api/stripe/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, userId }),
    });

    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  // LOADING STATE
  if (isLoading) return <CartSkeleton />;

  // EMPTY STATE
  if (items.length === 0) return <EmptyCart />;

  // MAIN UI (unchanged)
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <header className="mb-8 lg:mb-12">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="w-7 h-7 text-neutral-700 dark:text-neutral-300" />
            <h1 className="text-3xl lg:text-4xl font-semibold text-neutral-900 dark:text-neutral-100">
              Shopping Cart
            </h1>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400 ml-10">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </header>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* ========== LEFT — ITEMS ========== */}
          <section className="lg:col-span-7 xl:col-span-8 space-y-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="bg-white dark:bg-neutral-900 rounded-lg p-5 lg:p-6 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
              >
                <div className="flex gap-5 lg:gap-6">
                  {/* IMAGE */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.imageUrl || "/placeholder.jpg"}
                      alt={item.name}
                      className="w-24 h-24 lg:w-28 lg:h-28 rounded-lg object-cover bg-neutral-100 dark:bg-neutral-800"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h2 className="text-base lg:text-lg font-medium text-neutral-900 dark:text-neutral-100 leading-snug mb-2 line-clamp-2">
                        {item.name}
                      </h2>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        ₹{Number(item.price).toLocaleString("en-IN")} each
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                      {/* QTY BUTTONS */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            handleQtyChange(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 text-neutral-700 dark:text-neutral-300 transition-colors"
                        >
                          −
                        </button>

                        <span className="text-base font-medium min-w-[2rem] text-center text-neutral-900 dark:text-neutral-100">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            handleQtyChange(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* SUBTOTAL + REMOVE */}
                      <div className="flex items-center gap-4">
                        <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                          ₹
                          {(Number(item.price) * item.quantity).toLocaleString(
                            "en-IN"
                          )}
                        </p>

                        <button
                          onClick={() => handleRemove(item.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        >
                          <Trash2 size={15} />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>

          {/* ========== RIGHT — SUMMARY ========== */}
          <aside className="lg:col-span-5 xl:col-span-4">
            <div className="lg:sticky lg:top-6 bg-white dark:bg-neutral-900 rounded-lg p-6 border border-neutral-200 dark:border-neutral-800">
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Subtotal ({items.length} items)
                  </span>
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    ₹{formattedTotal}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Shipping
                  </span>
                  <span className="font-medium text-green-600 dark:text-green-500">
                    Free
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Tax
                  </span>
                  <span className="text-neutral-600 dark:text-neutral-400">
                    At checkout
                  </span>
                </div>
              </div>

              <div className="border-t border-neutral-200 dark:border-neutral-800 my-6"></div>

              {/* TOTAL */}
              <div className="flex justify-between items-baseline mb-6">
                <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  Total
                </span>
                <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  ₹{formattedTotal}
                </span>
              </div>

              {/* BUTTONS */}
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 font-medium rounded-lg transition-colors"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={handleClear}
                  className="w-full py-3 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 transition-colors"
                >
                  Clear Cart
                </button>
              </div>

              {/* TRUST BADGES */}
              <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-center gap-6 text-xs text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center gap-1.5">
                  <Truck size={14} />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock size={14} />
                  <span>Secure Checkout</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

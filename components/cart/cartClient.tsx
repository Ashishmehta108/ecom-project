// // CartPageClient.tsx
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import userCartState from "@/lib/states/cart.state";
// import {
//   updateItemQuantity,
//   removeItemFromCart,
//   clearCart,
// } from "@/lib/actions/cart-actions";
// import { syncCart } from "@/lib/syncCart";
// import EmptyCart from "./EmptyCart";
// import CartSkeleton from "./CartSkeleton";
// import { Trash, AlertCircle } from "lucide-react";

// interface CartPageClientProps {
//   userId?: string;
//   initialItems: any[];
// }

// export default function CartPageClient({
//   userId,
//   initialItems,
// }: CartPageClientProps) {
//   const { items, setItems } = userCartState();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (initialItems && Array.isArray(initialItems)) {
//       setItems(initialItems);
//       setLoading(false);
//     }
//   }, [initialItems, setItems]);

//   const handleRemove = async (productId: string) => {
//     const cartRow = items.find((x) => x.productId === productId);
//     if (!cartRow || !userId) return;

//     try {
//       await removeItemFromCart(cartRow.id);
//       await syncCart(userId);
//       setError(null);
//     } catch (err: any) {
//       setError(err.message || "Failed to remove item");
//     }
//   };

//   const handleQty = async (productId: string, qty: number) => {
//     const cartRow = items.find((x) => x.productId === productId);
//     if (!cartRow || !userId) return;
//     if (qty < 1) return;

//     try {
//       const result = await updateItemQuantity(cartRow.id, qty);

//       if (!result.success) {
//         setError(result.error || "Failed to update quantity");

//         // If item was removed due to out of stock, sync cart
//         if (result.removed) {
//           await syncCart(userId);
//         }
//       } else {
//         setError(null);
//         await syncCart(userId);
//       }
//     } catch (err: any) {
//       setError(err.message || "Failed to update quantity");
//     }
//   };

//   const handleClear = async () => {
//     if (!userId) return;
//     try {
//       await clearCart(userId);
//       await syncCart(userId);
//       setError(null);
//     } catch (err: any) {
//       setError(err.message || "Failed to clear cart");
//     }
//   };

//   const total = useMemo(() => {
//     return items.reduce(
//       (sum, item) => sum + Number(item.price) * item.quantity,
//       0
//     );
//   }, [items]);

//   if (loading) return <CartSkeleton />;
//   if (items.length === 0) return <EmptyCart />;

//   return (
//     <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
//         <header className="mb-8 lg:mb-12">
//           <h1 className="text-2xl lg:text-4xl font-semibold text-neutral-900 dark:text-neutral-100">
//             Shopping Cart
//           </h1>
//           <p className="text-neutral-500 dark:text-neutral-400 mt-2">
//             {items.length} {items.length === 1 ? "item" : "items"} in your cart
//           </p>
//         </header>

//         {error && (
//           <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
//             <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
//             <div>
//               <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
//           <section className="lg:col-span-7 xl:col-span-8 space-y-4">
//             {items.map((item) => {
//               const isLowStock = item.stockQuantity && item.stockQuantity < 5;

//               return (
//                 <article
//                   key={item.productId}
//                   className="bg-white dark:bg-neutral-900 rounded-lg p-5 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition"
//                 >
//                   <div className="flex flex-col sm:flex-row gap-5">
//                     <img
//                       src={item.imageUrl || "/placeholder.jpg"}
//                       alt={item.name}
//                       className="w-24 h-24 rounded-lg object-cover bg-neutral-100 dark:bg-neutral-800 mx-auto sm:mx-0"
//                     />

//                     <div className="flex-1 flex flex-col justify-between">
//                       <div>
//                         <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 line-clamp-2">
//                           {item.name}
//                         </h2>
//                         <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
//                           €{Number(item.price).toLocaleString("en-IN")} each
//                         </p>

//                         {/* Low Stock Warning */}
//                         {isLowStock && (
//                           <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
//                             <AlertCircle size={14} className="text-amber-600 dark:text-amber-400" />
//                             <span className="text-xs text-amber-700 dark:text-amber-300">
//                               Only {item.stockQuantity} left
//                             </span>
//                           </div>
//                         )}
//                       </div>

//                       <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
//                         <div className="flex items-center gap-3">
//                           <button
//                             disabled={item.quantity <= 1}
//                             onClick={() => handleQty(item.productId, item.quantity - 1)}
//                             className="w-8 h-8 flex items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
//                           >
//                             −
//                           </button>

//                           <span className="text-base font-medium min-w-[2rem] text-center">
//                             {item.quantity}
//                           </span>

//                           <button
//                             disabled={item.stockQuantity !== undefined && item.quantity >= item.stockQuantity}
//                             onClick={() => handleQty(item.productId, item.quantity + 1)}
//                             className="w-8 h-8 flex items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
//                           >
//                             +
//                           </button>
//                         </div>

//                         <div className="flex items-center gap-4">
//                           <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
//                             €{(Number(item.price) * item.quantity).toLocaleString("en-IN")}
//                           </p>

//                           <button
//                             onClick={() => handleRemove(item.productId)}
//                             className="text-red-600 dark:text-red-400 hover:opacity-80 transition"
//                             aria-label="Remove item"
//                           >
//                             <Trash size={18} />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </article>
//               );
//             })}
//           </section>

//           <aside className="lg:col-span-5 xl:col-span-4">
//             <div className="sticky top-6 bg-white dark:bg-neutral-900 rounded-lg p-6 border border-neutral-200 dark:border-neutral-800">
//               <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
//                 Order Summary
//               </h3>

//               <div className="space-y-4 mb-6">
//                 <div className="flex justify-between text-sm">
//                   <span>Subtotal</span>
//                   <span className="font-medium">€{total.toLocaleString("en-IN")}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span>Shipping</span>
//                   <span className="text-green-600 dark:text-green-400">Free</span>
//                 </div>
//               </div>

//               <div className="flex justify-between items-baseline mb-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
//                 <span className="text-lg font-semibold">Total</span>
//                 <span className="text-2xl font-bold">€{total.toLocaleString("en-IN")}</span>
//               </div>

//               <button
//                 className="w-full py-3.5 bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 rounded-lg font-medium transition"
//                 onClick={() => (window.location.href = "/checkout")}
//               >
//                 Proceed to Checkout
//               </button>

//               <button
//                 onClick={handleClear}
//                 className="w-full mt-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
//               >
//                 Clear Cart
//               </button>
//             </div>
//           </aside>
//         </div>
//       </div>
//     </div>
//   );
// }
// CartPageClient.tsx
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
import { Trash, AlertCircle } from "lucide-react";
import { useLanguage } from "@/app/context/languageContext";

interface CartPageClientProps {
  userId?: string;
  initialItems: any[];
}

export default function CartPageClient({
  userId,
  initialItems,
}: CartPageClientProps) {
  const { locale } = useLanguage(); // 🌍 NEW

  const t = {
    cart: locale === "pt" ? "Carrinho de Compras" : "Shopping Cart",
    itemsInCart: (n: number) =>
      locale === "pt"
        ? `${n} ${n === 1 ? "item" : "itens"} no carrinho`
        : `${n} ${n === 1 ? "item" : "items"} in your cart`,
    each: locale === "pt" ? "cada" : "each",
    onlyLeft: locale === "pt" ? "Restam apenas" : "Only",
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

  const { items, setItems } = userCartState();
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

    try {
      await removeItemFromCart(cartRow.id);
      await syncCart(userId);
      setError(null);
    } catch {
      setError(t.failedRemove);
    }
  };

  const handleQty = async (productId: string, qty: number) => {
    const cartRow = items.find((x) => x.productId === productId);
    if (!cartRow || !userId || qty < 1) return;

    try {
      const result = await updateItemQuantity(cartRow.id, qty);

      if (!result.success) {
        setError(t.failedQty);
        if (result.removed) await syncCart(userId);
      } else {
        setError(null);
        await syncCart(userId);
      }
    } catch {
      setError(t.failedQty);
    }
  };

  const handleClear = async () => {
    if (!userId) return;
    try {
      await clearCart(userId);
      await syncCart(userId);
      setError(null);
    } catch {
      setError(t.failedRemove);
    }
  };

  const total = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );
  }, [items]);

  if (loading) return <CartSkeleton />;
  if (items.length === 0) return <EmptyCart />;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* HEADER */}
        <header className="mb-8 lg:mb-12">
          <h1 className="text-2xl lg:text-4xl font-semibold text-neutral-900 dark:text-neutral-100">
            {t.cart}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2">
            {t.itemsInCart(items.length)}
          </p>
        </header>

        {/* ERROR */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle
              className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
              size={20}
            />
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* CART ITEMS */}
          <section className="lg:col-span-7 xl:col-span-8 space-y-4">
            {items.map((item) => {
              const isLowStock = item.stockQuantity && item.stockQuantity < 5;
              return (
                <article
                  key={item.productId}
                  className="bg-white dark:bg-neutral-900 rounded-lg p-5 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition"
                >
                  <div className="flex flex-col sm:flex-row gap-5">
                    <img
                      src={item.imageUrl || "/placeholder.jpg"}
                      alt={item.name}
                      className="w-24 h-24 rounded-lg object-cover bg-neutral-100 dark:bg-neutral-800 mx-auto sm:mx-0"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 line-clamp-2">
                          {item.name}
                        </h2>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                          €
                          {Number(item.price).toLocaleString(
                            locale === "pt" ? "pt-PT" : "en-US"
                          )}{" "}
                          {t.each}
                        </p>

                        {isLowStock && (
                          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
                            <AlertCircle
                              size={14}
                              className="text-amber-600 dark:text-amber-400"
                            />
                            <span className="text-xs text-amber-700 dark:text-amber-300">
                              {t.onlyLeft} {item.stockQuantity} {t.left}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* ACTIONS */}
                      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
                        {/* QTY */}
                        <div className="flex items-center gap-3">
                          <button
                            disabled={item.quantity <= 1}
                            onClick={() =>
                              handleQty(item.productId, item.quantity - 1)
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                          >
                            −
                          </button>

                          <span className="text-base font-medium min-w-[2rem] text-center">
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
                            className="w-8 h-8 flex items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center gap-4">
                          <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                            €
                            {(
                              Number(item.price) * item.quantity
                            ).toLocaleString(
                              locale === "pt" ? "pt-PT" : "en-US"
                            )}
                          </p>

                          <button
                            onClick={() => handleRemove(item.productId)}
                            className="text-red-600 dark:text-red-400 hover:opacity-80 transition"
                            aria-label={t.remove}
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          {/* ORDER SUMMARY */}
          <aside className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-6 bg-white dark:bg-neutral-900 rounded-lg p-6 border border-neutral-200 dark:border-neutral-800">
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
                {t.orderSummary}
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span>{t.subtotal}</span>
                  <span className="font-medium">
                    €{total.toLocaleString(locale === "pt" ? "pt-PT" : "en-US")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t.shipping}</span>
                  <span className="text-green-600 dark:text-green-400">
                    {t.free}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-baseline mb-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <span className="text-lg font-semibold">{t.total}</span>
                <span className="text-2xl font-bold">
                  €{total.toLocaleString(locale === "pt" ? "pt-PT" : "en-US")}
                </span>
              </div>

              {/* BUTTONS */}
              <button
                className="w-full py-3.5 bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 rounded-lg font-medium transition"
                onClick={() => (window.location.href = "/checkout")}
              >
                {t.checkout}
              </button>

              <button
                onClick={handleClear}
                className="w-full mt-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              >
                {t.clearCart}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

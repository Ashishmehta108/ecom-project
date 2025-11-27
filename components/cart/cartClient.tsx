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
// import { Trash } from "lucide-react";

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

//   useEffect(() => {
//     if (initialItems && Array.isArray(initialItems)) {
//       setItems(initialItems);
//       setLoading(false);
//     }
//   }, [initialItems, setItems]);

//   const handleRemove = async (productId: string) => {
//     const cartRow = items.find((x) => x.productId === productId);
//     if (!cartRow || !userId) return;

//     await removeItemFromCart(cartRow.id);
//     await syncCart(userId);
//   };

//   const handleQty = async (productId: string, qty: number) => {
//     const cartRow = items.find((x) => x.productId === productId);
//     if (!cartRow || !userId) return;
//     if (qty < 1) return;

//     await updateItemQuantity(cartRow.id, qty);
//     await syncCart(userId);
//   };

//   const handleClear = async () => {
//     if (!userId) return;
//     await clearCart(userId);
//     await syncCart(userId);
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

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
//           <section className="lg:col-span-7 xl:col-span-8 space-y-4">
//             {items.map((item) => (
//               <article
//                 key={item.productId}
//                 className="bg-white dark:bg-neutral-900 rounded-lg p-5 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition"
//               >
//                 <div className="flex gap-5">
//                   <img
//                     src={item.imageUrl || "/placeholder.jpg"}
//                     alt={item.name}
//                     className="w-24 h-24 rounded-lg object-cover bg-neutral-100 dark:bg-neutral-800"
//                   />

//                   <div className="flex-1 flex flex-col justify-between">
//                     <div>
//                       <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 line-clamp-2">
//                         {item.name}
//                       </h2>
//                       <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
//                         €{Number(item.price).toLocaleString("en-IN")} each
//                       </p>
//                     </div>

//                     <div className="flex items-center justify-between mt-4">
//                       <div className="flex items-center gap-3">
//                         <button
//                           disabled={item.quantity <= 1}
//                           onClick={() =>
//                             handleQty(item.productId, item.quantity - 1)
//                           }
//                           className="w-8 h-8 flex items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40"
//                         >
//                           −
//                         </button>

//                         <span className="text-base font-medium min-w-[2rem] text-center">
//                           {item.quantity}
//                         </span>

//                         <button
//                           onClick={() =>
//                             handleQty(item.productId, item.quantity + 1)
//                           }
//                           className="w-8 h-8 flex items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
//                         >
//                           +
//                         </button>
//                       </div>

//                       <div className="flex items-center gap-4">
//                         <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
//                           €
//                           {(item.price * item.quantity).toLocaleString("en-IN")}
//                         </p>

//                         <button
//                           onClick={() => handleRemove(item.productId)}
//                           className="text-red-600 dark:text-red-400 hover:underline"
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </article>
//             ))}
//           </section>

//           <aside className="lg:col-span-5 xl:col-span-4">
//             <div className="sticky top-6 bg-white dark:bg-neutral-900 rounded-lg p-6 border border-neutral-200 dark:border-neutral-800">
//               <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
//                 Order Summary
//               </h3>

//               <div className="space-y-4 mb-6">
//                 <div className="flex justify-between text-sm">
//                   <span>Subtotal</span>
//                   <span className="font-medium">
//                     €{total.toLocaleString("en-IN")}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span>Shipping</span>
//                   <span className="text-green-600">Free</span>
//                 </div>
//               </div>

//               <div className="flex justify-between items-baseline mb-6">
//                 <span className="text-lg font-semibold">Total</span>
//                 <span className="text-xl font-bold">
//                   €{total.toLocaleString("en-IN")}
//                 </span>
//               </div>

//               <button
//                 className="w-full py-3.5 bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 rounded-lg"
//                 onClick={() => (window.location.href = "/checkout")}
//               >
//                 Proceed to Checkout
//               </button>

//               <button
//                 onClick={handleClear}
//                 className="w-full mt-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
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
import { Trash } from "lucide-react";

interface CartPageClientProps {
  userId?: string;
  initialItems: any[];
}

export default function CartPageClient({
  userId,
  initialItems,
}: CartPageClientProps) {
  const { items, setItems } = userCartState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialItems && Array.isArray(initialItems)) {
      setItems(initialItems);
      setLoading(false);
    }
  }, [initialItems, setItems]);

  const handleRemove = async (productId: string) => {
    const cartRow = items.find((x) => x.productId === productId);
    if (!cartRow || !userId) return;

    await removeItemFromCart(cartRow.id);
    await syncCart(userId);
  };

  const handleQty = async (productId: string, qty: number) => {
    const cartRow = items.find((x) => x.productId === productId);
    if (!cartRow || !userId) return;
    if (qty < 1) return;

    await updateItemQuantity(cartRow.id, qty);
    await syncCart(userId);
  };

  const handleClear = async () => {
    if (!userId) return;
    await clearCart(userId);
    await syncCart(userId);
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
        <header className="mb-8 lg:mb-12">
          <h1 className="text-2xl lg:text-4xl font-semibold text-neutral-900 dark:text-neutral-100">
            Shopping Cart
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2">
            {items.length} {items.length === 1 ? "item" : "items"} in your cart
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <section className="lg:col-span-7 xl:col-span-8 space-y-4">
            {items.map((item) => (
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
                        €{Number(item.price).toLocaleString("en-IN")} each
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
                      <div className="flex items-center gap-3">
                        <button
                          disabled={item.quantity <= 1}
                          onClick={() => handleQty(item.productId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40"
                        >
                          −
                        </button>

                        <span className="text-base font-medium min-w-[2rem] text-center">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => handleQty(item.productId, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                          €{(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>

                        <button
                          onClick={() => handleRemove(item.productId)}
                          className="text-red-600 dark:text-red-400 hover:opacity-80"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <aside className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-6 bg-white dark:bg-neutral-900 rounded-lg p-6 border border-neutral-200 dark:border-neutral-800">
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="font-medium">€{total.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline mb-6">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-xl font-bold">€{total.toLocaleString("en-IN")}</span>
              </div>

              <button
                className="w-full py-3.5 bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 rounded-lg"
                onClick={() => (window.location.href = "/checkout")}
              >
                Proceed to Checkout
              </button>

              <button
                onClick={handleClear}
                className="w-full mt-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Clear Cart
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

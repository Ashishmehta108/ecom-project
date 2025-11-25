// "use client";

// import { useEffect, useMemo } from "react";
// import { Trash2, ShoppingBag, Lock, Truck } from "lucide-react";
// import userCartState from "@/lib/states/cart.state";
// import {
//   getCart,
//   updateItemQuantity,
//   removeItemFromCart,
//   clearCart,
// } from "@/lib/actions/cart-actions";
// import EmptyCart from "@/components/cart/EmptyCart";
// import { authClient } from "@/lib/auth-client";

// export default function CartPage() {
//   const { items, setItems, updateQty, removeItem, clear } = userCartState();
//   const { data, isPending } = authClient.useSession();

//   useEffect(() => {
//     async function loadCart() {
//       console.log("this is user", data?.user.id);
//       if (!isPending) {
//         const res = await getCart(data?.user.id!);
//         if (res?.success) {
//           console.log(res.data.items);
//           setItems(res.data.items!);
//         }
//       }
//     }
//     loadCart();
//   }, [setItems, isPending]);

//   const formattedTotal = useMemo(() => {
//     const total = items.reduce(
//       (sum, item) => sum + Number(item.price) * item.quantity,
//       0
//     );
//     return total.toLocaleString("en-IN");
//   }, [items]);

//   const handleRemove = async (id: string) => {
//     await removeItemFromCart(id);
//     removeItem(id);
//   };

//   const handleQtyChange = async (id: string, newQty: number) => {
//     if (newQty < 1) return;
//     await updateItemQuantity(id, newQty);
//     updateQty(id, newQty);
//   };

//   const handleClearCart = async () => {
//     await clearCart(data?.user.id!);
//     clear();
//   };
//   async function handleCheckout() {
//     const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

//     const res = await fetch(`${baseUrl}/api/stripe/checkout`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         items: items,
//         userId: data?.user.id,
//       }),
//     });

//     const d = await res.json();

//     if (d.url) {
//       window.location.href = d.url;
//     }
//   }

//   return (
//     <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
//         {/* Header */}
//         <header className="mb-8 lg:mb-12">
//           <div className="flex items-center gap-3 mb-2">
//             <ShoppingBag className="w-7 h-7 text-neutral-700 dark:text-neutral-300" />
//             <h1 className="text-3xl lg:text-4xl font-semibold text-neutral-900 dark:text-neutral-100">
//               Shopping Cart
//             </h1>
//           </div>
//           {items.length > 0 && (
//             <p className="text-neutral-500 dark:text-neutral-400 ml-10">
//               {items.length} {items.length === 1 ? "item" : "items"}
//             </p>
//           )}
//         </header>

//         {items.length === 0 ? (
//           <EmptyCart />
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
//             {/* Cart Items - Left Side */}
//             <section className="lg:col-span-7 xl:col-span-8 space-y-4">
//               {items.map((item) => (
//                 <article
//                   key={item.id}
//                   className="bg-white dark:bg-neutral-900 rounded-lg p-5 lg:p-6
//                   border border-neutral-200 dark:border-neutral-800
//                   hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
//                 >
//                   <div className="flex gap-5 lg:gap-6">
//                     {/* Image */}
//                     <div className="flex-shrink-0">
//                       <img
//                         src={item.imageUrl || "/placeholder.jpg"}
//                         alt={item.name}
//                         className="w-24 h-24 lg:w-28 lg:h-28 rounded-lg object-cover
//                         bg-neutral-100 dark:bg-neutral-800"
//                       />
//                     </div>

//                     <div className="flex-1 min-w-0 flex flex-col justify-between">
//                       <div>
//                         <h2
//                           className="text-base lg:text-lg font-medium text-neutral-900 dark:text-neutral-100
//                         leading-snug mb-2 line-clamp-2"
//                         >
//                           {item.name}
//                         </h2>
//                         <p className="text-sm text-neutral-500 dark:text-neutral-400">
//                           €{Number(item.price).toLocaleString("en-IN")} each
//                         </p>
//                       </div>

//                       {/* Bottom Section - Actions & Price */}
//                       <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
//                         {/* Quantity Controls */}
//                         <div className="flex items-center gap-3">
//                           <button
//                             onClick={() =>
//                               handleQtyChange(item.id, item.quantity - 1)
//                             }
//                             disabled={item.quantity <= 1}
//                             className="w-8 h-8 flex items-center justify-center rounded-md
//                             bg-neutral-100 dark:bg-neutral-800
//                             hover:bg-neutral-200 dark:hover:bg-neutral-700
//                             disabled:opacity-40 disabled:cursor-not-allowed
//                             text-neutral-700 dark:text-neutral-300 transition-colors"
//                           >
//                             −
//                           </button>

//                           <span
//                             className="text-base font-medium min-w-[2rem] text-center
//                           text-neutral-900 dark:text-neutral-100"
//                           >
//                             {item.quantity}
//                           </span>

//                           <button
//                             onClick={() =>
//                               handleQtyChange(item.id, item.quantity + 1)
//                             }
//                             className="w-8 h-8 flex items-center justify-center rounded-md
//                             bg-neutral-100 dark:bg-neutral-800
//                             hover:bg-neutral-200 dark:hover:bg-neutral-700
//                             text-neutral-700 dark:text-neutral-300 transition-colors"
//                           >
//                             +
//                           </button>
//                         </div>

//                         {/* Subtotal & Remove */}
//                         <div className="flex items-center gap-4">
//                           <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
//                             €
//                             {(
//                               Number(item.price) * item.quantity
//                             ).toLocaleString("en-IN")}
//                           </p>

//                           <button
//                             onClick={() => handleRemove(item.id)}
//                             className="flex items-center gap-1.5 px-3 py-1.5 rounded-md
//                             text-sm text-red-600 dark:text-red-400
//                             hover:bg-red-50 dark:hover:bg-red-950/30
//                             transition-colors"
//                           >
//                             <Trash2 size={15} />
//                             <span className="hidden sm:inline">Remove</span>
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </article>
//               ))}
//             </section>

//             {/* Order Summary - Right Side */}
//             <aside className="lg:col-span-5 xl:col-span-4">
//               <div className="lg:sticky lg:top-6">
//                 <div
//                   className="bg-white dark:bg-neutral-900 rounded-lg p-6
//                 border border-neutral-200 dark:border-neutral-800"
//                 >
//                   <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
//                     Order Summary
//                   </h3>

//                   {/* Pricing Details */}
//                   <div className="space-y-4 mb-6">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-neutral-600 dark:text-neutral-400">
//                         Subtotal ({items.length}{" "}
//                         {items.length === 1 ? "item" : "items"})
//                       </span>
//                       <span className="font-medium text-neutral-900 dark:text-neutral-100">
//                         €{formattedTotal}
//                       </span>
//                     </div>

//                     <div className="flex justify-between text-sm">
//                       <span className="text-neutral-600 dark:text-neutral-400">
//                         Shipping
//                       </span>
//                       <span className="font-medium text-green-600 dark:text-green-500">
//                         Free
//                       </span>
//                     </div>

//                     <div className="flex justify-between text-sm">
//                       <span className="text-neutral-600 dark:text-neutral-400">
//                         Tax
//                       </span>
//                       <span className="text-neutral-600 dark:text-neutral-400">
//                         At checkout
//                       </span>
//                     </div>
//                   </div>

//                   {/* Divider */}
//                   <div className="border-t border-neutral-200 dark:border-neutral-800 my-6"></div>

//                   {/* Total */}
//                   <div className="flex justify-between items-baseline mb-6">
//                     <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
//                       Total
//                     </span>
//                     <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
//                       €{formattedTotal}
//                     </span>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="space-y-3">
//                     <button
//                       className="w-full py-3.5 bg-neutral-900 dark:bg-neutral-100
//                       hover:bg-neutral-800 dark:hover:bg-neutral-200
//                       text-white dark:text-neutral-900
//                       font-medium rounded-lg transition-colors"
//                       onClick={handleCheckout}
//                     >
//                       Proceed to Checkout
//                     </button>

//                     <button
//                       onClick={handleClearCart}
//                       className="w-full py-3 text-neutral-600 dark:text-neutral-400
//                       hover:text-neutral-900 dark:hover:text-neutral-100
//                       hover:bg-neutral-100 dark:hover:bg-neutral-800
//                       font-medium rounded-lg transition-colors border border-neutral-200 dark:border-neutral-800"
//                     >
//                       Clear Cart
//                     </button>
//                   </div>

//                   {/* Trust Badges */}
//                   <div
//                     className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800
//                   flex items-center justify-center gap-6 text-xs text-neutral-500 dark:text-neutral-400"
//                   >
//                     <div className="flex items-center gap-1.5">
//                       <Truck size={14} />
//                       <span>Free Shipping</span>
//                     </div>
//                     <div className="flex items-center gap-1.5">
//                       <Lock size={14} />
//                       <span>Secure Checkout</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </aside>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// app/cart/page.tsx
import CartPageClient from "@/components/cart/cartClient";
import { getCart } from "@/lib/actions/cart-actions";
import { CartItem } from "@/lib/types/cart.types";
import { getUserSession } from "@/server";

export default async function CartPage() {
  const session = await getUserSession();

  let items: CartItem[] = [];
  if (session?.user.id) {
    const res = await getCart(session.user.id);
    if (res?.success) {
      items = res.data.items ?? [];
    }
  }
  return <CartPageClient userId={session?.user?.id}  initialItems={items} />;
}

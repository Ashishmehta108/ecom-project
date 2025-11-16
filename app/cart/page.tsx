// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { Trash2 } from "lucide-react";
// import userCartState from "@/lib/states/cart.state";
// import { ProductInCart } from "@/lib/types/cart.types";

// type CartItemWithImage = ProductInCart & {
//   image: string;
// };

// export default function CartPage() {
//   const [cartItems] = useState<CartItemWithImage[]>([
//     {
//       productId: "1",
//       name: "Semi-Mechanical Gaming Keyboard",
//       price: 799,
//       quantity: 1,
//       image: "https://m.media-amazon.com/images/I/617q9MVCT9L._SX679_.jpg",
//     },
//     {
//       productId: "2",
//       name: "iPhone 16 Pro Max 256 GB: 5G",
//       price: 134900,
//       quantity: 1,
//       image: "https://m.media-amazon.com/images/I/61giwQtR1qL._SX679_.jpg",
//     },
//   ]);

//   const { items, removeItem, updateItemQuantity, setItems } = userCartState();

//   useEffect(() => {
//     setItems(cartItems);
//   }, [cartItems, setItems]);

//   const formattedTotal = useMemo(() => {
//     const total = items.reduce(
//       (sum: number, item: ProductInCart) => sum + item.price * item.quantity,
//       0
//     );
//     return total.toLocaleString("en-IN");
//   }, [items]);

//   return (
//     <div className="bg-white dark:bg-black min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-8 text-neutral-900 dark:text-neutral-200">

//         {/* HEADER */}
//         <header className="mb-6 sm:mb-8">
//           <h1 className="text-2xl sm:text-3xl font-bold mb-1">Shopping Cart</h1>
//           <p className="text-neutral-500 dark:text-neutral-400 text-sm">
//             {items.length} items in your cart
//           </p>
//         </header>

//         <main className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

//           {/* LEFT SIDE */}
//           <section className="md:col-span-2 space-y-5 sm:space-y-6">
//             {items.map((item: ProductInCart) => {
//               if (item.quantity <= 0) return null;

//               const image =
//                 cartItems.find((c) => c.productId === item.productId)?.image || "";

//               return (
//                 <article
//                   key={item.productId}
//                   className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 p-4 sm:p-5
//                   rounded-2xl bg-white dark:bg-neutral-900
//                   border border-neutral-200 dark:border-neutral-800 shadow-sm"
//                 >
//                   {/* IMAGE */}
//                   <img
//                     src={image}
//                     alt={item.name}
//                     className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover mx-auto sm:mx-0"
//                   />

//                   {/* DETAILS */}
//                   <div className="flex-1 flex flex-col justify-between w-full">
//                     <div className="flex flex-col gap-1">
//                       <h2 className="text-base sm:text-lg font-semibold leading-tight">
//                         {item.name}
//                       </h2>

//                       <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 w-fit">
//                         ₹{item.price.toLocaleString("en-IN")} each
//                       </span>

//                       <p className="text-sm font-thin mt-1">
//                         ₹{(item.price * item.quantity).toLocaleString("en-IN")}
//                       </p>
//                     </div>

//                     {/* ACTIONS */}
//                     <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4 sm:gap-0">

//                       {/* REMOVE */}
//                       <button
//                         onClick={() => removeItem(item.productId)}
//                         className="flex items-center gap-1 text-red-500 hover:text-red-600 dark:hover:text-red-500
//                         bg-red-900/10 hover:bg-red-900/20
//                         px-3 py-2 rounded text-sm w-full sm:w-auto justify-center"
//                       >
//                         <Trash2 size={14} /> Remove
//                       </button>

//                       {/* QTY */}
//                       <div className="flex items-center gap-3">
//                         <button
//                           onClick={() => updateItemQuantity(item.productId, "dec")}
//                           className="w-8 h-8 flex items-center justify-center rounded-full
//                           border dark:border-neutral-600 text-lg"
//                         >
//                           -
//                         </button>

//                         <span className="text-lg font-medium w-6 text-center">
//                           {item.quantity}
//                         </span>

//                         <button
//                           onClick={() => updateItemQuantity(item.productId, "inc")}
//                           className="w-8 h-8 flex items-center justify-center rounded-full
//                           border dark:border-neutral-600 text-lg"
//                         >
//                           +
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </article>
//               );
//             })}
//           </section>

//           {/* RIGHT SIDE */}
//           <aside className="md:sticky md:top-24 w-full">
//             <div
//               className="p-5 sm:p-6 rounded-3xl
//               bg-white dark:bg-neutral-900
//               border border-neutral-200 dark:border-neutral-800 shadow-md"
//             >
//               <h3 className="text-lg sm:text-xl font-bold mb-5">Order Summary</h3>

//               <div className="space-y-3 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-neutral-600 dark:text-neutral-400">Subtotal</span>
//                   <span className="font-medium">₹{formattedTotal}</span>
//                 </div>

//                 <div className="flex justify-between">
//                   <span className="text-neutral-600 dark:text-neutral-400">Shipping</span>
//                   <span className="font-medium text-green-600">Free</span>
//                 </div>

//                 <div className="flex justify-between">
//                   <span className="text-neutral-600 dark:text-neutral-400">Tax</span>
//                   <span>Calculated at checkout</span>
//                 </div>
//               </div>

//               <hr className="my-4 border-neutral-200 dark:border-neutral-800" />

//               <div className="flex justify-between font-thin text-sm">
//                 <span>Total</span>
//                 <span>₹{formattedTotal}</span>
//               </div>

//               <button
//                 className="w-full mt-5 py-3 bg-blue-600 hover:bg-blue-700
//                 dark:bg-blue-700 dark:hover:bg-blue-600 text-white text-sm rounded-xl font-semibold
//                 transition-all shadow-md hover:shadow-lg"
//               >
//                 Proceed to Checkout
//               </button>

//               <p className="text-center text-xs mt-3 text-neutral-500 dark:text-neutral-400">
//                 Free shipping • Secure checkout
//               </p>
//             </div>
//           </aside>
//         </main>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useMemo } from "react";
// import { Trash2 } from "lucide-react";
// import userCartState from "@/lib/states/cart.state";
// import {
//   getCart,
//   updateItemQuantity,
//   removeItemFromCart,
//   clearCart,
// } from "@/lib/actions/cart-actions";
// import { useSession } from "@/lib/auth-client";
// import EmptyCart from "@/components/cart/EmptyCart";

// export default function CartPage() {
//   const { items, setItems, updateQty, removeItem, clear } = userCartState();
//   const {data,isPending} = useSession();
//   // Load cart items on mount
//   useEffect(() => {
//     async function loadCart() {
//       console.log("this is user", data?.user.id);
//       const res = await getCart(data?.user.id!);
//       if (res?.success) {
//         console.log(res.data.items);
//         setItems(res.data.items);
//       }
//     }
//     loadCart();
//   }, [setItems,isPending]);

//   const formattedTotal = useMemo(() => {
//     const total = items.reduce(
//       (sum, item) => sum + Number(item.price) * item.quantity,
//       0
//     );
//     return total.toLocaleString("en-IN");
//   }, [items]);

//   const handleRemove = async (id: string) => {
//     // "use server";
//     await removeItemFromCart(id);
//     removeItem(id);
//   };

//   const handleQtyChange = async (id: string, newQty: number) => {
//     // "use server";
//     if (newQty < 1) return;

//     await updateItemQuantity(id, newQty);
//     updateQty(id, newQty);
//   };

//   const handleClearCart = async () => {
//     // "use server";
//     await clearCart(user.data?.user.id!);
//     clear();
//   };

//   return (
//     <div className="bg-white dark:bg-black min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-8 text-neutral-900 dark:text-neutral-200">
//         <header className="mb-6 sm:mb-8">
//           <h1 className="text-2xl sm:text-3xl font-bold mb-1">Shopping Cart</h1>
//           {items.length > 0 && (
//             <p className="text-neutral-500 dark:text-neutral-400 text-sm">
//               {items.length} items in your cart
//             </p>
//           )}
//         </header>

//         <main className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
//           {/* LEFT SIDE (Cart Items) */}
//           <section
//             className={`md:col-span-${
//               items.length > 0 ? 2 : 3
//             } space-y-5 sm:space-y-6`}
//           >
//             {items.length === 0 && <EmptyCart />}

//             {items.map((item) => (
//               <article
//                 key={item.id}
//                 className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 p-4 sm:p-5
//                 rounded-2xl bg-white dark:bg-neutral-900
//                 border border-neutral-200 dark:border-neutral-800 shadow-sm"
//               >
//                 {/* IMAGE */}
//                 <img
//                   src={item.imageUrl || "/placeholder.jpg"}
//                   alt={item.name}
//                   className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover mx-auto sm:mx-0"
//                 />

//                 {/* DETAILS */}
//                 <div className="flex-1 flex flex-col justify-between w-full">
//                   <div className="flex flex-col gap-1">
//                     <h2 className="text-base sm:text-lg font-semibold leading-tight">
//                       {item.name}
//                     </h2>

//                     <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 w-fit">
//                       ₹{Number(item.price).toLocaleString("en-IN")} each
//                     </span>

//                     <p className="text-sm font-thin mt-1">
//                       ₹
//                       {(Number(item.price) * item.quantity).toLocaleString(
//                         "en-IN"
//                       )}
//                     </p>
//                   </div>

//                   {/* ACTIONS */}
//                   <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4 sm:gap-0">
//                     {/* REMOVE */}
//                     <button
//                       onClick={() => handleRemove(item.id)}
//                       className="flex items-center gap-1 text-red-500 hover:text-red-600 dark:hover:text-red-500
//                       bg-red-900/10 hover:bg-red-900/20
//                       px-3 py-2 rounded text-sm w-full sm:w-auto justify-center"
//                     >
//                       <Trash2 size={14} /> Remove
//                     </button>

//                     {/* QUANTITY SELECTOR */}
//                     <div className="flex items-center gap-3">
//                       <button
//                         onClick={() =>
//                           handleQtyChange(item.id, item.quantity - 1)
//                         }
//                         className="w-8 h-8 flex items-center justify-center rounded-full
//                         border dark:border-neutral-600 text-lg"
//                       >
//                         -
//                       </button>

//                       <span className="text-lg font-medium w-6 text-center">
//                         {item.quantity}
//                       </span>

//                       <button
//                         onClick={() =>
//                           handleQtyChange(item.id, item.quantity + 1)
//                         }
//                         className="w-8 h-8 flex items-center justify-center rounded-full
//                         border dark:border-neutral-600 text-lg"
//                       >
//                         +
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </article>
//             ))}
//           </section>

//           {items.length > 0 && (
//             <aside className="md:sticky md:top-24 w-full">
//               <div
//                 className="p-5 sm:p-6 rounded-3xl
//               bg-white dark:bg-neutral-900
//               border border-neutral-200 dark:border-neutral-800 shadow-md"
//               >
//                 <h3 className="text-lg sm:text-xl font-bold mb-5">
//                   Order Summary
//                 </h3>

//                 <div className="space-y-3 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-neutral-600 dark:text-neutral-400">
//                       Subtotal
//                     </span>
//                     <span className="font-medium">₹{formattedTotal}</span>
//                   </div>

//                   <div className="flex justify-between">
//                     <span className="text-neutral-600 dark:text-neutral-400">
//                       Shipping
//                     </span>
//                     <span className="font-medium text-green-600">Free</span>
//                   </div>

//                   <div className="flex justify-between">
//                     <span className="text-neutral-600 dark:text-neutral-400">
//                       Tax
//                     </span>
//                     <span>Calculated at checkout</span>
//                   </div>
//                 </div>

//                 <hr className="my-4 border-neutral-200 dark:border-neutral-800" />

//                 <div className="flex justify-between font-semibold text-sm">
//                   <span>Total</span>
//                   <span>₹{formattedTotal}</span>
//                 </div>

//                 <button
//                   onClick={handleClearCart}
//                   className="w-full mt-5 py-3 text-sm rounded-xl font-semibold
//                 bg-red-600 hover:bg-red-700 text-white transition shadow"
//                 >
//                   Clear Cart
//                 </button>

//                 <button
//                   className="w-full mt-3 py-3 bg-blue-600 hover:bg-blue-700
//                 dark:bg-blue-700 dark:hover:bg-blue-600 text-white text-sm rounded-xl font-semibold
//                 transition-all shadow-md hover:shadow-lg"
//                 >
//                   Proceed to Checkout
//                 </button>

//                 <p className="text-center text-xs mt-3 text-neutral-500 dark:text-neutral-400">
//                   Free shipping • Secure checkout
//                 </p>
//               </div>
//             </aside>
//           )}
//           {/* RIGHT SIDE (Summary) */}
//         </main>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo } from "react";
import { Trash2, ShoppingBag, Lock, Truck } from "lucide-react";
import userCartState from "@/lib/states/cart.state";
import {
  getCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
} from "@/lib/actions/cart-actions";
import EmptyCart from "@/components/cart/EmptyCart";
import { authClient } from "@/lib/auth-client";

export default function CartPage() {
  const { items, setItems, updateQty, removeItem, clear } = userCartState();
  const { data, isPending } = authClient.useSession();

  useEffect(() => {
    async function loadCart() {
      console.log("this is user", data?.user.id);
      if (!isPending) {
        const res = await getCart(data?.user.id!);
        if (res?.success) {
          console.log(res.data.items);
          setItems(res.data.items!);
        }
      }
    }
    loadCart();
  }, [setItems, isPending]);

  const formattedTotal = useMemo(() => {
    const total = items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );
    return total.toLocaleString("en-IN");
  }, [items]);

  const handleRemove = async (id: string) => {
    await removeItemFromCart(id);
    removeItem(id);
  };

  const handleQtyChange = async (id: string, newQty: number) => {
    if (newQty < 1) return;
    await updateItemQuantity(id, newQty);
    updateQty(id, newQty);
  };

  const handleClearCart = async () => {
    await clearCart(data?.user.id!);
    clear();
  };

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
          {items.length > 0 && (
            <p className="text-neutral-500 dark:text-neutral-400 ml-10">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
          )}
        </header>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Cart Items - Left Side */}
            <section className="lg:col-span-7 xl:col-span-8 space-y-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="bg-white dark:bg-neutral-900 rounded-lg p-5 lg:p-6 
                  border border-neutral-200 dark:border-neutral-800 
                  hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                >
                  <div className="flex gap-5 lg:gap-6">
                    {/* Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.imageUrl || "/placeholder.jpg"}
                        alt={item.name}
                        className="w-24 h-24 lg:w-28 lg:h-28 rounded-lg object-cover 
                        bg-neutral-100 dark:bg-neutral-800"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      {/* Top Section - Title & Price */}
                      <div>
                        <h2
                          className="text-base lg:text-lg font-medium text-neutral-900 dark:text-neutral-100 
                        leading-snug mb-2 line-clamp-2"
                        >
                          {item.name}
                        </h2>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          ₹{Number(item.price).toLocaleString("en-IN")} each
                        </p>
                      </div>

                      {/* Bottom Section - Actions & Price */}
                      <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              handleQtyChange(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center rounded-md 
                            bg-neutral-100 dark:bg-neutral-800 
                            hover:bg-neutral-200 dark:hover:bg-neutral-700 
                            disabled:opacity-40 disabled:cursor-not-allowed
                            text-neutral-700 dark:text-neutral-300 transition-colors"
                          >
                            −
                          </button>

                          <span
                            className="text-base font-medium min-w-[2rem] text-center 
                          text-neutral-900 dark:text-neutral-100"
                          >
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              handleQtyChange(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-md 
                            bg-neutral-100 dark:bg-neutral-800 
                            hover:bg-neutral-200 dark:hover:bg-neutral-700 
                            text-neutral-700 dark:text-neutral-300 transition-colors"
                          >
                            +
                          </button>
                        </div>

                        {/* Subtotal & Remove */}
                        <div className="flex items-center gap-4">
                          <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                            ₹
                            {(
                              Number(item.price) * item.quantity
                            ).toLocaleString("en-IN")}
                          </p>

                          <button
                            onClick={() => handleRemove(item.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md 
                            text-sm text-red-600 dark:text-red-400 
                            hover:bg-red-50 dark:hover:bg-red-950/30 
                            transition-colors"
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

            {/* Order Summary - Right Side */}
            <aside className="lg:col-span-5 xl:col-span-4">
              <div className="lg:sticky lg:top-6">
                <div
                  className="bg-white dark:bg-neutral-900 rounded-lg p-6 
                border border-neutral-200 dark:border-neutral-800"
                >
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
                    Order Summary
                  </h3>

                  {/* Pricing Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600 dark:text-neutral-400">
                        Subtotal ({items.length}{" "}
                        {items.length === 1 ? "item" : "items"})
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

                  {/* Divider */}
                  <div className="border-t border-neutral-200 dark:border-neutral-800 my-6"></div>

                  {/* Total */}
                  <div className="flex justify-between items-baseline mb-6">
                    <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                      ₹{formattedTotal}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      className="w-full py-3.5 bg-neutral-900 dark:bg-neutral-100 
                      hover:bg-neutral-800 dark:hover:bg-neutral-200 
                      text-white dark:text-neutral-900 
                      font-medium rounded-lg transition-colors"
                    >
                      Proceed to Checkout
                    </button>

                    <button
                      onClick={handleClearCart}
                      className="w-full py-3 text-neutral-600 dark:text-neutral-400 
                      hover:text-neutral-900 dark:hover:text-neutral-100 
                      hover:bg-neutral-100 dark:hover:bg-neutral-800 
                      font-medium rounded-lg transition-colors border border-neutral-200 dark:border-neutral-800"
                    >
                      Clear Cart
                    </button>
                  </div>

                  {/* Trust Badges */}
                  <div
                    className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800 
                  flex items-center justify-center gap-6 text-xs text-neutral-500 dark:text-neutral-400"
                  >
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
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

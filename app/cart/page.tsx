"use client";

import { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import userCartState from "@/lib/states/cart.state";

export default function CartPage() {
  const [cartItems, _] = useState([
    {
      productId: "1",
      name: "Semi-Mechanical Gaming Keyboard",
      price: 799,
      quantity: 1,
      image: "https://m.media-amazon.com/images/I/617q9MVCT9L._SX679_.jpg",
    },
    {
      productId: "2",
      name: "iPhone 16 Pro Max 256 GB: 5G",
      price: 134900,
      quantity: 1,
      image: "https://m.media-amazon.com/images/I/61giwQtR1qL._SX679_.jpg",
    },
  ]);

  const { items, removeItem, updateItemQuantity, setItems } = userCartState();
  useEffect(() => {
    setItems(cartItems);
  }, []);
  // const updateQty = (id: number, type: "inc" | "dec") => {
  //   setCartItems((prev) =>
  //     prev.map((item) =>
  //       item.id === id
  //         ? {
  //             ...item,
  //             qty: type === "inc" ? item.qty + 1 : Math.max(1, item.qty - 1),
  //           }
  //         : item
  //     )
  //   );
  // };

  // const deleteItem = (id: number) =>
  //   setCartItems((prev) => prev.filter((i) => i.id !== id));

  const formattedTotal = useMemo(() => {
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return total.toLocaleString("en-IN");
  }, [items]);

  return (
    <div className="bg-white dark:bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 text-neutral-900 dark:text-neutral-200">
        <header className="mb-6">
          <h1 className="text-3xl font-bold mb-1">Shopping Cart</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            {items.length} items in your cart
          </p>
        </header>

        <main className="grid md:grid-cols-3 gap-8">
          <section className="md:col-span-2 space-y-6">
            {items.map((item) => {
              if (item.quantity <= 0) return;
              return (
                <article
                  key={item.productId}
                  className="flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6 
                rounded-2xl bg-white dark:bg-neutral-900 
                border border-neutral-200 dark:border-neutral-800 shadow-sm"
                >
                  <img
                    src={cartItems[0].image}
                    alt={item.name}
                    className="w-24 h-24 md:w-28 md:h-28 rounded-xl object-cover"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">{item.name}</h2>

                      <span className="inline-block px-2 py-0.5 mt-1 text-xs rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                        ₹{item.price.toLocaleString("en-IN")} each
                      </span>

                      <p className="text-2xl font-bold mt-2">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-600 text-sm mt-3"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mt-4 md:mt-auto md:self-end">
                    <button
                      onClick={() => updateItemQuantity(item.productId, "dec")}
                      className="w-8 h-8 flex items-center justify-center rounded-full border dark:border-neutral-600 text-lg"
                    >
                      -
                    </button>

                    <span className="text-lg font-medium">{item.quantity}</span>

                    <button
                      onClick={() => updateItemQuantity(item.productId, "inc")}
                      className="w-8 h-8 flex items-center justify-center rounded-full border dark:border-neutral-600 text-lg"
                    >
                      +
                    </button>
                  </div>
                </article>
              );
            })}
          </section>

          <aside className="md:sticky md:top-28 self-start">
            <div
              className="p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800
                bg-white dark:bg-neutral-900 shadow-sm w-full min-h-[260px]"
            >
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Subtotal</span>
                  <span className="text-neutral-900 dark:text-neutral-100">
                    ₹{formattedTotal}
                  </span>
                </div>

                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>

                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Tax</span>
                  <span className="text-neutral-900 dark:text-neutral-100">
                    Calculated at checkout
                  </span>
                </div>
              </div>

              <hr className="my-4 border-neutral-200 dark:border-neutral-800" />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{formattedTotal}</span>
              </div>

              <button className="w-full mt-5 py-3 px-2 bg-blue-900 hover:bg-blue-950  dark:hover:bg-blue-800  text-white text-sm  rounded-sm font-semibold hover:opacity-90 transition">
                Proceed to Checkout
              </button>

              <p className="text-center text-xs mt-3 text-neutral-500 dark:text-neutral-400">
                Free shipping on all orders • Secure checkout
              </p>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}

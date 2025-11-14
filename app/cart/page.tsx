"use client";

import { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import userCartState from "@/lib/states/cart.state";
import { ProductInCart } from "@/lib/types/cart.types";

type CartItemWithImage = ProductInCart & {
  image: string;
};

export default function CartPage() {
  const [cartItems] = useState<CartItemWithImage[]>([
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
  }, [cartItems, setItems]);

  const formattedTotal = useMemo(() => {
    const total = items.reduce(
      (sum: number, item: ProductInCart) => sum + item.price * item.quantity,
      0
    );
    return total.toLocaleString("en-IN");
  }, [items]);

  return (
    <div className="bg-white dark:bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-10 text-neutral-900 dark:text-neutral-200">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Shopping Cart</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            {items.length} items in your cart
          </p>
        </header>

        <main className="grid md:grid-cols-3 gap-8">
          {/* LEFT SIDE */}
          <section className="md:col-span-2 space-y-6">
            {items.map((item: ProductInCart) => {
              if (item.quantity <= 0) return null;

              const image =
                cartItems.find((c) => c.productId === item.productId)?.image ||
                "";

              return (
                <article
                  key={item.productId}
                  className="flex md:flex-row items-start gap-4 md:gap-6 p-4 md:p-6 
                  rounded-2xl bg-white dark:bg-neutral-900 
                  border border-neutral-200 dark:border-neutral-800 
                  shadow-sm"
                >
                  <img
                    src={image}
                    alt={item.name}
                    className="w-24 h-24 md:w-28 md:h-28 rounded-xl object-cover"
                  />

                  <div className="flex-1 flex flex-col justify-between w-full">
                    <div className="flex flex-col gap-1">
                      <h2 className="text-lg font-semibold leading-tight">
                        {item.name}
                      </h2>

                      <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 w-fit">
                        ₹{item.price.toLocaleString("en-IN")} each
                      </span>

                      <p className="text-sm font-thin mt-1">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* REMOVE */}
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="flex items-center gap-1 text-red-500 hover:text-red-600 dark:hover:text-red-500 
                        bg-red-900/10 dark:bg-red-900/10 dark:hover:bg-red-900/20 
                        px-3 py-2 rounded text-sm"
                      >
                        <Trash2 size={14} /> Remove
                      </button>

                      {/* QTY */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            updateItemQuantity(item.productId, "dec")
                          }
                          className="w-8 h-8 flex items-center justify-center rounded-full 
                          border dark:border-neutral-600 text-lg"
                        >
                          -
                        </button>

                        <span className="text-lg font-medium w-6 text-center">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateItemQuantity(item.productId, "inc")
                          }
                          className="w-8 h-8 flex items-center justify-center rounded-full 
                          border dark:border-neutral-600 text-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          {/* RIGHT SIDE */}
          <aside className="md:sticky md:top-28 self-start">
            <div
              className="p-6 rounded-3xl 
              bg-white dark:bg-neutral-900 
              border border-neutral-200 dark:border-neutral-800
              shadow-md"
            >
              <h3 className="text-xl font-bold mb-5">Order Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Subtotal
                  </span>
                  <span className="font-medium">
                    ₹{formattedTotal}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Shipping
                  </span>
                  <span className="font-medium text-green-600">Free</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Tax
                  </span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <hr className="my-4 border-neutral-200 dark:border-neutral-800" />

              <div className="flex justify-between font-thin text-sm">
                <span>Total</span>
                <span>₹{formattedTotal}</span>
              </div>

              <button
                className="w-full mt-5 py-3 
                bg-blue-600 hover:bg-blue-700 
                dark:bg-blue-700 dark:hover:bg-blue-600
                text-white text-sm rounded-xl font-semibold
                transition-all shadow-md hover:shadow-lg"
              >
                Proceed to Checkout
              </button>

              <p className="text-center text-xs mt-3 text-neutral-500 dark:text-neutral-400">
                Free shipping • Secure checkout
              </p>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Trash2, ShoppingCart } from "lucide-react";

export default function FavoritesPage() {
  const initialFavorites = [
    {
      id: "iphone-15",
      name: "iPhone 15 Pro",
      price: 129999,
      image:
        "https://m.media-amazon.com/images/I/31Q14qzdoZL._SY300_SX300_QL70_FMwebp_.jpg",
      rating: 4.7,
      inventory: 5,
    },
    {
      id: "samsung-s23",
      name: "Samsung Galaxy S23",
      price: 89999,
      image:
        "https://m.media-amazon.com/images/I/41x507Qk7oL._SY300_SX300_QL70_FMwebp_.jpg",
      rating: 4.4,
      inventory: 0,
    },
    {
      id: "airpods-pro",
      name: "AirPods Pro (2nd gen)",
      price: 24999,
      image:
        "https://m.media-amazon.com/images/I/31LOtLrQydL._SX342_SY445_QL70_FMwebp_.jpg",
      rating: 4.6,
      inventory: 12,
    },
  ];

  // STATE
  const [favorites, setFavorites] = useState(initialFavorites);

  // REMOVE AN ITEM
  const removeItem = (id: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  // CLEAR ALL ITEMS
  const clearAll = () => {
    setFavorites([]);
  };

  const ProductCard = ({ item }: any) => (
    <article className="bg-neutral-100 dark:bg-neutral-950 rounded-2xl border border-neutral-300 dark:border-neutral-900 overflow-hidden shadow-sm">
      <div className="w-full h-48">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-contain p-4 bg-white dark:bg-neutral-950"
        />
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-base font-medium text-neutral-900 dark:text-neutral-50">
          {item.name}
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          ₹{item.price.toLocaleString()}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <button className="flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 border border-neutral-300 dark:border-neutral-600 text-sm font-medium text-neutral-900 dark:text-neutral-50">
            <ShoppingCart className="w-4 h-4" /> Add to cart
          </button>

          <button
            onClick={() => removeItem(item.id)}
            className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-600"
          >
            <Trash2 className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>
      </div>
    </article>
  );

  return (
    <main className="min-h-screen p-4 sm:p-6 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50">
      <section className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold flex items-center gap-3">
            Your Favorites
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Things you loved — saved in one place.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>

        {/* FOOTER */}
        <div className="mt-8 flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400">
          <div>
            {favorites.length} item{favorites.length > 1 ? "s" : ""} saved
          </div>

          {favorites.length > 0 && (
            <button
              onClick={clearAll}
              className="text-sm px-3 py-2 rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50"
            >
              Clear all
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

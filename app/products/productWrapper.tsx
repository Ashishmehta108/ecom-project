"use client";

import { useState } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { LayoutGrid, List } from "lucide-react";

export default function ProductsListWrapper({ products, userId ,admin}: any) {
  const [view, setView] = useState<"grid" | "list">("grid");
  

  return (
    <div className="space-y-5">
      {/* Toggle */}
      <div className="flex justify-end">
        <div
          className="flex items-center gap-1.5 bg-white dark:bg-neutral-900 
                        border border-neutral-200 dark:border-neutral-800 
                        rounded-full px-2 py-1 shadow-sm"
        >
          {/* Grid Button */}
          <button
            onClick={() => setView("grid")}
            className={`h-8 w-8 flex items-center justify-center rounded-full transition
                        ${
                          view === "grid"
                            ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                            : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>

          {/* List Button */}
          <button
            onClick={() => setView("list")}
            className={`h-8 w-8 flex items-center justify-center rounded-full transition
                        ${
                          view === "list"
                            ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                            : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Products layout */}
      <div
        className={
          view === "grid"
            ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            : "flex flex-col gap-4"
        }
      >
        {products.map((product: any) => (
          <div key={product.id} className={view === "list" ? "w-full" : ""}>
            <ProductCard
              product={product}
              userId={userId}
              listView={view === "list"}
              admin={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

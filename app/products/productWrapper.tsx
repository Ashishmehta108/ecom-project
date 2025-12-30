"use client";
import { useState, useEffect } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { LayoutGrid, List } from "lucide-react";

export default function ProductsListWrapper({ products, userId, admin }: any) {
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setView("list");
      }
    };

    handleResize(); // Run once on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full px-3 sm:px-4 lg:px-6">
      {/* Toggle Controls — hidden on mobile */}
      <div className="hidden sm:flex justify-end mb-4 gap-2">
        <button
          onClick={() => setView("grid")}
          aria-label="Grid View"
          className={`
            h-8 w-8 flex items-center justify-center rounded-md border transition
            ${
              view === "grid"
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-neutral-900"
                : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }
          `}
        >
          <LayoutGrid size={18} />
        </button>

        <button
          onClick={() => setView("list")}
          aria-label="List View"
          className={`
            h-8 w-8 flex items-center justify-center rounded-md border transition
            ${
              view === "list"
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-neutral-900"
                : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }
          `}
        >
          <List size={18} />
        </button>
      </div>

      {/* Product List */}
      <div
        className={`
          transition-all duration-300 gap-3 sm:gap-4
          ${
            view === "grid"
              ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              : "flex flex-col"
          }
        `}
      >
        {products.map((product: any) => (
          <ProductCard
            key={product.id}
            product={product}
            userId={userId}
            admin={admin}
            view={view}
          />
        ))}
      </div>
    </div>
  );
}

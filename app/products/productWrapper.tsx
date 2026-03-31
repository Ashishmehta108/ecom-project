"use client";
import { useState, useEffect } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { LayoutGrid, List } from "lucide-react";

export default function ProductsListWrapper({ products, userId }: any) {
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setView("list");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full">
      {/* Toggle Controls */}
      <div className="hidden sm:flex justify-end mb-6">
        <div className="inline-flex items-center gap-0.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 p-1">
          <button
            onClick={() => setView("grid")}
            aria-label="Grid View"
            aria-pressed={view === "grid"}
            className={`
              h-7 w-7 flex items-center justify-center rounded-md transition-all duration-200
              ${view === "grid"
                ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm"
                : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300"
              }
            `}
          >
            <LayoutGrid size={15} />
          </button>
          <button
            onClick={() => setView("list")}
            aria-label="List View"
            aria-pressed={view === "list"}
            className={`
              h-7 w-7 flex items-center justify-center rounded-md transition-all duration-200
              ${view === "list"
                ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm"
                : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300"
              }
            `}
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* Product List */}
      <div
        className={`
          transition-all duration-300
          ${view === "grid"
            ? "grid gap-4 grid-cols-2 sm:grid-cols-3"
            : "flex flex-col gap-3"
          }
        `}
      >
        {products.map((product: any, i: number) => (
          <div
            key={product.id}
            className="animate-in fade-in slide-in-from-bottom-2 duration-300"
            style={{ animationDelay: `${i * 30}ms`, animationFillMode: "both" }}
          >
            <ProductCard
              product={product}
              userId={userId}
              listView={view === "list" ? true : false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
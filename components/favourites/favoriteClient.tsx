"use client";

import { useEffect } from "react";
import { useFavouriteState } from "@/lib/states/favorite.state";
import { Trash2, Heart } from "lucide-react";
import { Button } from "../ui/button";
import AddToCartButton from "../cart/addToCart";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/app/context/languageContext";

const t = {
  en: {
    heading: "Your Favorites",
    emptyTitle: "No saved items yet",
    emptyDesc: "Save products you love by tapping the heart icon on any product.",
    browse: "Browse Products",
  },
  pt: {
    heading: "Seus Favoritos",
    emptyTitle: "Nenhum item salvo ainda",
    emptyDesc: "Salve produtos clicando no ícone de coração em qualquer produto.",
    browse: "Ver Produtos",
  },
};

export default function FavoritesClient({ initialItems }: { initialItems: any[] }) {
  const { locale } = useLanguage();
  const text = t[locale];

  const { items, toggleFavourite, setFavouriteItems } = useFavouriteState();

  useEffect(() => {
    setFavouriteItems(initialItems);
  }, [initialItems, setFavouriteItems]);

  const hasItems = items.length > 0;

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white sm:text-3xl">
            {text.heading}
          </h1>
          {hasItems && (
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
          )}
        </div>

        {/* Empty State */}
        {!hasItems ? (
          <div className="flex flex-col items-center justify-center text-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 py-20 px-6">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800">
              <Heart className="h-10 w-10 text-neutral-500 dark:text-neutral-400" />
            </div>
            <h2 className="text-xl font-medium text-neutral-900 dark:text-white">
              {text.emptyTitle}
            </h2>
            <p className="mt-2 max-w-md text-sm text-neutral-600 dark:text-neutral-400">
              {text.emptyDesc}
            </p>
            <Link href="/products">
              <Button className="mt-6">{text.browse}</Button>
            </Link>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {items.map((item) => {
              const localizedName = item.name?.[locale] || item.name?.en;
              const imageUrl = item.image || "/placeholder.png";
              const price = item.price || 0;

              return (
                <article
                  key={item.productId}
                  className="group flex flex-col rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
                >
                  <Link href={`/products/${item.productId}`}>
                    <div className="relative aspect-square w-full bg-neutral-100 dark:bg-neutral-950 overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={localizedName}
                        fill
                        className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex flex-col flex-1 px-3 pb-3 pt-2">
                    <h3 className="text-sm font-medium leading-tight text-neutral-900 dark:text-white line-clamp-2">
                      {localizedName}
                    </h3>

                    <div className="mt-auto pt-2">
                      <span className="text-base font-semibold text-neutral-900 dark:text-white">
                        ₹{price.toLocaleString()}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <AddToCartButton productId={item.productId} />
                      <Button
                        onClick={() => toggleFavourite(item)}
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

"use client";
import { useEffect } from "react";
import { useFavouriteState } from "@/lib/states/favorite.state";
import { Trash2, Heart } from "lucide-react";
import { Button } from "../ui/button";
import AddToCartButton from "../cart/addToCart";

export default function FavoritesClient({
  initialItems,
}: {
  initialItems: any[];
}) {
  const { items, toggleFavourite } = useFavouriteState();
  console.log(initialItems);
  useEffect(() => {
    if (items.length === 0 && initialItems.length > 0) {
      initialItems.forEach((item) => toggleFavourite(item));
    }
  }, []);

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white sm:text-3xl">
            Your Favorites
          </h1>
          {items.length > 0 && (
            <p className="mt-1.5 text-sm text-neutral-600 dark:text-neutral-400">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
          )}
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div
            className="
    flex min-h-[400px] flex-col items-center justify-center
    rounded-lg 
    border-2 border-dashed border-neutral-200 dark:border-neutral-800
    bg-neutral-50/50 dark:bg-neutral-900/50
    px-6 py-12 text-center sm:py-16
  "
          >
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 sm:h-20 sm:w-20">
              <Heart className="h-8 w-8 text-neutral-400 dark:text-neutral-500 sm:h-10 sm:w-10" />
            </div>
            <h2 className="text-lg font-medium text-neutral-900 dark:text-white sm:text-xl">
              Your favorites is empty
            </h2>
            <p className="mt-2 max-w-md text-sm text-neutral-600 dark:text-neutral-400 sm:text-base">
              Save items you love by clicking the heart icon. They'll appear
              here for easy access.
            </p>
          </div>
        ) : (
          /* Grid */
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:gap-5">
            {items.map((item) => (
              <article
                key={item.productId}
                className="group relative flex flex-col overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-shadow duration-200 hover:shadow-md dark:hover:shadow-neutral-900/50"
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-neutral-50 dark:bg-neutral-900">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full mix-blend-multiply cursor-pointer object-contain p-4 transition-transform duration-300 group-hover:scale-105 sm:p-6"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col  p-3 sm:p-4">
                  <h3 className="text-sm font-medium leading-tight text-neutral-900 dark:text-white line-clamp-2 sm:text-base">
                    {item.name}
                  </h3>

                  <div className="mt-auto pt-3 flex items-center justify-between">
                    <p className="text-base font-semibold text-neutral-900 dark:text-white sm:text-lg">
                      €{item.price.toLocaleString()}
                    </p>

                    <Button
                      onClick={() => toggleFavourite(item)}
                      className=""
                      variant={"destructive"}
                      aria-label={`Remove ${item.name} from favorites`}
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 cursor-pointer" />
                      <span>Remove</span>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

import { Skeleton } from "@/components/ui/skeleton";
export default function FavoritesLoading() {
  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-3" />
          <Skeleton className="h-5 w-40" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, index) => (
            <article
              key={index}
              className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm"
            >
              {/* Image Skeleton */}
              <div className="aspect-square bg-neutral-100 dark:bg-neutral-800 p-6">
                <Skeleton className="h-full w-full" />
              </div>

              {/* Content Skeleton */}
              <div className="flex flex-1 flex-col p-5">
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-5 w-3/4 mb-3" />
                <Skeleton className="h-6 w-24 mb-4" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

"use client";

import Container from "@/components/giobal/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingProductsPage() {
  return (
    <div className=" bg-white dark:bg-neutral-950">
      <Container className="py-8 md:py-12">

        {/* HEADER */}
        <div className="mb-8 space-y-6">

          <div className="flex items-baseline justify-between">
            <div className="space-y-2">
              <Skeleton className="h-7 w-40 rounded" />
              <Skeleton className="h-4 w-24 rounded" />
            </div>
            <Skeleton className="h-4 w-24 rounded" />
          </div>

          {/* Filters Row */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-9 w-24 rounded-full"
                />
              ))}
            </div>

            {/* Sort */}
            <Skeleton className="h-9 w-32 rounded-full" />
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900"
            >
              <Skeleton className="w-full h-48 rounded-lg mb-4" />

              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4 rounded" />
                <Skeleton className="h-4 w-1/2 rounded" />
                <Skeleton className="h-4 w-2/3 rounded" />
              </div>

              <Skeleton className="h-10 w-full rounded-lg mt-4" />
            </div>
          ))}
        </div>

      </Container>
    </div>
  );
}

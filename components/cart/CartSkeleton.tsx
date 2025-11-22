"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function CartSkeleton() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex items-center gap-3 mb-8">
          <Skeleton className="w-8 h-8 rounded-md" />
          <Skeleton className="h-7 w-40 rounded" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 xl:col-span-8 space-y-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-neutral-900 rounded-lg p-5 border border-neutral-200 dark:border-neutral-800"
              >
                <div className="flex gap-5">
                  <Skeleton className="w-24 h-24 rounded-lg" />

                  {/* Content */}
                  <div className="flex-1 space-y-4">
                    <Skeleton className="h-5 w-2/3 rounded" />
                    <Skeleton className="h-4 w-24 rounded" />

                    <div className="flex justify-between">
                      {/* Qty buttons */}
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded-md" />
                        <Skeleton className="w-8 h-8 rounded-md" />
                        <Skeleton className="w-8 h-8 rounded-md" />
                      </div>

                      {/* Price */}
                      <Skeleton className="h-6 w-20 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE — Order summary */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 border border-neutral-200 dark:border-neutral-800">
              <Skeleton className="h-6 w-40 mb-6 rounded" />

              <div className="space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-4 w-16 rounded" />
                </div>

                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20 rounded" />
                  <Skeleton className="h-4 w-12 rounded" />
                </div>

                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16 rounded" />
                  <Skeleton className="h-4 w-10 rounded" />
                </div>
              </div>

              {/* Checkout buttons */}
              <Skeleton className="h-10 w-full mt-8 rounded" />
              <Skeleton className="h-10 w-full mt-3 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

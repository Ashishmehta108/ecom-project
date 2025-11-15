import { Skeleton } from "../ui/skeleton";

export function UsersTableSkeleton() {
  return (
    <div className="rounded-xl border border-neutral-300 dark:border-neutral-800 bg-card shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">Users</h2>

      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
}

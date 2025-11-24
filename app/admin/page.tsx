

import AdminSalesDashboard from "@/components/admin/adminSalesDashboard";
import { getHybridAdminAnalytics as getAdminAnalytics } from "@/lib/actions/admin-actions/admin-analytic";
import { getUserSession } from "@/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function AdminPage() {
  const user = await getUserSession();

  if (!user?.session) {
    return redirect("/admin/login");
  }

  if (user?.user.role !== "admin" && user?.session) {
    return redirect("/");
  }

  if (user?.user.role !== "admin" && user?.session == null) {
    return redirect("/login");
  }

  const analytics = await getAdminAnalytics(30); 

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<DashboardSkeleton />}>
        <AdminSalesDashboard analytics={analytics} />
      </Suspense>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-neutral-200 dark:bg-neutral-800 rounded" />
        <div className="h-4 w-96 bg-neutral-200 dark:bg-neutral-800 rounded" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-xl"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-24 bg-neutral-200 dark:bg-neutral-800 rounded-xl"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="h-96 bg-neutral-200 dark:bg-neutral-800 rounded-xl"
          />
        ))}
      </div>
    </div>
  );
}

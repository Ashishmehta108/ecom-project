

import AdminDashboardPage from "@/components/admin/AdminDashboardPage";
import { getHybridAdminAnalytics as getAdminAnalytics } from "@/lib/actions/admin-actions/admin-analytic";
import { getUserSession } from "@/server";
import { redirect } from "next/navigation";

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

  return <AdminDashboardPage analytics={analytics} />;
}

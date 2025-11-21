import AdminDashboard from "@/components/admin/adminhomepage";
import { listUsers } from "@/lib/actions/admin-actions/actions";
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
  const users = await listUsers();
  return (
    <div>
      <AdminDashboard
        //@ts-ignore
        users={users.users || []}
      />
    </div>
  );
}

import AdminDashboard from "@/components/admin/adminhomepage";
import { listUsers } from "@/lib/actions/admin-actions/actions";

export default async function AdminPage() {
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

import UsersTable, { AppUser } from "@/components/admin/users-table";
import { listUsers } from "@/lib/actions/admin-actions/actions";

export default async function AdminDashboard() {
  const users = await listUsers();

  return (
    <UsersTable
      //@ts-ignore
      users={users.users}
    />
  );
}

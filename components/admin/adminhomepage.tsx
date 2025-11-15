import { AppUser } from "./users-table";

export default function AdminDashboard({ users }: { users: AppUser[] }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-xl bg-card border border-neutral-300 dark:border-neutral-800 shadow-sm">
          <p className="text-neutral-500 text-sm">Total Users</p>
          <h2 className="text-3xl font-semibold mt-1">{users.length}</h2>
        </div>

        <div className="p-5 rounded-xl bg-card border border-neutral-300 dark:border-neutral-800 shadow-sm">
          <p className="text-neutral-500 text-sm">Orders</p>
          <h2 className="text-3xl font-semibold mt-1">182</h2>
        </div>

        <div className="p-5 rounded-xl bg-card border border-neutral-300 dark:border-neutral-800 shadow-sm">
          <p className="text-neutral-500 text-sm">Revenue</p>
          <h2 className="text-3xl font-semibold mt-1">$12,450</h2>
        </div>
      </div>

      {/* Users Table */}
    </div>
  );
}

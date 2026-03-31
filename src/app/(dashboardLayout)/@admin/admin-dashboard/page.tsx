import { LayoutDashboard } from "lucide-react";

export default async function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <LayoutDashboard className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your platform's performance and statistics
          </p>
        </div>
      </div>

      {/* <AdminDashboardClient
        users={users}
        orders={orders}
        categories={categories}
      /> */}
    </div>
  );
}

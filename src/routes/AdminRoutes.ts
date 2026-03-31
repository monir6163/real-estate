import { Route } from "@/types";

export const AdminRoutes: Route[] = [
  {
    title: "Admin Dashboard",
    items: [
      {
        title: "Dashboard",
        url: "/admin-dashboard",
        icon: "LayoutDashboard",
        isActive: true,
      },
      {
        title: "Categories",
        url: "/admin-dashboard/all-categories",
        icon: "Layers",
      },
      {
        title: "All Users",
        url: "/admin-dashboard/all-users",
        icon: "Users",
      },
      {
        title: "All Orders",
        url: "/admin-dashboard/all-orders",
        icon: "ShoppingCart",
      },
    ],
  },
];

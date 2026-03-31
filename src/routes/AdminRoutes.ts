import { Route } from "@/types";

export const AdminRoutes: Route[] = [
  {
    title: "Admin Dashboard",
    items: [
      {
        title: "Dashboard",
        url: "/admin-dashboard",
        isActive: true,
      },
      {
        title: "Categories",
        url: "/admin-dashboard/all-categories",
      },
      {
        title: "All Users",
        url: "/admin-dashboard/all-users",
      },
      {
        title: "All Orders",
        url: "/admin-dashboard/all-orders",
      },
    ],
  },
];

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
        title: "All Properties",
        url: "/admin-dashboard/all-properties",
        icon: "Home",
      },
      {
        title: "All Users",
        url: "/admin-dashboard/all-users",
        icon: "Users",
      },
      {
        title: "All Bookings",
        url: "/admin-dashboard/all-bookings",
        icon: "Calendar",
      },
      {
        title: "All Reviews",
        url: "/admin-dashboard/all-reviews",
        icon: "Star",
      },
      {
        title: "Profile",
        url: "/admin-dashboard/profile",
        icon: "User",
      },
    ],
  },
];

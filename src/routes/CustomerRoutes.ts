import { Route } from "@/types";

export const CustomerRoutes: Route[] = [
  {
    title: "Customer Dashboard",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: "LayoutDashboard",
      },
      {
        title: "My Bookings",
        url: "/dashboard/bookings",
        icon: "Calendar",
      },
      {
        title: "Payments",
        url: "/dashboard/payments",
        icon: "CreditCard",
      },
      {
        title: "My Profile",
        url: "/dashboard/profile",
        icon: "User",
      },
    ],
  },
];

import { Route } from "@/types";

export const CustomerRoutes: Route[] = [
  {
    title: "Customer Dashboard",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
      },
      {
        title: "My Bookings",
        url: "/dashboard/bookings",
      },
      {
        title: "Payments",
        url: "/dashboard/payments",
      },
      {
        title: "My Profile",
        url: "/dashboard/profile",
      },
    ],
  },
];

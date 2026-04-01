import { Route } from "@/types";

export const ProviderRoutes: Route[] = [
  {
    title: "Agent Dashboard",
    items: [
      {
        title: "Dashboard",
        url: "/agent-dashboard",
        icon: "LayoutDashboard",
      },
      {
        title: "Create Property",
        url: "/agent-dashboard/create-property",
        icon: "Plus",
      },
      {
        title: "My Properties",
        url: "/agent-dashboard/my-properties",
        icon: "Home",
      },
      {
        title: "My Bookings",
        url: "/agent-dashboard/my-bookings",
        icon: "Calendar",
      },
      {
        title: "Reviews",
        url: "/agent-dashboard/reviews",
        icon: "Star",
      },
      {
        title: "Profile",
        url: "/agent-dashboard/profile",
        icon: "User",
      },
    ],
  },
];

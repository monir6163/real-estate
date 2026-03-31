import { Route } from "@/types";

export const ProviderRoutes: Route[] = [
  {
    title: "Provider Dashboard",
    items: [
      {
        title: "Dashboard",
        url: "/provider-dashboard",
      },
      {
        title: "Create Shop",
        url: "/provider-dashboard/create-shop",
      },
      {
        title: "Meals",
        url: "/provider-dashboard/meals",
      },
      {
        title: "My Orders",
        url: "/provider-dashboard/my-orders",
      },
    ],
  },
];

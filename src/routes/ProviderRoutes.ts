import { Route } from "@/types";

export const ProviderRoutes: Route[] = [
  {
    title: "Agent Dashboard",
    items: [
      {
        title: "Dashboard",
        url: "/agent-dashboard",
      },
      {
        title: "Create Shop",
        url: "/agent-dashboard/create-shop",
      },
      {
        title: "Meals",
        url: "/agent-dashboard/meals",
      },
      {
        title: "My Orders",
        url: "/agent-dashboard/my-orders",
      },
    ],
  },
];

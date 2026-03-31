import { Route } from "./route.types";
export type { Route };

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: "admin" | "customer" | "provider";
  status: "active" | "inactive";
  phone?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  image?: string;
}

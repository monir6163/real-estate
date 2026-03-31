export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
  AGENT: "AGENT",
} as const;

export type Roles = (typeof ROLES)[keyof typeof ROLES];

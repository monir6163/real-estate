export const UserStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  SUSPENDED: "SUSPENDED",
} as const;

export type UserStatusType = (typeof UserStatus)[keyof typeof UserStatus];

export const UserStatusColors: Record<UserStatusType, string> = {
  ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  INACTIVE: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  SUSPENDED:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
};

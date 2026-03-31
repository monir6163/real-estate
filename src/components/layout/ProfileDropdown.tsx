import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Roles } from "@/constants/Roles";
import { LayoutDashboardIcon, ShoppingBagIcon } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "../ui/avatar";
import Logout from "./Logout";

export function ProfileDropdown({ user }: { user: any }) {
  const role: Roles = user?.role;

  const roleBasedLinks = {
    admin: [
      {
        href: "/admin-dashboard",
        label: "Admin Dashboard",
        icon: LayoutDashboardIcon,
      },
    ],
    provider: [
      {
        href: "/provider-dashboard",
        label: "Provider Dashboard",
        icon: LayoutDashboardIcon,
      },
    ],
    customer: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
      { href: "/dashboard/orders", label: "My Orders", icon: ShoppingBagIcon },
    ],
  };

  const links =
    roleBasedLinks[role as keyof typeof roleBasedLinks] ||
    roleBasedLinks.customer;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer border-2 border-red-600 transition hover:border-red-600">
          <AvatarImage
            src={user?.image || "https://github.com/shadcn.png"}
            alt={user?.name || "User"}
          />
          <AvatarFallback>
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
          <AvatarBadge className="bg-green-600 dark:bg-green-800" />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <DropdownMenuItem
              key={link.href}
              asChild
              className="cursor-pointer"
            >
              <Link href={link.href}>
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Logout />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

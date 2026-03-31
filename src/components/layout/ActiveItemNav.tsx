"use client";

import * as Icons from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

export default function ActiveItemNav({ items }: { items: any[] }) {
  const pathname = usePathname();
  const url = ["/dashboard", "/provider-dashboard", "/admin-dashboard"];

  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    const Icon = Icons[iconName as keyof typeof Icons] as any;
    return Icon ? <Icon className="w-4 h-4" /> : null;
  };

  return (
    <>
      {items.map((item: any) => {
        const isActive =
          pathname === item.url ||
          (pathname.startsWith(item.url + "/") &&
            item.url !== url[0] &&
            item.url !== url[1] &&
            item.url !== url[2]);

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={isActive}>
              <Link href={item.url} className="flex items-center gap-2">
                {getIcon(item.icon)}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </>
  );
}

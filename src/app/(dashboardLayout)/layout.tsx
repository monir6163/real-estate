import { AppSidebar } from "@/components/layout/app-sidebar";
import { ProfileDropdown } from "@/components/layout/ProfileDropdown";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ROLES } from "@/constants/Roles";
import { userService } from "@/services/user.service";
import Link from "next/link";
export const dynamic = "force-dynamic";
export default async function DashboardLayout({
  admin,
  customer,
  provider,
}: {
  admin: React.ReactNode;
  customer: React.ReactNode;
  provider: React.ReactNode;
}) {
  const { data } = await userService.getSession();
  return (
    <SidebarProvider>
      <AppSidebar user={data?.user?.role} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link href="/">Website</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {data?.user?.role === ROLES.ADMIN
                    ? "Admin Dashboard"
                    : data?.user?.role === ROLES.CUSTOMER
                      ? "Dashboard"
                      : "Provider Dashboard"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <ProfileDropdown user={data?.user} />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {data?.user?.role === ROLES.ADMIN
            ? admin
            : data?.user?.role === ROLES.CUSTOMER
              ? customer
              : provider}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

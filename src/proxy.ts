import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getUserSession } from "./actions/users";
import { ROLES } from "./constants/Roles";
import { publicRoutes } from "./routes/PublicRoutes";

const roleDashboardMap: Record<string, string> = {
  [ROLES.ADMIN]: "/admin-dashboard",
  [ROLES.USER]: "/dashboard",
  [ROLES.AGENT]: "/agent-dashboard",
};
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const { data } = await getUserSession();
  const user = data?.user;
  const isAuthenticated = !!user;

  if (!isAuthenticated && publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const userRole = user?.role;
  const allowedDashboard = roleDashboardMap[userRole];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL(allowedDashboard, request.url));
  }

  if (pathname.startsWith("/admin-dashboard") && userRole !== ROLES.ADMIN) {
    return NextResponse.redirect(new URL(allowedDashboard, request.url));
  }

  if (pathname.startsWith("/dashboard") && userRole !== ROLES.USER) {
    return NextResponse.redirect(new URL(allowedDashboard, request.url));
  }

  if (pathname.startsWith("/agent-dashboard") && userRole !== ROLES.AGENT) {
    return NextResponse.redirect(new URL(allowedDashboard, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin-dashboard/:path*",
    "/agent-dashboard/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/become-agent",
    "/orders/:path*",
  ],
};

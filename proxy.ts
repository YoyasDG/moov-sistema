import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/constants";

const protectedDashboardPaths = ["/dashboard", "/students", "/groups", "/payments", "/enrollments", "/finance", "/notifications"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  const wantsDashboard = protectedDashboardPaths.some((path) => pathname.startsWith(path));
  const wantsPortal = pathname.startsWith("/portal");
  const wantsLogin = pathname.startsWith("/login");

  if (!token && (wantsDashboard || wantsPortal)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && wantsLogin) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*", "/students/:path*", "/groups/:path*", "/payments/:path*", "/enrollments/:path*", "/finance/:path*", "/notifications/:path*", "/portal/:path*"],
};

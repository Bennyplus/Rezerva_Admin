import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // We only care about /admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('accessToken')?.value;

    // Auth routes (login, register, etc.) inside /admin
    const isAuthRoute = pathname.startsWith('/admin/login') ||
      pathname.startsWith('/admin/register') ||
      pathname.startsWith('/admin/create-password');

    // If no token and trying to access a protected route
    if (!token && !isAuthRoute) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // If token exists and trying to access an auth route (e.g. login), redirect to dashboard
    if (token && isAuthRoute) {
      const dashboardUrl = new URL('/admin', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Apply to /admin and all its subpaths
  matcher: ['/admin/:path*'],
};

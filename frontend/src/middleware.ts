import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Shudhu /admin routes check korbo (login page bade)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Cookie theke user info check korbo
    const userCookie = request.cookies.get('bdneeds_session');

    if (!userCookie) {
      // Cookie nai — login page e redirect
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const user = JSON.parse(decodeURIComponent(userCookie.value));
      if (user?.role !== 'ADMIN') {
        // ADMIN na — home e redirect
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch {
      // Cookie invalid — login page e redirect
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

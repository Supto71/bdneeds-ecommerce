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
      if (user?.role !== 'ADMIN' && user?.role !== 'MODERATOR') {
        // ADMIN ba MODERATOR na — home e redirect
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch {
      // Cookie invalid — login page e redirect
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect API routes from MODERATOR mutations except for orders
  if (pathname.startsWith('/api/') && request.method !== 'GET') {
    const userCookie = request.cookies.get('bdneeds_session');
    if (userCookie) {
      try {
        const user = JSON.parse(decodeURIComponent(userCookie.value));
        if (user?.role === 'MODERATOR') {
          // Allow PATCH /api/orders/[id] for moderators
          const isOrderUpdate = pathname.startsWith('/api/orders/') && request.method === 'PATCH';
          if (!isOrderUpdate) {
            return NextResponse.json({ error: 'Moderators are not allowed to perform this action' }, { status: 403 });
          }
        }
      } catch (e) {
        // Ignore JSON parse errors here, let the API route handle invalid auth if needed
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};

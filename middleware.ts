import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'gm_session';

function getSessionUser(req: NextRequest) {
  const cookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!cookie) return null;

  try {
    const raw = atob(cookie);
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.id || !parsed.role) return null;
    if (parsed.exp && parsed.exp < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const user = getSessionUser(req);

  // 1. Admin login page
  if (pathname === '/admin/login') {
    if (user && user.role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    return NextResponse.next();
  }

  // 2. User login page
  if (pathname === '/login') {
    if (user && user.role === 'user') {
      return NextResponse.redirect(new URL('/user/dashboard', req.url));
    }
    if (user && user.role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    return NextResponse.next();
  }

  // 3. Admin protected routes: /admin/*
  if (pathname.startsWith('/admin')) {
    if (!user) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('redirect', pathname + search);
      return NextResponse.redirect(loginUrl);
    }

    if (user.role !== 'admin') {
      // Normal user directly opening admin URL -> Reject access & redirect to user dashboard
      const userDashboardUrl = new URL('/user/dashboard', req.url);
      userDashboardUrl.searchParams.set('error', 'admin_access_denied');
      return NextResponse.redirect(userDashboardUrl);
    }

    return NextResponse.next();
  }

  // 4. User protected routes: /user/*
  if (pathname.startsWith('/user')) {
    if (!user) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', pathname + search);
      return NextResponse.redirect(loginUrl);
    }

    if (user.role !== 'user') {
      // Admin opening user URL -> Redirect to admin dashboard
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }

    return NextResponse.next();
  }

  // 5. Legacy / root redirects
  if (pathname === '/' || pathname === '/dashboard') {
    if (user) {
      return NextResponse.redirect(
        new URL(user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard', req.url)
      );
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Legacy report route
  if (pathname === '/report') {
    if (user?.role === 'user') return NextResponse.redirect(new URL('/user/report', req.url));
    if (user?.role === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Legacy issues routes
  if (pathname === '/issues') {
    if (user?.role === 'admin') return NextResponse.redirect(new URL('/admin/issues', req.url));
    if (user?.role === 'user') return NextResponse.redirect(new URL('/user/issues', req.url));
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (pathname.startsWith('/issues/')) {
    const issueId = pathname.replace('/issues/', '');
    if (user?.role === 'admin') return NextResponse.redirect(new URL(`/admin/issues/${issueId}`, req.url));
    if (user?.role === 'user') return NextResponse.redirect(new URL(`/user/issues/${issueId}`, req.url));
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Legacy eco-bounty route
  if (pathname === '/eco-bounty') {
    if (user?.role === 'user') return NextResponse.redirect(new URL('/user/eco-bounty', req.url));
    if (user?.role === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Legacy assistant route
  if (pathname === '/assistant') {
    if (user?.role === 'user') return NextResponse.redirect(new URL('/user/assistant', req.url));
    if (user?.role === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Legacy analytics route
  if (pathname === '/analytics') {
    if (user?.role === 'admin') return NextResponse.redirect(new URL('/admin/analytics', req.url));
    if (user?.role === 'user') return NextResponse.redirect(new URL('/user/dashboard', req.url));
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes (handled directly with proper 401/403 JSON responses)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, svg, icons
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

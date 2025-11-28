import { NextResponse } from 'next/server';

/**
 * Middleware Configuration
 * Handles authentication and route protection
 */

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/coming-soon',
];

// Auth routes (redirect to dashboard if already authenticated)
const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

// All public routes (including auth routes)
const ALL_PUBLIC_ROUTES = [...PUBLIC_ROUTES, ...AUTH_ROUTES];

export function middleware(request) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Check if route is public
  const isPublicRoute = ALL_PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users to login (except public routes)
  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};

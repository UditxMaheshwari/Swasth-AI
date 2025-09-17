import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define which routes require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/family-vault',
  '/health-check',
  '/health-insights',
  // Add other protected routes here
];

// Define which routes are accessible only for non-authenticated users
const authRoutes = [
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
];

export async function middleware(req: NextRequest) {
  const response = NextResponse.next();
  const path = req.nextUrl.pathname;
  
  // Check for auth token in cookies
  const hasAuthToken = req.cookies.has('supabase-auth-token') || 
                      req.cookies.has('sb-auth-token') ||
                      req.cookies.get('supabase-auth-token')?.value ||
                      Array.from(req.cookies.getAll()).some(cookie => 
                        cookie.name.includes('supabase') && 
                        cookie.name.includes('auth')
                      );
  
  // If the route requires authentication and user doesn't seem authenticated
  if (protectedRoutes.some(route => path.startsWith(route)) && !hasAuthToken) {
    const redirectUrl = new URL('/auth/login', req.url);
    redirectUrl.searchParams.set('redirectTo', path);
    return NextResponse.redirect(redirectUrl);
  }

  // If the route is for non-authenticated users and user seems authenticated
  if (authRoutes.some(route => path.startsWith(route)) && hasAuthToken) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
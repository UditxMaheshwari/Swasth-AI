import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/family-vault',
    '/health-check',
    '/health-insights',
  ];
  const authRoutes = [
    '/auth/login',
    '/auth/signup',
    '/auth/forgot-password',
  ];
  const path = req.nextUrl.pathname;

  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    // Debug logging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Middleware] ${path} - Session: ${session?.user?.email || 'None'}`);
      if (error) console.log(`[Middleware] Error:`, error.message);
    }
    
    // Handle session errors gracefully
    if (error) {
      console.error('Middleware session error:', error.message);
      // If there's an error getting session and we're on a protected route, redirect to login
      if (protectedRoutes.some(route => path.startsWith(route))) {
        const redirectUrl = new URL('/auth/login', req.url);
        redirectUrl.searchParams.set('redirectTo', path);
        return NextResponse.redirect(redirectUrl);
      }
      return response;
    }

    // Redirect unauthenticated users from protected routes
    if (protectedRoutes.some(route => path.startsWith(route)) && !session) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Middleware] Redirecting ${path} to login - no session`);
      }
      const redirectUrl = new URL('/auth/login', req.url);
      redirectUrl.searchParams.set('redirectTo', path);
      return NextResponse.redirect(redirectUrl);
    }

    // Redirect authenticated users from auth routes to dashboard
    if (authRoutes.some(route => path.startsWith(route)) && session) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Middleware] Redirecting ${path} to dashboard - has session`);
      }
      // Check if there's a redirectTo parameter
      const redirectTo = req.nextUrl.searchParams.get('redirectTo');
      if (redirectTo && protectedRoutes.some(route => redirectTo.startsWith(route))) {
        return NextResponse.redirect(new URL(redirectTo, req.url));
      }
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

  } catch (error) {
    console.error('Middleware error:', error);
    // On error, allow the request to continue
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
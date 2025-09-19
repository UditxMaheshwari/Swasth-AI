import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export function createClient() {
  // Create a server client with cookie handling
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return ''
        },
        set(name: string, value: string, options: CookieOptions) {
          // No-op for middleware
        },
        remove(name: string, options: CookieOptions) {
          // No-op for middleware
        },
      },
    }
  )
}

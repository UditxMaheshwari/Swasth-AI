// /app/api/auth/session/route.js
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createSupabaseServerClient } from '@/lib/supabaseClient'

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createSupabaseServerClient(cookieStore)

    // Get current session
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      session,
      user: session?.user || null,
    })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

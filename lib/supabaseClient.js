// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'
import { createBrowserClient, createServerClient } from '@supabase/ssr'

// Runtime-safe environment variable access
function getSupabaseConfig() {
  // Only access environment variables at runtime
  const supabaseUrl = typeof window !== 'undefined' 
    ? process.env.NEXT_PUBLIC_SUPABASE_URL 
    : process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL

  const supabaseAnonKey = typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  return { supabaseUrl, supabaseAnonKey }
}

// Validate Supabase configuration
function validateSupabaseConfig(url, key) {
  if (!url || !key) {
    console.warn('Supabase configuration missing. Some features may not work.')
    return false
  }

  // Check if URL is a valid HTTP/HTTPS URL
  try {
    const urlObj = new URL(url)
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      console.warn('Invalid Supabase URL protocol. Must be HTTP or HTTPS.')
      return false
    }
    return true
  } catch (error) {
    console.warn('Invalid Supabase URL format:', error.message)
    return false
  }
}

// Browser client for client-side operations
let browserClient = null

export function createSupabaseBrowserClient() {
  if (typeof window === 'undefined') {
    throw new Error('createSupabaseBrowserClient should only be called on the client side')
  }

  if (browserClient) {
    return browserClient
  }

  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig()

  if (!validateSupabaseConfig(supabaseUrl, supabaseAnonKey)) {
    // Return a mock client for development/build purposes
    return createMockSupabaseClient()
  }

  try {
    browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })

    return browserClient
  } catch (error) {
    console.error('Failed to create Supabase browser client:', error)
    return createMockSupabaseClient()
  }
}

// Server client for API routes and server-side operations
export function createSupabaseServerClient(cookieStore) {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig()

  if (!validateSupabaseConfig(supabaseUrl, supabaseAnonKey)) {
    return createMockSupabaseClient()
  }

  try {
    return createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name) {
          return cookieStore?.get(name)?.value
        },
        set(name, value, options) {
          try {
            cookieStore?.set({ name, value, ...options })
          } catch (error) {
            // Handle cases where cookies can't be set (e.g., static generation)
            console.warn('Could not set cookie:', name)
          }
        },
        remove(name, options) {
          try {
            cookieStore?.set({ name, value: '', ...options })
          } catch (error) {
            console.warn('Could not remove cookie:', name)
          }
        },
      },
    })
  } catch (error) {
    console.error('Failed to create Supabase server client:', error)
    return createMockSupabaseClient()
  }
}

// Legacy client for backward compatibility (runtime-safe)
let legacyClient = null

export function getSupabaseClient() {
  if (legacyClient) {
    return legacyClient
  }

  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig()

  if (!validateSupabaseConfig(supabaseUrl, supabaseAnonKey)) {
    legacyClient = createMockSupabaseClient()
    return legacyClient
  }

  try {
    legacyClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: typeof window !== 'undefined',
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        autoRefreshToken: true,
        detectSessionInUrl: typeof window !== 'undefined',
        flowType: 'pkce',
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })

    return legacyClient
  } catch (error) {
    console.error('Failed to create legacy Supabase client:', error)
    legacyClient = createMockSupabaseClient()
    return legacyClient
  }
}

// Mock client for development/fallback
function createMockSupabaseClient() {
  const mockAuth = {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    signUp: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  }

  const mockFrom = () => ({
    select: () => Promise.resolve({ data: [], error: new Error('Supabase not configured') }),
    insert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    update: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    delete: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
  })

  return {
    auth: mockAuth,
    from: mockFrom,
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        download: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      }),
    },
    realtime: {
      channel: () => ({
        on: () => ({}),
        subscribe: () => Promise.resolve('SUBSCRIBED'),
        unsubscribe: () => Promise.resolve('UNSUBSCRIBED'),
      }),
    },
  }
}

// Configuration checker
export function isSupabaseConfigured() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig()
  return validateSupabaseConfig(supabaseUrl, supabaseAnonKey)
}

// Export default for convenience
export default getSupabaseClient

// This file is deprecated. Use /lib/supabaseClient.js instead for runtime-safe initialization.
// Keeping for backward compatibility.

import { getSupabaseClient, createSupabaseBrowserClient, isSupabaseConfigured as checkConfig } from './supabaseClient.js';

// Runtime-safe exports with proper client-side initialization
let browserClient: any = null;

function getSupabaseBrowserClient() {
  if (typeof window === 'undefined') {
    return null;
  }
  
  if (!browserClient) {
    try {
      browserClient = createSupabaseBrowserClient();
    } catch (error) {
      console.warn('Failed to create Supabase browser client:', error);
      return null;
    }
  }
  
  return browserClient;
}

export const supabase = getSupabaseBrowserClient();
export const supabaseClient = getSupabaseClient();
export const isSupabaseConfigured = checkConfig();
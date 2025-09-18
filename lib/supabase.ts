// This file is deprecated. Use /lib/supabaseClient.js instead for runtime-safe initialization.
// Keeping for backward compatibility.

import { getSupabaseClient, createSupabaseBrowserClient, isSupabaseConfigured as checkConfig } from './supabaseClient.js';

// Runtime-safe exports
export const supabase = typeof window !== 'undefined' ? createSupabaseBrowserClient() : null;
export const supabaseClient = getSupabaseClient();
export const isSupabaseConfigured = checkConfig();
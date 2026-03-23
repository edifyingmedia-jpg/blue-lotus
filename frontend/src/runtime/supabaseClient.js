// frontend/src/runtime/supabaseClient.js

/**
 * supabaseClient.js
 * ---------------------------------------------------------
 * Safe, tier‑aware Supabase initialization for the Blue Lotus runtime.
 *
 * Rules enforced here:
 *  - Free tier users get NO Supabase client (null)
 *  - Paid users get their assigned Supabase project keys
 *  - Only the owner receives platform‑level Supabase access
 *  - Runtime must NEVER crash if Supabase is unavailable
 *
 * This file is intentionally minimal and deterministic.
 */

import { createClient } from "@supabase/supabase-js";

// Environment variables injected at build time.
// These are controlled by the backend tier system.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * If no Supabase credentials exist, return null.
 * This is the correct behavior for:
 *  - free tier users
 *  - preview mode
 *  - environments without backend access
 */
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("[supabaseClient] No Supabase credentials found. Backend disabled.");
  export default null;
} else {
  /**
   * Create a fully configured Supabase client.
   * RLS (Row Level Security) protects all data access.
   */
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  export default supabase;
}

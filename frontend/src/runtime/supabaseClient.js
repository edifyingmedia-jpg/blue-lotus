/**
 * supabaseClient.js
 * ----------------------------------------------------
 * Creates a Supabase client instance if environment
 * variables are available. Otherwise returns null.
 *
 * This ensures the runtime NEVER crashes on free tier
 * or when backend is intentionally disabled.
 */

import { createClient } from "@supabase/supabase-js";

let supabase = null;

try {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (url && key) {
    supabase = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } else {
    console.warn("Supabase not configured — running in no-backend mode.");
  }
} catch (err) {
  console.error("Failed to initialize Supabase:", err);
  supabase = null;
}

export default supabase;

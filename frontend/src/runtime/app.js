// frontend/src/runtime/app.js

/**
 * app.js
 * ---------------------------------------------------------
 * Runtime bootstrap module for Blue Lotus.
 *
 * This file initializes the API client and exposes a clean
 * entry point for the runtime environment. It does NOT mount
 * React — that is handled by RuntimeApp.jsx.
 */

import APIClient from "./api";
import supabaseClient from "./supabaseClient";

/**
 * Create a fully configured runtime environment.
 */
export function createRuntimeEnvironment() {
  const api = new APIClient({
    supabase: supabaseClient || null,
  });

  return {
    api,
  };
}

/**
 * Default export for convenience.
 */
export default {
  createRuntimeEnvironment,
};

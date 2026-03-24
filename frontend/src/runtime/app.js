/**
 * app.js
 * ----------------------------------------------------
 * Entry point for initializing the Blue Lotus runtime.
 *
 * Responsibilities:
 * - Initialize API client
 * - Initialize Supabase (optional)
 * - Provide a clean bootstrap for RuntimeEngine
 */

import APIClient from "./api";
import supabaseClient from "./supabaseClient";
import RuntimeEngine from "./RuntimeEngine";

const app = {
  api: null,
  runtime: null,

  /**
   * Initialize the runtime environment
   */
  init({ appDefinition, onRender }) {
    // Initialize API client
    this.api = new APIClient({
      supabase: supabaseClient || null,
    });

    // Initialize runtime engine
    this.runtime = new RuntimeEngine({
      onRender,
    });

    // Load the app definition
    if (appDefinition) {
      this.runtime.load(appDefinition);
    }

    return this.runtime;
  },

  /**
   * Expose API client
   */
  getAPI() {
    return this.api;
  },

  /**
   * Expose runtime engine
   */
  getRuntime() {
    return this.runtime;
  },
};

export default app;

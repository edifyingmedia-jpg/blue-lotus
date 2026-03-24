/**
 * api.js
 * ----------------------------------------------------
 * Unified API client for Blue Lotus runtime.
 *
 * Responsibilities:
 * - Provide a clean wrapper around fetch()
 * - Support optional Supabase integration
 * - Handle GET/POST/PUT/DELETE requests
 * - Provide deterministic, production-safe behavior
 */

import supabaseClient from "./supabaseClient";

export default class APIClient {
  constructor({ supabase = null } = {}) {
    this.supabase = supabase || supabaseClient || null;
  }

  /**
   * Perform a standard HTTP request
   */
  async request(method, url, body = null, headers = {}) {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const res = await fetch(url, options);
      const data = await res.json().catch(() => null);

      return {
        ok: res.ok,
        status: res.status,
        data,
      };
    } catch (err) {
      console.error("APIClient request error:", err);
      return {
        ok: false,
        status: 0,
        data: null,
        error: err.message,
      };
    }
  }

  /**
   * Convenience wrappers
   */
  get(url, headers = {}) {
    return this.request("GET", url, null, headers);
  }

  post(url, body, headers = {}) {
    return this.request("POST", url, body, headers);
  }

  put(url, body, headers = {}) {
    return this.request("PUT", url, body, headers);
  }

  delete(url, headers = {}) {
    return this.request("DELETE", url, null, headers);
  }

  /**
   * Optional Supabase helpers
   */
  async from(table) {
    if (!this.supabase) {
      console.warn("APIClient: Supabase not available.");
      return null;
    }
    return this.supabase.from(table);
  }

  async auth() {
    if (!this.supabase) {
      console.warn("APIClient: Supabase auth not available.");
      return null;
    }
    return this.supabase.auth;
  }
}

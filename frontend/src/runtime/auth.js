/**
 * auth.js
 * ----------------------------------------------------
 * Lightweight authentication wrapper for the Blue Lotus runtime.
 *
 * Responsibilities:
 * - Optional Supabase auth integration
 * - Safe fallbacks when no backend is available
 * - Normalized responses for login/logout/session
 *
 * The runtime must NEVER crash if authentication is unavailable.
 */

import supabaseClient from "./supabaseClient";

class AuthClient {
  constructor() {
    this.supabase = supabaseClient || null;
  }

  /**
   * Get the current user session.
   */
  async getSession() {
    if (!this.supabase) {
      return { ok: false, user: null, error: "Auth not available" };
    }

    const { data, error } = await this.supabase.auth.getSession();

    if (error) {
      return { ok: false, user: null, error };
    }

    return {
      ok: true,
      user: data?.session?.user || null,
      session: data?.session || null,
    };
  }

  /**
   * Sign in with email + password.
   */
  async signIn({ email, password }) {
    if (!this.supabase) {
      return { ok: false, user: null, error: "Auth not available" };
    }

    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { ok: false, user: null, error };
    }

    return {
      ok: true,
      user: data.user,
      session: data.session,
    };
  }

  /**
   * Sign out the current user.
   */
  async signOut() {
    if (!this.supabase) {
      return { ok: false, error: "Auth not available" };
    }

    const { error } = await this.supabase.auth.signOut();

    if (error) {
      return { ok: false, error };
    }

    return { ok: true };
  }
}

const auth = new AuthClient();
export default auth;

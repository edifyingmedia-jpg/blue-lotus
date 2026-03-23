// frontend/src/runtime/api.js

/**
 * API Layer for Blue Lotus Runtime
 * ---------------------------------------------------------
 * Provides a unified interface for performing network requests
 * inside the runtime. This layer abstracts:
 *
 *  - Supabase (if enabled)
 *  - External REST/GraphQL APIs
 *  - Authenticated requests
 *  - Error normalization
 *
 * The runtime must NEVER crash due to missing backend access.
 */

export default class APIClient {
  constructor({ supabase = null } = {}) {
    this.supabase = supabase;
  }

  /**
   * Perform a generic GET request.
   */
  async get(url, options = {}) {
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
      });

      return await this._handleResponse(res);
    } catch (err) {
      return this._error(err);
    }
  }

  /**
   * Perform a generic POST request.
   */
  async post(url, body = {}, options = {}) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
        body: JSON.stringify(body),
      });

      return await this._handleResponse(res);
    } catch (err) {
      return this._error(err);
    }
  }

  /**
   * Supabase wrapper (if available).
   */
  async from(table) {
    if (!this.supabase) {
      return this._error("Supabase is not available in this environment.");
    }

    return this.supabase.from(table);
  }

  /**
   * Normalize fetch responses.
   */
  async _handleResponse(res) {
    const text = await res.text();

    let json;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = text;
    }

    if (!res.ok) {
      return this._error({
        status: res.status,
        message: json?.message || "Request failed",
        raw: json,
      });
    }

    return {
      ok: true,
      status: res.status,
      data: json,
    };
  }

  /**
   * Standardized error format.
   */
  _error(error) {
    return {
      ok: false,
      error,
    };
  }
}

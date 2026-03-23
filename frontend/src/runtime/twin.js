// frontend/src/runtime/twin.js

/**
 * twin.js
 * ---------------------------------------------------------
 * Safe, owner‑restricted TWIN interface for the Blue Lotus runtime.
 *
 * Rules enforced here:
 *  - Clients NEVER receive TWIN access
 *  - Free tier NEVER receives TWIN access
 *  - Paid tier NEVER receives TWIN access
 *  - Only the OWNER receives TWIN capabilities
 *  - TWIN must NEVER clone Blue Lotus or itself except for the owner
 *  - TWIN must NEVER expose builder logic to clients
 *
 * This file exposes a minimal, safe wrapper that returns `null`
 * unless the backend explicitly injects owner‑level credentials.
 */

const TWIN_URL = import.meta.env.VITE_TWIN_URL;
const TWIN_KEY = import.meta.env.VITE_TWIN_KEY;

/**
 * If no TWIN credentials exist, return null.
 * This is the correct behavior for all non‑owner users.
 */
if (!TWIN_URL || !TWIN_KEY) {
  console.warn("[twin] TWIN disabled (no credentials).");
  export default null;
} else {
  /**
   * Owner‑only TWIN client.
   * This is intentionally minimal and does NOT expose internal builder logic.
   */
  const twin = {
    /**
     * Perform a safe TWIN request.
     * Only owner‑level backend can inject valid credentials.
     */
    async request(path, options = {}) {
      const res = await fetch(`${TWIN_URL}/${path}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TWIN_KEY}`,
          ...(options.headers || {}),
        },
      });

      if (!res.ok) {
        throw new Error(`[twin] Request failed: ${res.status}`);
      }

      return res.json();
    },

    /**
     * Owner‑only: generate appDefinition from a public website.
     * Never clones private areas, never clones Blue Lotus, never clones TWIN.
     */
    async inferFromUrl(url) {
      return this.request("infer", {
        method: "POST",
        body: JSON.stringify({ url }),
      });
    },
  };

  export default twin;
}

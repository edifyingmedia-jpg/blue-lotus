// frontend/src/runtime/twinClient.js

/**
 * twinClient.js
 * ---------------------------------------------------------
 * Safe runtime wrapper around the owner‑only TWIN interface.
 *
 * Rules enforced:
 *  - Clients NEVER get TWIN access
 *  - Free tier NEVER gets TWIN access
 *  - Paid tier NEVER gets TWIN access
 *  - Only the OWNER receives TWIN capabilities
 *  - TWIN must NEVER clone Blue Lotus or itself except for the owner
 *  - TWIN must NEVER expose builder logic to clients
 *
 * This wrapper ensures the runtime never crashes if TWIN is null.
 */

import twin from "./twin";

/**
 * Safe wrapper for TWIN calls.
 * Returns null for all non‑owner users.
 */
const twinClient = {
  /**
   * Check if TWIN is available (owner only).
   */
  isEnabled() {
    return twin !== null;
  },

  /**
   * Owner‑only: infer appDefinition from a public website.
   * Never clones private areas, never clones Blue Lotus, never clones TWIN.
   */
  async inferFromUrl(url) {
    if (!twin) {
      console.warn("[twinClient] TWIN unavailable. User is not owner.");
      return null;
    }

    try {
      return await twin.inferFromUrl(url);
    } catch (err) {
      console.error("[twinClient] Error during TWIN inference:", err);
      return null;
    }
  },

  /**
   * Generic request passthrough (owner only).
   */
  async request(path, options = {}) {
    if (!twin) {
      console.warn("[twinClient] TWIN unavailable. User is not owner.");
      return null;
    }

    try {
      return await twin.request(path, options);
    } catch (err) {
      console.error("[twinClient] TWIN request failed:", err);
      return null;
    }
  },
};

export default twinClient;

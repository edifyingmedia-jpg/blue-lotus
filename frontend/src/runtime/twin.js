/**
 * twin.js
 * ----------------------------------------------------
 * INTERNAL OWNER-ONLY TWIN INTERFACE
 *
 * This file exposes the real TWIN engine ONLY to the owner.
 * All other users receive null.
 *
 * Owner identity is verified using:
 * - Owner email (hard-coded)
 * - Owner password (from environment variable)
 */

import auth from "./auth";

class TwinInternal {
  constructor() {
    this.ready = true;
    this.ownerEmail = "Verbtalk@yahoo.com";
    this.ownerPassword = import.meta.env.VITE_OWNER_PASSWORD; // stored safely in .env
  }

  /**
   * Verify owner identity using email + password.
   */
  async isOwner(password) {
    const session = await auth.getSession();
    const email = session?.user?.email || null;

    if (email !== this.ownerEmail) return false;
    if (!password || password !== this.ownerPassword) return false;

    return true;
  }

  /**
   * Safe internal call wrapper.
   */
  async call(path, payload = {}, password) {
    const owner = await this.isOwner(password);

    if (!owner) {
      console.warn("TWIN access denied: non-owner attempted access.");
      return null;
    }

    // Placeholder internal response — replace with real TWIN engine later
    return {
      ok: true,
      path,
      payload,
      message: "TWIN internal call executed (owner-only)."
    };
  }

  /**
   * Example internal capabilities
   */
  async inferFromUrl(url, password) {
    return this.call("inferFromUrl", { url }, password);
  }

  async request(path, options = {}, password) {
    return this.call(path, options, password);
  }
}

const twin = new TwinInternal();
export default twin;

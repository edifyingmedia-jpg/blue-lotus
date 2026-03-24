/**
 * twinClient.js
 * ----------------------------------------------------
 * Public client wrapper for TWIN API calls.
 *
 * IMPORTANT:
 * - Only the OWNER (Tiffany) can trigger TWIN operations.
 * - Free-tier users have NO access to TWIN.
 * - Paid-tier users have LIMITED access (repair, sync).
 * - TWIN cannot be exported, cloned, or accessed externally.
 *
 * This client is intentionally minimal and deterministic.
 */

import APIClient from "./api";
import auth from "./auth";

class TwinClient {
  constructor() {
    this.api = new APIClient();
  }

  /**
   * Check if the current user is the OWNER.
   */
  async isOwner() {
    const session = await auth.getSession();
    const email = session?.user?.email || null;

    // Hard-coded owner identity (sovereign control)
    return email === "tiffany@bluelotus.ai";
  }

  /**
   * Call a TWIN endpoint safely.
   */
  async call(endpoint, payload = {}) {
    const owner = await this.isOwner();

    if (!owner) {
      return {
        ok: false,
        error: "Access denied: Only the owner can use TWIN.",
      };
    }

    return this.api.post(`/api/twin/${endpoint}`, payload);
  }

  /**
   * Provision backend for a user project.
   */
  async provisionBackend(projectId) {
    return this.call("provision-backend", { projectId });
  }

  /**
   * Sync backend schema with app definition.
   */
  async syncSchema(projectId, appDefinition) {
    return this.call("sync-schema", { projectId, appDefinition });
  }

  /**
   * Repair backend if user breaks their project.
   */
  async repair(projectId) {
    return this.call("repair", { projectId });
  }

  /**
   * Migrate project to White Lotus backup platform.
   */
  async migrateToWhiteLotus(projectId) {
    return this.call("migrate", { projectId });
  }
}

const twinClient = new TwinClient();
export default twinClient;

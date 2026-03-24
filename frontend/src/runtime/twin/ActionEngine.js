/**
 * ActionEngine.js (TWIN)
 * ----------------------------------------------------
 * Executes internal TWIN actions.
 *
 * This engine is:
 * - owner-only
 * - server-side only
 * - deterministic
 * - never exposed to end users
 *
 * It is the execution layer beneath ActionDispatcher.
 */

import ActionDispatcher from "./ActionDispatcher";

class TWINActionEngine {
  /**
   * Execute a TWIN action.
   */
  async run(action, payload = {}) {
    return await ActionDispatcher.dispatch(action, payload);
  }

  /**
   * Convenience wrapper for common TWIN operations.
   */
  async generateProject(payload) {
    return await this.run("project.generate", payload);
  }

  async validateProject(payload) {
    return await this.run("project.validate", payload);
  }

  async loadProject(payload) {
    return await this.run("project.load", payload);
  }

  async syncSchema(payload) {
    return await this.run("schema.sync", payload);
  }

  async repairSchema(payload) {
    return await this.run("schema.repair", payload);
  }

  async generateBuilder(payload) {
    return await this.run("builder.generate", payload);
  }

  async repairBuilder(payload) {
    return await this.run("builder.repair", payload);
  }

  async startDeployment(payload) {
    return await this.run("deploy.start", payload);
  }

  async verifyDeployment(payload) {
    return await this.run("deploy.verify", payload);
  }

  async rollbackDeployment(payload) {
    return await this.run("deploy.rollback", payload);
  }
}

const engine = new TWINActionEngine();
export default engine;

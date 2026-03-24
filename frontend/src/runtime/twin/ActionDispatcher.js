/**
 * ActionDispatcher.js (TWIN)
 * ----------------------------------------------------
 * Dispatches internal TWIN actions to the correct
 * orchestration handlers.
 *
 * This dispatcher is:
 * - owner-only
 * - server-side only
 * - deterministic
 * - never exposed to end users
 *
 * It routes high-level platform actions such as:
 * - project generation
 * - schema sync
 * - backend repair
 * - builder orchestration
 * - deployment automation
 */

import TWINLogic from "./TWINLogic";

class TWINActionDispatcher {
  constructor() {
    this.handlers = {
      "project.generate": TWINLogic.generateProject,
      "project.validate": TWINLogic.validateProject,
      "project.load": TWINLogic.loadProject,

      "schema.sync": TWINLogic.syncSchema,
      "schema.repair": TWINLogic.repairSchema,

      "builder.generate": TWINLogic.generateBuilder,
      "builder.repair": TWINLogic.repairBuilder,

      "deploy.start": TWINLogic.startDeployment,
      "deploy.verify": TWINLogic.verifyDeployment,
      "deploy.rollback": TWINLogic.rollbackDeployment,
    };
  }

  /**
   * Dispatch a TWIN action.
   */
  async dispatch(action, payload = {}) {
    const handler = this.handlers[action];

    if (!handler) {
      throw new Error(`TWINActionDispatcher: Unknown action "${action}"`);
    }

    // All TWIN actions are deterministic and owner-only.
    return await handler(payload);
  }
}

const dispatcher = new TWINActionDispatcher();
export default dispatcher;

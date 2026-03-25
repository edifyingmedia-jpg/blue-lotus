/**
 * Runtime ActionDispatcher
 * ---------------------------------------------------------
 * Executes validated action objects deterministically.
 * Called by ActionEngine only.
 *
 * Responsibilities:
 *  - Execute a single action or array of actions
 *  - Delegate execution to ActionEngine
 *  - Never interpret UI events
 *  - Never mutate state directly
 */

export default class ActionDispatcher {
  constructor(actionEngine) {
    if (!actionEngine) {
      throw new Error("ActionDispatcher requires an ActionEngine instance");
    }

    this.actionEngine = actionEngine;
  }

  /**
   * Dispatch one or more validated actions.
   */
  async dispatch(actions, context = {}) {
    if (!actions) return;

    if (Array.isArray(actions)) {
      for (const action of actions) {
        await this.execute(action, context);
      }
      return;
    }

    await this.execute(actions, context);
  }

  /**
   * Execute a single validated action.
   */
  async execute(action, context) {
    if (!action || typeof action !== "object") return;

    await this.actionEngine.run(action, context);
  }
}

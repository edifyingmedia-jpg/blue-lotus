// frontend/src/runtime/actions/ActionEngine.js

/**
 * ActionEngine
 * ---------------------------------------------------------
 * Executes registered actions and feeds results into dispatch.
 *
 * Responsibilities:
 * - Accept an action name + payload
 * - Resolve the handler from ActionRegistry
 * - Execute handler(state, payload, context)
 * - Dispatch the resulting state update
 */

export default class ActionEngine {
  constructor({ registry, dispatch, getState }) {
    this.registry = registry;
    this.dispatch = dispatch;
    this.getState = getState;
  }

  /**
   * Execute an action by name
   * @param {string} name
   * @param {object} payload
   */
  run(name, payload = {}) {
    const handler = this.registry.resolve(name);

    if (!handler) {
      console.warn(`ActionEngine: Unknown action "${name}"`);
      return this.getState();
    }

    const state = this.getState();

    // Context passed to handlers (extendable)
    const context = {
      state,
      dispatch: this.dispatch,
      run: this.run.bind(this),
    };

    try {
      const result = handler(state, payload, context);

      // If handler returns an object, dispatch it as DATA_UPDATE
      if (result && typeof result === "object") {
        this.dispatch({
          type: "DATA_UPDATE",
          data: result,
        });
      }

      return this.getState();
    } catch (err) {
      console.error(`ActionEngine: Error running "${name}"`, err);
      return state;
    }
  }
}

/**
 * ActionDispatcher.js (utils)
 * ----------------------------------------------------
 * A lightweight, dependency-free dispatcher utility.
 *
 * This is NOT the runtime ActionDispatcher and NOT the
 * TWIN ActionDispatcher. This utility provides a simple
 * event-to-handler mapping mechanism used internally by
 * various runtime subsystems.
 *
 * Deterministic, synchronous, and safe for both
 * Preview and Runtime environments.
 */

class ActionDispatcher {
  constructor() {
    this.handlers = {};
  }

  /**
   * Register a handler for a specific action.
   */
  register(action, handler) {
    if (typeof handler !== "function") {
      throw new Error(`ActionDispatcher: Handler for "${action}" must be a function`);
    }
    this.handlers[action] = handler;
  }

  /**
   * Remove a handler.
   */
  unregister(action) {
    delete this.handlers[action];
  }

  /**
   * Dispatch an action synchronously.
   */
  dispatch(action, payload = {}) {
    const handler = this.handlers[action];

    if (!handler) {
      console.error(`ActionDispatcher: No handler registered for "${action}"`);
      return undefined;
    }

    return handler(payload);
  }

  /**
   * Check if an action has a registered handler.
   */
  has(action) {
    return !!this.handlers[action];
  }
}

const dispatcher = new ActionDispatcher();
export default dispatcher;

// frontend/src/runtime/actions/ActionRegistry.js

/**
 * ActionRegistry
 * ---------------------------------------------------------
 * Central registry for all runtime actions.
 *
 * Responsibilities:
 * - Register action handlers by name
 * - Resolve actions at runtime
 * - Provide a predictable lookup surface for ActionEngine
 */

export default class ActionRegistry {
  constructor() {
    this.actions = new Map();
  }

  /**
   * Register a new action handler
   * @param {string} name - Action name
   * @param {Function} handler - Function(state, payload, context)
   */
  register(name, handler) {
    if (typeof name !== "string") {
      throw new Error("ActionRegistry.register: name must be a string");
    }
    if (typeof handler !== "function") {
      throw new Error("ActionRegistry.register: handler must be a function");
    }

    this.actions.set(name, handler);
  }

  /**
   * Resolve an action handler by name
   * @param {string} name
   * @returns {Function|null}
   */
  resolve(name) {
    return this.actions.get(name) || null;
  }

  /**
   * Check if an action exists
   * @param {string} name
   */
  has(name) {
    return this.actions.has(name);
  }

  /**
   * List all registered actions
   */
  list() {
    return Array.from(this.actions.keys());
  }
}

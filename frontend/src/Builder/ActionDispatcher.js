// frontend/src/Builder/ActionDispatcher.js

/**
 * ActionDispatcher
 * ---------------------------------------------------------
 * A lightweight event dispatcher used by the Builder to
 * broadcast high-level actions. This keeps the Builder
 * decoupled from external systems (AI, plugins, etc.).
 */

class ActionDispatcher {
  constructor() {
    this.listeners = {};
  }

  /**
   * Subscribe to an action type.
   */
  on(type, callback) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  }

  /**
   * Dispatch an action to all listeners.
   */
  dispatch(type, payload) {
    const list = this.listeners[type];
    if (!list) return;

    for (const cb of list) {
      try {
        cb(payload);
      } catch (err) {
        console.error("ActionDispatcher listener error:", err);
      }
    }
  }
}

// Singleton instance
const instance = new ActionDispatcher();
export default instance;

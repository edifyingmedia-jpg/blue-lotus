// frontend/src/runtime/StateEngine.js

/**
 * StateEngine
 * ---------------------------------------------------------
 * Centralized reactive state container for the Blue Lotus runtime.
 *
 * Responsibilities:
 *  - Hold the global state tree
 *  - Provide immutable snapshots
 *  - Notify subscribers on change
 *  - Allow controlled updates from ActionDispatcher
 *  - Support data bindings in DynamicScreen
 */

export default class StateEngine {
  constructor(initialState = {}) {
    this.state = { ...initialState };
    this.subscribers = new Set();
  }

  /**
   * Subscribe to state changes.
   * Returns an unsubscribe function.
   */
  subscribe(callback) {
    if (typeof callback !== "function") {
      throw new Error("[StateEngine] subscribe() requires a function");
    }

    this.subscribers.add(callback);

    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Get a deep snapshot of the current state.
   */
  getSnapshot() {
    return JSON.parse(JSON.stringify(this.state));
  }

  /**
   * Update the state with a partial patch.
   * Triggers subscriber notifications.
   */
  update(patch) {
    if (typeof patch !== "object" || patch === null) {
      console.warn("[StateEngine] Ignoring invalid state patch:", patch);
      return;
    }

    this.state = {
      ...this.state,
      ...patch,
    };

    this._notify();
  }

  /**
   * Replace the entire state tree.
   */
  replace(newState) {
    if (typeof newState !== "object" || newState === null) {
      throw new Error("[StateEngine] replace() requires an object");
    }

    this.state = { ...newState };
    this._notify();
  }

  /**
   * Internal: notify all subscribers.
   */
  _notify() {
    const snapshot = this.getSnapshot();
    this.subscribers.forEach((fn) => fn(snapshot));
  }
}

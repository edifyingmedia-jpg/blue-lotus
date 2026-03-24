/**
 * StateEngine.js
 * ----------------------------------------------------
 * Centralized state manager for the runtime.
 *
 * Responsibilities:
 * - Hold global state values
 * - Provide deterministic updates
 * - Notify subscribers on change
 * - Integrate with data bindings
 *
 * This engine is intentionally simple and synchronous.
 */

class StateEngine {
  constructor() {
    this.state = {};
    this.subscribers = new Set();
  }

  /**
   * Get a value from the global state.
   */
  get(key) {
    return this.state[key];
  }

  /**
   * Set a value in the global state.
   */
  set(key, value) {
    this.state[key] = value;
    this.notify();
  }

  /**
   * Merge multiple values into the global state.
   */
  merge(values) {
    Object.assign(this.state, values);
    this.notify();
  }

  /**
   * Subscribe to state changes.
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  /**
   * Notify all subscribers.
   */
  notify() {
    for (const callback of this.subscribers) {
      callback(this.state);
    }
  }
}

const engine = new StateEngine();
export default engine;

/**
 * stateEngine.js
 * ----------------------------------------------------
 * A lightweight state engine used for component-level
 * or local runtime state, separate from the global
 * StateEngine.js.
 *
 * This engine is intentionally minimal and synchronous.
 */

class LocalStateEngine {
  constructor() {
    this.state = {};
    this.subscribers = new Set();
  }

  /**
   * Get a value from local state.
   */
  get(key) {
    return this.state[key];
  }

  /**
   * Set a value in local state.
   */
  set(key, value) {
    this.state[key] = value;
    this.notify();
  }

  /**
   * Merge multiple values into local state.
   */
  merge(values) {
    Object.assign(this.state, values);
    this.notify();
  }

  /**
   * Subscribe to local state changes.
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

const localState = new LocalStateEngine();
export default localState;

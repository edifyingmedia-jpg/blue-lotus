/**
 * StateEngine
 * ----------------------------------------------------
 * Centralized state container for the runtime.
 *
 * Responsibilities:
 * - Store key/value state
 * - Provide deterministic getters/setters
 * - Emit state change events
 * - Integrate with components + actions
 */

import EventBus from "./EventBus";

export default class StateEngine {
  constructor(initialState = {}) {
    this.state = { ...initialState };
  }

  /**
   * Get a value from state
   */
  getState(key) {
    return this.state[key];
  }

  /**
   * Set a value in state
   */
  setState(key, value) {
    this.state[key] = value;

    // Notify listeners (preview + runtime)
    EventBus.emit("state:update", {
      key,
      value,
      state: { ...this.state },
    });
  }

  /**
   * Replace entire state object
   */
  replaceState(newState) {
    this.state = { ...newState };
    EventBus.emit("state:replace", { state: { ...this.state } });
  }

  /**
   * Get full state snapshot
   */
  getAll() {
    return { ...this.state };
  }
}

// frontend/src/runtime/core/CoreState.js

/**
 * CoreState
 * ---------------------------------------------------------
 * Base state manager for the runtime.
 * Provides a predictable way to store, update, and subscribe
 * to global runtime state.
 */

export default class CoreState {
  constructor(initialState = {}) {
    this.state = initialState;
    this.listeners = new Set();
  }

  getState() {
    return this.state;
  }

  setState(updater) {
    const next =
      typeof updater === "function" ? updater(this.state) : updater;

    this.state = next;
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }
}

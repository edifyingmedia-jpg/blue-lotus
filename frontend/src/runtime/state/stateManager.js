// frontend/src/runtime/state/StateManager.js

/**
 * StateManager
 * ---------------------------------------------------------
 * - Centralized runtime state container
 * - Provides get/set/update helpers
 * - Emits change events to subscribed engines
 * - Pure, predictable, and framework‑agnostic
 */

export default class StateManager {
  constructor(initialState = {}) {
    this.state = { ...initialState };
    this.listeners = new Set();
  }

  // Read current state
  getState() {
    return this.state;
  }

  // Replace entire state
  setState(nextState) {
    this.state = { ...nextState };
    this._emit();
  }

  // Merge partial updates
  update(partial) {
    this.state = { ...this.state, ...partial };
    this._emit();
  }

  // Subscribe to state changes
  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  // Notify subscribers
  _emit() {
    for (const fn of this.listeners) {
      fn(this.state);
    }
  }
}

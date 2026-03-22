// frontend/src/runtime/StateEngine.js

/**
 * StateEngine
 * ---------------------------------------------------------
 * Centralized runtime state manager for Blue Lotus.
 *
 * Responsibilities:
 *  - Maintain global + component-level state
 *  - Provide get/set helpers
 *  - Notify listeners (renderer, preview) on state changes
 *  - Integrate with ActionEngine for setState actions
 *
 * It does NOT:
 *  - mutate UI directly
 *  - store UI layout
 *  - manage navigation
 */

export default class StateEngine {
  constructor({ onStateChange } = {}) {
    this.state = {};
    this.onStateChange = onStateChange || null;
  }

  /**
   * Initialize state with defaults from appDefinition.
   */
  init(initialState = {}) {
    this.state = { ...initialState };
    this._emit();
  }

  /**
   * Get a value from state.
   */
  get(key) {
    return this.state[key];
  }

  /**
   * Set a value in state.
   */
  set(key, value) {
    this.state[key] = value;
    this._emit();
  }

  /**
   * Merge multiple values into state.
   */
  merge(obj = {}) {
    Object.assign(this.state, obj);
    this._emit();
  }

  /**
   * Internal: notify listeners.
   */
  _emit() {
    if (this.onStateChange) {
      this.onStateChange(this.state);
    }
  }
}

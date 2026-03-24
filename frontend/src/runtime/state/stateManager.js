/**
 * stateManager.js
 * ----------------------------------------------------
 * High-level orchestrator for the runtime state system.
 *
 * Responsibilities:
 * - Initialize global state
 * - Provide unified access to state engines
 * - Expose helper methods for components + runtime
 * - Bridge StateEngine, ActionEngine, Reducer, and StateLoader
 */

import StateEngine from "./StateEngine";
import LocalStateEngine from "./stateEngine";
import StateLoader from "./StateLoader";
import ActionEngine from "./ActionEngine";

class StateManager {
  /**
   * Initialize global state from project definition.
   */
  init() {
    return StateLoader.load();
  }

  /**
   * Get a global state value.
   */
  get(key) {
    return StateEngine.get(key);
  }

  /**
   * Set a global state value.
   */
  set(key, value) {
    StateEngine.set(key, value);
  }

  /**
   * Merge multiple values into global state.
   */
  merge(values) {
    StateEngine.merge(values);
  }

  /**
   * Subscribe to global state changes.
   */
  subscribe(callback) {
    return StateEngine.subscribe(callback);
  }

  /**
   * Dispatch an action.
   */
  dispatch(actionId, payload = {}) {
    ActionEngine.run(actionId, payload);
  }

  /**
   * Local state helpers (component-level).
   */
  local = {
    get: (key) => LocalStateEngine.get(key),
    set: (key, value) => LocalStateEngine.set(key, value),
    merge: (values) => LocalStateEngine.merge(values),
    subscribe: (callback) => LocalStateEngine.subscribe(callback),
  };
}

const manager = new StateManager();
export default manager;

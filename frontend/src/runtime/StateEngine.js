/**
 * StateEngine.js
 * ----------------------------------------------------
 * Centralized runtime state container.
 *
 * Responsibilities:
 *  - Store and manage app state
 *  - Provide safe get/set operations
 *  - Emit state change events
 *  - Ensure deterministic updates
 */

import eventBus from "./utils/eventBus";
import { safeGet, safeSet, deepClone } from "./utils";

export default class StateEngine {
  constructor(initialState = {}) {
    if (typeof initialState !== "object") {
      throw new Error("StateEngine requires an object as initial state");
    }

    this.state = deepClone(initialState);
  }

  /**
   * Get a value from state using dot-path notation.
   */
  get(path) {
    if (!path || typeof path !== "string") {
      throw new Error("StateEngine.get requires a string path");
    }

    return safeGet(this.state, path);
  }

  /**
   * Set a value in state using dot-path notation.
   */
  set(path, value) {
    if (!path || typeof path !== "string") {
      throw new Error("StateEngine.set requires a string path");
    }

    const cloned = deepClone(value);

    safeSet(this.state, path, cloned);

    eventBus.emit("state:change", {
      path,
      value: cloned,
      state: this.state,
    });
  }

  /**
   * Replace the entire state object.
   */
  replace(newState) {
    if (typeof newState !== "object") {
      throw new Error("StateEngine.replace requires an object");
    }

    this.state = deepClone(newState);

    eventBus.emit("state:replace", {
      state: this.state,
    });
  }

  /**
   * Return a deep clone of the current state.
   */
  snapshot() {
    return deepClone(this.state);
  }
}

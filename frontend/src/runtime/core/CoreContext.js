// frontend/src/runtime/core/CoreContext.js

/**
 * CoreContext
 * ---------------------------------------------------------
 * Provides a shared runtime context for engines, state,
 * renderer, and utilities. This is the central object that
 * binds the runtime together.
 */

import createEventBus from "../utils/eventBus.js";

export default function createCoreContext() {
  return {
    eventBus: createEventBus(),
    engines: {},
    state: null,
    renderer: null,

    registerEngine(name, engine) {
      this.engines[name] = engine;
    },

    setStateManager(stateManager) {
      this.state = stateManager;
    },

    setRenderer(renderer) {
      this.renderer = renderer;
    }
  };
}

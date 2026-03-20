// frontend/src/runtime/core/Runtime.js

/**
 * Runtime
 * ---------------------------------------------------------
 * The orchestrator that wires together:
 * - CoreContext
 * - Engines
 * - State manager
 * - Renderer
 *
 * Provides a clean API to start and stop the runtime.
 */

import createCoreContext from "./CoreContext.js";

export default class Runtime {
  constructor({ engines = [], stateManager, renderer } = {}) {
    this.context = createCoreContext();

    // Register engines
    engines.forEach((engine) => {
      engine.context = this.context;
      this.context.registerEngine(engine.name, engine);
      engine.onRegister?.();
    });

    // Attach state manager
    if (stateManager) {
      this.context.setStateManager(stateManager);
    }

    // Attach renderer
    if (renderer) {
      this.context.setRenderer(renderer);
    }
  }

  start() {
    // Start engines
    Object.values(this.context.engines).forEach((engine) =>
      engine.onStart?.()
    );

    // Start renderer
    this.context.renderer?.start?.();
  }

  stop() {
    // Stop renderer
    this.context.renderer?.stop?.();

    // Stop engines
    Object.values(this.context.engines).forEach((engine) =>
      engine.onStop?.()
    );
  }
}

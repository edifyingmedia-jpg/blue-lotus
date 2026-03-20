// frontend/src/runtime/core/CoreEngine.js

/**
 * CoreEngine
 * ---------------------------------------------------------
 * Base class for all runtime engines.
 * Engines extend this class to gain a consistent lifecycle
 * and access to the shared CoreContext.
 */

export default class CoreEngine {
  constructor(context) {
    if (!context) {
      throw new Error("CoreEngine requires a CoreContext instance.");
    }

    this.context = context;
    this.eventBus = context.eventBus;
  }

  // Called when the engine is registered
  onRegister() {}

  // Called when the runtime starts
  onStart() {}

  // Called when the runtime stops
  onStop() {}
}

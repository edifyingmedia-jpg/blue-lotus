// frontend/src/runtime/engine/ActionEngine.js

/**
 * ActionEngine
 * ---------------------------------------------------------
 * Handles execution of user-defined actions inside the runtime.
 * Actions may trigger navigation, state updates, API calls,
 * component events, or custom logic.
 */

import CoreEngine from "../core/CoreEngine.js";

export default class ActionEngine extends CoreEngine {
  static name = "action";

  constructor(context) {
    super(context);
    this.handlers = new Map();
  }

  registerAction(name, handler) {
    this.handlers.set(name, handler);
  }

  async run(name, payload, context = {}) {
    const handler = this.handlers.get(name);

    if (!handler) {
      console.warn(`ActionEngine: No handler registered for action "${name}"`);
      return;
    }

    try {
      return await handler(payload, {
        ...context,
        eventBus: this.eventBus,
        state: this.context.state,
        engines: this.context.engines
      });
    } catch (err) {
      console.error(`ActionEngine: Error running action "${name}"`, err);
    }
  }

  onStart() {
    // Optional: preload or initialize action handlers
  }
}

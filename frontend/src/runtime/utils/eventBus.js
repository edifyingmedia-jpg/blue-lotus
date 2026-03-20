// frontend/src/runtime/utils/eventBus.js

/**
 * eventBus
 * ---------------------------------------------------------
 * A lightweight publish/subscribe system for runtime modules.
 * Engines and components can emit events without knowing
 * who is listening, keeping the architecture decoupled.
 */

export default function createEventBus() {
  const listeners = new Map();

  return {
    // Subscribe to an event
    on(event, handler) {
      if (!listeners.has(event)) {
        listeners.set(event, new Set());
      }
      listeners.get(event).add(handler);

      // Unsubscribe function
      return () => {
        listeners.get(event)?.delete(handler);
      };
    },

    // Emit an event
    emit(event, payload) {
      const handlers = listeners.get(event);
      if (!handlers) return;

      for (const handler of handlers) {
        handler(payload);
      }
    },

    // Remove all listeners for an event
    clear(event) {
      listeners.delete(event);
    }
  };
}

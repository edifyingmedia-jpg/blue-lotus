/**
 * eventBus.js
 * ----------------------------------------------------
 * Lightweight, deterministic event bus used throughout
 * the runtime. This is NOT the same as the TWIN EventBus
 * or the Editor EventBus — this is the generic runtime
 * utility version.
 *
 * Features:
 * - subscribe(event, handler)
 * - unsubscribe(event, handler)
 * - emit(event, payload)
 *
 * Deterministic, dependency-free, and safe for both
 * Preview and Runtime environments.
 */

class EventBus {
  constructor() {
    this.events = {};
  }

  /**
   * Subscribe to an event.
   */
  subscribe(event, handler) {
    if (typeof handler !== "function") {
      throw new Error(`EventBus: handler for "${event}" must be a function`);
    }

    if (!this.events[event]) {
      this.events[event] = new Set();
    }

    this.events[event].add(handler);

    // Return unsubscribe function
    return () => this.unsubscribe(event, handler);
  }

  /**
   * Unsubscribe from an event.
   */
  unsubscribe(event, handler) {
    if (!this.events[event]) return;
    this.events[event].delete(handler);
    if (this.events[event].size === 0) {
      delete this.events[event];
    }
  }

  /**
   * Emit an event synchronously.
   */
  emit(event, payload) {
    const handlers = this.events[event];
    if (!handlers) return;

    for (const handler of handlers) {
      try {
        handler(payload);
      } catch (err) {
        console.error(`EventBus: handler for "${event}" threw`, err);
      }
    }
  }
}

const eventBus = new EventBus();
export default eventBus;

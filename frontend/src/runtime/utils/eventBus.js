/**
 * EventBus.js
 * ----------------------------------------------------
 * Minimal synchronous event emitter used across the runtime.
 *
 * Responsibilities:
 *  - Register event listeners
 *  - Emit events synchronously
 *  - Remove listeners
 */

class EventBus {
  constructor() {
    this.listeners = {};
  }

  /**
   * Subscribe to an event.
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback);

    return () => this.off(event, callback);
  }

  /**
   * Remove a listener.
   */
  off(event, callback) {
    if (!this.listeners[event]) return;

    this.listeners[event] = this.listeners[event].filter(
      (cb) => cb !== callback
    );
  }

  /**
   * Emit an event synchronously.
   */
  emit(event, payload) {
    const callbacks = this.listeners[event];
    if (!callbacks || callbacks.length === 0) return;

    for (const cb of callbacks) {
      try {
        cb(payload);
      } catch (err) {
        console.error(`EventBus listener error for '${event}':`, err);
      }
    }
  }
}

const eventBus = new EventBus();
export default eventBus;

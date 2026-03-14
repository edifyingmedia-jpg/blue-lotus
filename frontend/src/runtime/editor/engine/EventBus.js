// EventBus.js
// A tiny publish/subscribe system for editor-wide communication

export default class EventBus {
  constructor() {
    this.listeners = {};
  }

  // Subscribe to an event
  on(eventName, callback) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = new Set();
    }
    this.listeners[eventName].add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners[eventName].delete(callback);
    };
  }

  // Emit an event with optional payload
  emit(eventName, payload) {
    const handlers = this.listeners[eventName];
    if (!handlers) return;

    for (const callback of handlers) {
      try {
        callback(payload);
      } catch (err) {
        console.error(`EventBus handler error for "${eventName}":`, err);
      }
    }
  }

  // Remove all listeners for an event
  clear(eventName) {
    if (this.listeners[eventName]) {
      this.listeners[eventName].clear();
    }
  }

  // Remove all listeners for all events
  clearAll() {
    this.listeners = {};
  }
}

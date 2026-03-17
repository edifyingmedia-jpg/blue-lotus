// frontend/src/runtime/editor/core/EventBus.js

const listeners = {};

const EventBus = {
  on(eventName, handler) {
    if (!eventName || typeof handler !== "function") return;
    if (!listeners[eventName]) {
      listeners[eventName] = new Set();
    }
    listeners[eventName].add(handler);
  },

  off(eventName, handler) {
    if (!eventName || !listeners[eventName]) return;
    if (handler) {
      listeners[eventName].delete(handler);
    } else {
      listeners[eventName].clear();
    }
  },

  emit(eventName, payload) {
    if (!eventName || !listeners[eventName]) return;
    for (const handler of listeners[eventName]) {
      try {
        handler(payload);
      } catch (err) {
        // Fail soft; do not break other listeners
        console.error(`[EventBus] Error in handler for "${eventName}":`, err);
      }
    }
  },
};

export default EventBus;

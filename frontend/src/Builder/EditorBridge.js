// frontend/src/Builder/EditorBridge.js

/**
 * EditorBridge
 * ---------------------------------------------------------
 * A thin communication layer between the Builder UI and the
 * AI / automation engine. This keeps the Builder clean and
 * prevents direct coupling to external systems.
 *
 * For 1.0, this is intentionally minimal.
 */

class EditorBridge {
  constructor() {
    this.handlers = {};
  }

  /**
   * Register a handler for a specific message type.
   */
  on(type, callback) {
    if (!this.handlers[type]) {
      this.handlers[type] = [];
    }
    this.handlers[type].push(callback);
  }

  /**
   * Send a message to all listeners of that type.
   */
  emit(type, payload) {
    const list = this.handlers[type];
    if (!list) return;

    list.forEach((cb) => {
      try {
        cb(payload);
      } catch (err) {
        console.error("EditorBridge handler error:", err);
      }
    });
  }

  /**
   * Convenience method for AI-driven updates.
   */
  sendToAI(event, data) {
    this.emit("ai:request", { event, data });
  }

  /**
   * Convenience method for receiving AI responses.
   */
  receiveFromAI(event, data) {
    this.emit(`ai:${event}`, data);
  }
}

// Singleton instance
const instance = new EditorBridge();
export default instance;

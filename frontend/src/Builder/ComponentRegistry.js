// frontend/src/Builder/ComponentRegistry.js

/**
 * ComponentRegistry
 * ---------------------------------------------------------
 * A simple global registry that maps string component types
 * to actual React components. Used by both the Builder and
 * the runtime resolver.
 */

class ComponentRegistry {
  constructor() {
    this.registry = {};
  }

  register(type, component) {
    if (!type || !component) {
      console.warn("ComponentRegistry: invalid registration", { type, component });
      return;
    }
    this.registry[type] = component;
  }

  get(type) {
    return this.registry[type] || null;
  }

  all() {
    return { ...this.registry };
  }
}

// Singleton instance
const instance = new ComponentRegistry();
export default instance;

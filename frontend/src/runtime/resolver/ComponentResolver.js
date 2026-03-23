// frontend/src/runtime/resolver/ComponentResolver.js

/**
 * ComponentResolver.js
 * ---------------------------------------------------------
 * Maps component "type" strings from the DocumentModel
 * to real React components registered in resolverComponents.
 *
 * This resolver is deterministic, owner-controlled, and
 * contains no fallbacks or legacy builder components.
 */

import resolverComponents from "./resolverComponents";

export default class ComponentResolver {
  constructor() {
    this.registry = resolverComponents;
  }

  /**
   * Returns the React component for a given type.
   * Example: "Text" → Text component
   */
  get(type) {
    if (!type || typeof type !== "string") {
      console.error("[ComponentResolver] Invalid component type:", type);
      return null;
    }

    const Component = this.registry[type];

    if (!Component) {
      console.error(`[ComponentResolver] Unknown component type: ${type}`);
      return null;
    }

    return Component;
  }
}

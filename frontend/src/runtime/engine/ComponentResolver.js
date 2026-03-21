// frontend/src/runtime/engine/ComponentResolver.js

/**
 * ComponentResolver
 * ---------------------------------------------------------
 * Resolves a component type string (e.g., "Button") into the
 * actual React component from the ComponentRegistry.
 */

import ComponentRegistry from "../../Builder/ComponentRegistry";

export default class ComponentResolver {
  /**
   * Resolve a component type to a React component.
   */
  static resolve(type) {
    if (!type) {
      console.warn("ComponentResolver: Missing component type");
      return null;
    }

    const component = ComponentRegistry.get(type);

    if (!component) {
      console.warn(`ComponentResolver: Unknown component type "${type}"`);
      return null;
    }

    return component;
  }
}

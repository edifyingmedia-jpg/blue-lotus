/**
 * ComponentResolver.js
 * ----------------------------------------------------
 * Resolves component types from the app definition
 * into actual React components registered in the
 * runtime component map.
 *
 * Responsibilities:
 *  - Map string component types to real components
 *  - Throw deterministic errors for unknown types
 *  - Provide a single entry point for resolution
 */

import componentMap from "../componentMap";

export default class ComponentResolver {
  constructor() {
    if (!componentMap || typeof componentMap !== "object") {
      throw new Error("componentMap is missing or invalid");
    }
  }

  /**
   * Resolve a component type into a real React component.
   */
  resolve(type) {
    if (!type || typeof type !== "string") {
      throw new Error(`Invalid component type: ${type}`);
    }

    const Component = componentMap[type];

    if (!Component) {
      throw new Error(`Unknown component type: '${type}'`);
    }

    return Component;
  }
}

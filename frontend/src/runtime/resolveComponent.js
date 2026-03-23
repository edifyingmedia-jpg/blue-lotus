// frontend/src/runtime/resolveComponent.js

/**
 * resolveComponent.js
 * ---------------------------------------------------------
 * Maps a component type string to the actual React component
 * using the central componentMap registry.
 *
 * This is used by:
 *   - ComponentResolver
 *   - DynamicScreen
 */

import componentMap from "./componentMap";

/**
 * Resolve a component type → actual React component.
 */
export default function resolveComponent(type) {
  if (!type || typeof type !== "string") {
    console.warn("[resolveComponent] Invalid component type:", type);
    return null;
  }

  const Component = componentMap[type];

  if (!Component) {
    console.warn(`[resolveComponent] Unknown component type: ${type}`);
    return null;
  }

  return Component;
}

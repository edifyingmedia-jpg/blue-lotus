/**
 * resolveComponent.js
 * ----------------------------------------------------
 * Resolves a component type string into the actual
 * component implementation using the componentMap.
 *
 * This is a thin wrapper used by ComponentResolver.js
 * to keep the lookup logic isolated and deterministic.
 */

import componentMap from "./componentMap";

/**
 * Resolve a component by type string.
 * Returns the component module or null if not found.
 */
export default function resolveComponent(type) {
  if (!type || typeof type !== "string") {
    console.warn("resolveComponent: invalid type:", type);
    return null;
  }

  const component = componentMap[type];

  if (!component) {
    console.warn(`resolveComponent: component "${type}" not found.`);
    return null;
  }

  return component;
}

/**
 * ComponentRegistry.js
 * Blue Lotus — AI‑Driven No‑Code Builder
 *
 * Central registry for all component types.
 * This allows AI + ActionDispatcher to safely create components
 * without drag‑and‑drop or manual imports.
 *
 * Responsibilities:
 *  - Register component types
 *  - Retrieve component definitions
 *  - Validate component existence
 *  - Allow plugins to extend the system
 */

const registry = {};

/**
 * Register a component type.
 * Example:
 *   ComponentRegistry.register("Button", ButtonRenderer)
 */
function register(type, renderer) {
  if (!type) {
    console.error("ComponentRegistry: Cannot register component without a type.");
    return;
  }

  registry[type] = renderer || { render: () => null };

  console.log(`ComponentRegistry: Registered component "${type}".`);
}

/**
 * Register multiple components at once.
 */
function registerMany(map) {
  Object.entries(map).forEach(([type, renderer]) => {
    register(type, renderer);
  });
}

/**
 * Retrieve a component renderer by type.
 */
function get(type) {
  return registry[type] || null;
}

/**
 * Check if a component type exists.
 */
function exists(type) {
  return !!registry[type];
}

/**
 * Get all registered component types.
 */
function list() {
  return Object.keys(registry);
}

/**
 * Exported API
 */
export default {
  register,
  registerMany,
  get,
  exists,
  list,
};

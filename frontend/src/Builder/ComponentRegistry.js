// frontend/src/Builder/ComponentRegistry.js

/**
 * ComponentRegistry (Builder)
 * ---------------------------------------------------------
 * Registry for all components used inside the Blue Lotus Builder UI.
 *
 * This is NOT the runtime component registry.
 * This registry is for:
 *  - Canvas components
 *  - Builder panels
 *  - Property editors
 *  - Inspector widgets
 *  - Any UI element the Builder needs internally
 *
 * The runtime registry lives in: frontend/src/runtime/resolver
 */

const registry = {};

/**
 * Register a builder component.
 * Example:
 *   ComponentRegistry.register("Canvas", Canvas);
 */
function register(type, component) {
  if (!type) {
    console.error("ComponentRegistry: Cannot register component without a type.");
    return;
  }

  registry[type] = component || null;

  console.log(`Builder ComponentRegistry: Registered "${type}".`);
}

/**
 * Register multiple components at once.
 */
function registerMany(map) {
  Object.entries(map).forEach(([type, component]) => {
    register(type, component);
  });
}

/**
 * Retrieve a component by type.
 */
function get(type) {
  return registry[type] || null;
}

/**
 * Check if a component exists.
 */
function exists(type) {
  return !!registry[type];
}

/**
 * List all registered builder components.
 */
function list() {
  return Object.keys(registry);
}

export default {
  register,
  registerMany,
  get,
  exists,
  list,
};

// frontend/src/runtime/navigation.js

/**
 * navigation.js
 * ---------------------------------------------------------
 * Public navigation API for the Blue Lotus runtime.
 *
 * This wraps NavigationEngine and exposes a clean,
 * deterministic interface for components, actions,
 * and the runtime renderer.
 *
 * Rules:
 *  - Route-based navigation only (no stacks)
 *  - No legacy "screens"
 *  - No templates
 *  - No fallback behavior
 *  - Deterministic, predictable, safe
 */

import NavigationEngine from "./NavigationEngine";

let engine = null;

/**
 * Initialize navigation with the active NavigationEngine instance.
 * Called by RuntimeApp during boot.
 */
export function initNavigation(navEngine) {
  engine = navEngine;
}

/**
 * Navigate to a route.
 */
export function navigate(routeName, params = {}) {
  if (!engine) {
    console.warn("[navigation] NavigationEngine not initialized.");
    return;
  }

  engine.navigate("REPLACE", routeName, params);
}

/**
 * Replace the current route.
 */
export function replace(routeName, params = {}) {
  if (!engine) {
    console.warn("[navigation] NavigationEngine not initialized.");
    return;
  }

  engine.navigate("REPLACE", routeName, params);
}

/**
 * Reset the entire navigation state to a single route.
 */
export function reset(routeName, params = {}) {
  if (!engine) {
    console.warn("[navigation] NavigationEngine not initialized.");
    return;
  }

  engine.navigate("RESET", routeName, params);
}

/**
 * Get the current route name.
 */
export function getCurrentRoute() {
  if (!engine) return null;
  return engine.getCurrentScreen();
}

/**
 * Get the full navigation engine (owner-only internal use).
 */
export function getEngine() {
  return engine;
}

export default {
  initNavigation,
  navigate,
  replace,
  reset,
  getCurrentRoute,
  getEngine,
};

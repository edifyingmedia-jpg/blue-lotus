/**
 * navigation.js
 * ----------------------------------------------------
 * Public navigation helper for the Blue Lotus runtime.
 *
 * This provides a clean, stable API surface for:
 * - components
 * - actions
 * - screens
 * - bindings
 *
 * It wraps NavigationEngine so the runtime never exposes
 * internal engine instances directly.
 */

import NavigationEngine from "./NavigationEngine";

let navigationEngine = null;

/**
 * Initialize navigation with the engine instance.
 * Called by RuntimeEngine during app bootstrap.
 */
export function initNavigation(engine) {
  navigationEngine = engine;
}

/**
 * Navigate to a screen by ID.
 */
export function navigate(screenId, params = {}) {
  if (!navigationEngine) {
    console.warn("navigation.js: NavigationEngine not initialized.");
    return;
  }
  navigationEngine.navigate(screenId, params);
}

/**
 * Get the current screen object.
 */
export function getCurrentScreen() {
  if (!navigationEngine) return null;
  return navigationEngine.getCurrentScreen();
}

/**
 * Expose the raw engine ONLY for internal runtime use.
 */
export function getNavigationEngine() {
  return navigationEngine;
}

export default {
  initNavigation,
  navigate,
  getCurrentScreen,
  getNavigationEngine,
};

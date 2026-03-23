// frontend/src/runtime/screens/ScreenEngine.js

/**
 * ScreenEngine.js
 * ---------------------------------------------------------
 * Screen-level state manager for the active screen.
 *
 * This is the screen-layer engine (not the resolver version).
 * It provides a stable API for SceneManager and NavigationContext
 * to update the active screen object.
 */

let _activeScreen = null;
let _listeners = new Set();

/**
 * Subscribe to screen changes.
 */
export function subscribe(listener) {
  _listeners.add(listener);
  return () => _listeners.delete(listener);
}

/**
 * Get the current active screen object.
 */
export function getActiveScreen() {
  return _activeScreen;
}

/**
 * Set the active screen and notify subscribers.
 */
export function setActiveScreen(screenObject) {
  _activeScreen = screenObject;

  for (const fn of _listeners) {
    try {
      fn(_activeScreen);
    } catch (err) {
      console.error("[ScreenEngine] Listener error:", err);
    }
  }
}

/**
 * Reset screen state (used by RuntimeEngine or hot reload).
 */
export function resetScreen() {
  _activeScreen = null;
  for (const fn of _listeners) {
    try {
      fn(null);
    } catch (err) {
      console.error("[ScreenEngine] Listener error:", err);
    }
  }
}

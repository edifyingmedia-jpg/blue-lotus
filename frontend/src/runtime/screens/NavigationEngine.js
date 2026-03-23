// frontend/src/runtime/screens/NavigationEngine.js

/**
 * NavigationEngine.js
 * ---------------------------------------------------------
 * Centralized runtime navigation controller.
 *
 * Responsibilities:
 *  - Track the active screen
 *  - Resolve navigation requests
 *  - Notify listeners of screen changes
 *
 * This engine must remain deterministic and UI‑agnostic.
 */

class NavigationEngine {
  constructor() {
    this.currentScreen = null;
    this.listeners = new Set();
  }

  getCurrentScreen() {
    return this.currentScreen;
  }

  navigate(screenName) {
    if (!screenName || screenName === this.currentScreen) return;

    this.currentScreen = screenName;
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((listener) =>
      listener(this.currentScreen)
    );
  }
}

const navigationEngine = new NavigationEngine();
export default navigationEngine;

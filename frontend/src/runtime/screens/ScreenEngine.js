/**
 * ScreenEngine.js
 * ----------------------------------------------------
 * Central controller for screen state.
 *
 * Responsibilities:
 * - Track the active screen
 * - Allow subscriptions to screen changes
 * - Provide deterministic screen switching
 * - Integrate with NavigationEngine + ScreenLoader
 */

class ScreenEngine {
  constructor() {
    this.activeScreen = null;
    this.subscribers = new Set();
  }

  /**
   * Initialize the engine with the first screen.
   */
  setInitialScreen(screen) {
    this.activeScreen = screen;
    this.notify();
  }

  /**
   * Change the active screen.
   */
  setScreen(screen) {
    this.activeScreen = screen;
    this.notify();
  }

  /**
   * Get the current active screen.
   */
  getScreen() {
    return this.activeScreen;
  }

  /**
   * Subscribe to screen changes.
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  /**
   * Notify all subscribers of a screen change.
   */
  notify() {
    for (const callback of this.subscribers) {
      callback(this.activeScreen);
    }
  }
}

const engine = new ScreenEngine();
export default engine;

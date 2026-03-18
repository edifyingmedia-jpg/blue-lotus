/**
 * NavigationEngine.js
 * ---------------------------------------------------------
 * A clean, deterministic navigation controller for Blue Lotus.
 *
 * Responsibilities:
 * - Maintain a navigation stack
 * - Provide PUSH, REPLACE, RESET, and MODAL actions
 * - Expose getInitialScreen()
 * - Notify Engine.js when navigation occurs
 */

export default class NavigationEngine {
  constructor() {
    this.stack = [];
    this.onNavigate = null;

    // Default initial screen
    this.initialScreen = "Home";
  }

  /**
   * Initialize navigation with project + document context
   */
  init({ project, document, onNavigate }) {
    this.project = project;
    this.document = document;
    this.onNavigate = onNavigate;

    // Reset navigation stack
    this.stack = [this.initialScreen];
  }

  /**
   * Return the first screen to mount
   */
  getInitialScreen() {
    return this.initialScreen;
  }

  /**
   * Core navigation dispatcher
   */
  navigate = (type, screen, params = {}) => {
    const action = { type, screen, params };

    switch (type) {
      case "PUSH":
        this.stack.push(screen);
        break;

      case "REPLACE":
        this.stack.pop();
        this.stack.push(screen);
        break;

      case "RESET":
        this.stack = [screen];
        break;

      case "MODAL":
        // Future modal system
        break;

      default:
        console.warn("[NavigationEngine] Unknown navigation type:", type);
        return;
    }

    if (this.onNavigate) {
      this.onNavigate(action);
    }
  };

  /**
   * Convenience wrappers
   */
  push(screen, params = {}) {
    this.navigate("PUSH", screen, params);
  }

  replace(screen, params = {}) {
    this.navigate("REPLACE", screen, params);
  }

  reset(screen, params = {}) {
    this.navigate("RESET", screen, params);
  }

  modal(screen, params = {}) {
    this.navigate("MODAL", screen, params);
  }

  /**
   * Return the current screen name
   */
  getCurrentScreen() {
    return this.stack[this.stack.length - 1] || null;
  }
}

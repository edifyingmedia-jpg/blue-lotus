/**
 * NavigationEngine.js
 * ----------------------------------------------------
 * Deterministic navigation state manager for runtime.
 *
 * Responsibilities:
 *  - Track current screen + params
 *  - Provide navigate() with full lifecycle events
 *  - Integrate with ActionEngine + AppRenderer
 *  - Never mutate appDefinition
 *  - Emit navigation events through eventBus
 */

import eventBus from "./utils/eventBus";

export default class NavigationEngine {
  constructor() {
    this.current = {
      screen: null,
      params: {},
    };
  }

  /**
   * Navigate to a new screen
   */
  async navigate(screen, params = {}) {
    if (!screen || typeof screen !== "string") {
      console.warn("NavigationEngine.navigate: invalid screen:", screen);
      return;
    }

    const previous = { ...this.current };

    this.current = {
      screen,
      params: { ...params },
    };

    eventBus.emit("navigation:changed", {
      from: previous,
      to: this.current,
    });
  }

  /**
   * Get current screen name
   */
  getScreen() {
    return this.current.screen;
  }

  /**
   * Get current params
   */
  getParams() {
    return this.current.params;
  }

  /**
   * Reset navigation state
   */
  reset() {
    const previous = { ...this.current };

    this.current = {
      screen: null,
      params: {},
    };

    eventBus.emit("navigation:changed", {
      from: previous,
      to: this.current,
    });
  }
}

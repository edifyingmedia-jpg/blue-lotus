/**
 * NavigationEngine.js
 * ----------------------------------------------------
 * Minimal deterministic navigation system for the runtime.
 *
 * Responsibilities:
 *  - Track current screen
 *  - Navigate to a new screen by ID
 *  - Emit navigation lifecycle events
 *  - Integrate with Renderer and ActionEngine
 */

import eventBus from "./utils/eventBus";

export default class NavigationEngine {
  constructor({ documentModel, renderer }) {
    if (!documentModel) {
      throw new Error("NavigationEngine requires a documentModel");
    }
    if (!renderer) {
      throw new Error("NavigationEngine requires a renderer");
    }

    this.documentModel = documentModel;
    this.renderer = renderer;

    this.currentScreen = documentModel.initialScreen;
  }

  /**
   * Navigate to a new screen.
   */
  navigate(screenId, params = {}) {
    if (!screenId || typeof screenId !== "string") {
      throw new Error("NavigationEngine.navigate requires a screenId string");
    }

    const screen = this.documentModel.screens[screenId];
    if (!screen) {
      throw new Error(`NavigationEngine: unknown screen '${screenId}'`);
    }

    const previous = this.currentScreen;
    this.currentScreen = screenId;

    eventBus.emit("navigation:before", {
      from: previous,
      to: screenId,
      params,
    });

    const rendered = this.renderer.renderScreen(screenId);

    eventBus.emit("navigation:after", {
      from: previous,
      to: screenId,
      params,
    });

    return rendered;
  }

  /**
   * Get the current screen ID.
   */
  getCurrentScreen() {
    return this.currentScreen;
  }
}

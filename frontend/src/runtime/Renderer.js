/**
 * Renderer.js
 * ----------------------------------------------------
 * High-level runtime renderer.
 *
 * Responsibilities:
 *  - Initialize the runtime rendering pipeline
 *  - Resolve the initial screen
 *  - Delegate actual rendering to ScreenRenderer
 *  - Provide a stable entry point for RuntimeApp
 */

import ScreenRenderer from "./ScreenRenderer";
import ComponentResolver from "./ComponentResolver";

export default class Renderer {
  constructor({ documentModel, stateEngine, actionEngine, navigationEngine }) {
    if (!documentModel) {
      throw new Error("Renderer requires a documentModel");
    }
    if (!stateEngine) {
      throw new Error("Renderer requires a stateEngine");
    }
    if (!actionEngine) {
      throw new Error("Renderer requires an actionEngine");
    }
    if (!navigationEngine) {
      throw new Error("Renderer requires a navigationEngine");
    }

    this.documentModel = documentModel;
    this.stateEngine = stateEngine;
    this.actionEngine = actionEngine;
    this.navigationEngine = navigationEngine;

    this.componentResolver = new ComponentResolver();

    this.screenRenderer = new ScreenRenderer({
      componentResolver: this.componentResolver,
      stateEngine: this.stateEngine,
      actionEngine: this.actionEngine,
      navigationEngine: this.navigationEngine,
      documentModel: this.documentModel,
    });
  }

  /**
   * Render the initial screen.
   */
  renderInitial() {
    const initialScreen = this.documentModel.getInitialScreen();
    return this.screenRenderer.renderScreen(initialScreen.id);
  }

  /**
   * Render a specific screen by ID.
   */
  renderScreen(screenId) {
    return this.screenRenderer.renderScreen(screenId);
  }
}

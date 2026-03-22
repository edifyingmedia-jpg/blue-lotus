// frontend/src/runtime/SceneManager.js

/**
 * SceneManager
 * ---------------------------------------------------------
 * A lightweight helper that manages scene transitions
 * within the runtime. A "scene" is simply a route-level
 * screen in the appDefinition.
 *
 * Responsibilities:
 *  - Expose available scenes (routes)
 *  - Allow switching scenes
 *  - Provide helpers for the runtime engine
 */

export default class SceneManager {
  constructor(runtimeEngine) {
    if (!runtimeEngine) {
      throw new Error("[SceneManager] Missing runtime engine");
    }

    this.engine = runtimeEngine;
    this.document = runtimeEngine.document;
  }

  /**
   * Return all available scenes (routes).
   */
  listScenes() {
    return this.document.getAllRoutes();
  }

  /**
   * Get the currently active scene.
   */
  getCurrentScene() {
    return this.engine.getCurrentRoute();
  }

  /**
   * Switch to a different scene.
   */
  setScene(routeName) {
    const routes = this.document.getAllRoutes();

    if (!routes.includes(routeName)) {
      console.warn(`[SceneManager] Unknown scene: ${routeName}`);
      return;
    }

    this.engine.navigation.setRoute(routeName);
  }

  /**
   * Check if a scene exists.
   */
  hasScene(routeName) {
    return this.document.getAllRoutes().includes(routeName);
  }
}

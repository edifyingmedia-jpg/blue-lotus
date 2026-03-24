/**
 * DocumentModel.js
 * ----------------------------------------------------
 * Normalized, runtime-ready representation of the
 * app definition JSON.
 *
 * Responsibilities:
 *  - Store validated app definition
 *  - Provide fast lookup for screens and components
 *  - Expose deterministic getters for runtime systems
 */

export default class DocumentModel {
  constructor(appDefinition) {
    if (!appDefinition || typeof appDefinition !== "object") {
      throw new Error("DocumentModel requires a valid app definition");
    }

    this.raw = appDefinition;

    this.screens = this.indexScreens(appDefinition.screens);
    this.initialScreen = appDefinition.initialScreen;
    this.state = appDefinition.state || {};
  }

  /**
   * Convert screens array into a lookup map:
   *   { screenId: screenObject }
   */
  indexScreens(screens) {
    if (!Array.isArray(screens)) {
      throw new Error("DocumentModel: screens must be an array");
    }

    const map = {};

    for (const screen of screens) {
      if (!screen.id) {
        throw new Error("DocumentModel: screen missing id");
      }

      map[screen.id] = screen;
    }

    return map;
  }

  /**
   * Get a screen by ID.
   */
  getScreen(id) {
    const screen = this.screens[id];
    if (!screen) {
      throw new Error(`DocumentModel: unknown screen '${id}'`);
    }
    return screen;
  }

  /**
   * Get the initial screen.
   */
  getInitialScreen() {
    return this.getScreen(this.initialScreen);
  }

  /**
   * Get the initial state object.
   */
  getInitialState() {
    return { ...this.state };
  }
}

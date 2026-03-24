/**
 * ScreenLoader.js
 * ----------------------------------------------------
 * Loads a screen definition by ID from the project’s
 * screen registry. This is used by:
 *
 * - NavigationEngine (when navigating to a screen)
 * - RuntimeEngine (initial screen load)
 * - ScreenEngine (setting active screen)
 *
 * This loader is intentionally simple and synchronous.
 */

import project from "../../project";

class ScreenLoader {
  /**
   * Load a screen by ID from the project definition.
   */
  load(screenId) {
    if (!project || !project.screens) {
      console.error("ScreenLoader: project.screens is missing");
      return null;
    }

    const screen = project.screens[screenId];

    if (!screen) {
      console.error(`ScreenLoader: Screen "${screenId}" not found`);
      return null;
    }

    return screen;
  }
}

const loader = new ScreenLoader();
export default loader;

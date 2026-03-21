// frontend/src/Builder/SceneManager.js

/**
 * SceneManager
 * ---------------------------------------------------------
 * Handles creation, deletion, and switching of screens
 * (scenes) inside the Builder. Keeps the BuilderState stable.
 */

import { v4 as uuid } from "uuid";

export default class SceneManager {
  /**
   * Create a new screen with a default root container.
   */
  static createScreen(name = "New Screen") {
    const id = uuid();

    return {
      id,
      name,
      root: {
        id: uuid(),
        type: "Container",
        props: {},
        children: [],
      },
    };
  }

  /**
   * Delete a screen safely.
   * Ensures the Builder always has at least one screen.
   */
  static deleteScreen(project, screenId) {
    if (!project.screens[screenId]) return project;

    delete project.screens[screenId];

    const remaining = Object.keys(project.screens);

    // Ensure at least one screen exists
    if (remaining.length === 0) {
      const newScreen = SceneManager.createScreen("Screen 1");
      project.screens[newScreen.id] = newScreen;
      project.currentScreen = newScreen.id;
      return project;
    }

    // If the deleted screen was active, switch to the first remaining
    if (project.currentScreen === screenId) {
      project.currentScreen = remaining[0];
    }

    return project;
  }

  /**
   * Switch to a different screen.
   */
  static setCurrentScreen(project, screenId) {
    if (project.screens[screenId]) {
      project.currentScreen = screenId;
    }
    return project;
  }
}

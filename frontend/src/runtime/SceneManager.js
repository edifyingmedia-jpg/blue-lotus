/**
 * SceneManager
 * ----------------------------------------------------
 * Manages scene-level grouping and transitions.
 *
 * Responsibilities:
 * - Track the active scene
 * - Validate scene membership
 * - Provide deterministic transitions
 * - Integrate with NavigationEngine
 *
 * Scenes are optional, but the engine supports them
 * for future multi-screen flows and animations.
 */

export default class SceneManager {
  constructor({ appDefinition, navigationEngine }) {
    this.appDefinition = appDefinition;
    this.navigationEngine = navigationEngine;

    this.currentScene = this.resolveSceneForScreen(
      navigationEngine.getCurrentScreen()
    );
  }

  /**
   * Determine which scene a screen belongs to
   */
  resolveSceneForScreen(screenId) {
    const scenes = this.appDefinition?.scenes || {};

    for (const sceneId in scenes) {
      const scene = scenes[sceneId];
      if (scene.screens?.includes(screenId)) {
        return sceneId;
      }
    }

    return null; // screen not in any scene
  }

  /**
   * Navigate to a screen and update scene if needed
   */
  navigate(screenId) {
    this.navigationEngine.navigate(screenId);

    const newScene = this.resolveSceneForScreen(screenId);

    if (newScene !== this.currentScene) {
      this.currentScene = newScene;
    }
  }

  /**
   * Get the current scene ID
   */
  getCurrentScene() {
    return this.currentScene;
  }

  /**
   * Update app definition (e.g., builder changes)
   */
  updateDefinition(newDefinition) {
    this.appDefinition = newDefinition;

    const screenId = this.navigationEngine.getCurrentScreen();
    this.currentScene = this.resolveSceneForScreen(screenId);
  }
}

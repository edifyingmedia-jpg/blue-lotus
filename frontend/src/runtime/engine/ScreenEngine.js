// frontend/src/runtime/engine/ScreenEngine.js

/**
 * ScreenEngine.js
 * ---------------------------------------------------------
 * Lightweight runtime engine for managing active screens.
 * - Tracks which screen is currently active
 * - Provides helpers to switch screens
 * - Integrates with SceneManager + Renderer pipeline
 */

export function createScreenEngine(project) {
  let activeScreen = project?.scenes?.[0]?.id || null;

  return {
    getActiveScreen() {
      return activeScreen;
    },

    setActiveScreen(id) {
      activeScreen = id;
    },

    getActiveScreenDefinition() {
      if (!activeScreen) return null;
      return project.scenes.find((s) => s.id === activeScreen) || null;
    }
  };
}

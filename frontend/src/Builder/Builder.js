/**
 * Builder.js
 * Blue Lotus — AI‑Driven No‑Code Builder
 *
 * Orchestrates the builder engine:
 *  - Loads project
 *  - Initializes BuilderState
 *  - Initializes SceneManager
 *  - Initializes ActionDispatcher
 *  - Registers components
 */

import ProjectLoader from "./ProjectLoader";
import BuilderState from "./BuilderState";
import SceneManager from "./SceneManager";
import ActionDispatcher from "./ActionDispatcher";
import registerComponents from "./registerComponents";

// Default project structure (can be replaced later with real saved projects)
const DEFAULT_PROJECT = {
  name: "New Blue Lotus Project",
  scenes: [],
  registry: {},
};

async function initializeBuilder(projectData = DEFAULT_PROJECT) {
  console.log("Builder: initializing…");

  // 1. Load project
  const loaded = ProjectLoader.load(projectData);

  // 2. Initialize state
  BuilderState.initialize(loaded);

  // 3. Initialize scenes
  SceneManager.initialize(loaded.scenes || []);

  // 4. Register all components
  registerComponents();

  // 5. Initialize ActionDispatcher with state helpers
  ActionDispatcher.initialize({
    getState: BuilderState.getState,
    updateState: BuilderState.update,
    switchScene: SceneManager.switchScene,
  });

  console.log("Builder: initialized.");

  // Expose a clean API for the UI layer
  return {
    getState: BuilderState.getState,
    dispatch: ActionDispatcher.dispatch,
    scenes: SceneManager.getScenes,
    getCurrentScene: SceneManager.getCurrentScene,
  };
}

export default {
  initializeBuilder,
};

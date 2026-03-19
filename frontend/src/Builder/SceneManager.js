/**
 * SceneManager.js
 * Blue Lotus — AI‑Driven No‑Code Builder
 *
 * Manages scenes:
 *  - Initialize scenes
 *  - Switch scenes
 *  - Create, rename, delete scenes
 *  - Provide helpers for AI + ActionDispatcher
 */

import BuilderState from "./BuilderState";

let scenes = [];
let currentSceneId = null;

/**
 * Initialize scenes from ProjectLoader.
 */
function initialize(initialScenes) {
  scenes = initialScenes;
  if (initialScenes.length > 0) {
    currentSceneId = initialScenes[0].id;
    BuilderState.setCurrentScene(currentSceneId);
  }
  console.log("SceneManager: initialized with", initialScenes.length, "scenes.");
}

/**
 * Get all scenes.
 */
function getScenes() {
  return BuilderState.getState().scenes;
}

/**
 * Get the current scene.
 */
function getCurrentScene() {
  const state = BuilderState.getState();
  return state.scenes.find((s) => s.id === state.currentSceneId) || null;
}

/**
 * Switch to a different scene.
 */
function switchScene(id) {
  const state = BuilderState.getState();
  const exists = state.scenes.some((s) => s.id === id);

  if (!exists) {
    console.error(`SceneManager: Scene ${id} does not exist.`);
    return;
  }

  BuilderState.setCurrentScene(id);
  currentSceneId = id;

  console.log(`SceneManager: Switched to scene ${id}.`);
}

/**
 * Create a new scene.
 */
function createScene(name = "New Scene") {
  const id = crypto.randomUUID();

  BuilderState.update((state) => {
    state.scenes.push({
      id,
      name,
      components: [],
      data: {},
    });
    state.currentSceneId = id;
  });

  currentSceneId = id;

  console.log(`SceneManager: Scene "${name}" created.`);
  return id;
}

/**
 * Rename a scene.
 */
function renameScene(id, newName) {
  BuilderState.update((state) => {
    const scene = state.scenes.find((s) => s.id === id);
    if (scene) scene.name = newName;
  });

  console.log(`SceneManager: Scene ${id} renamed to "${newName}".`);
}

/**
 * Delete a scene.
 */
function deleteScene(id) {
  BuilderState.update((state) => {
    state.scenes = state.scenes.filter((s) => s.id !== id);

    // If the deleted scene was active, switch to first available
    if (state.currentSceneId === id) {
      state.currentSceneId = state.scenes.length > 0 ? state.scenes[0].id : null;
    }
  });

  console.log(`SceneManager: Scene ${id} deleted.`);
}

/**
 * Exported API
 */
export default {
  initialize,
  getScenes,
  getCurrentScene,
  switchScene,
  createScene,
  renameScene,
  deleteScene,
};

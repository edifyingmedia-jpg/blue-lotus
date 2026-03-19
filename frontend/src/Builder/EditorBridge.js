/**
 * EditorBridge.js
 * Blue Lotus — AI‑Driven No‑Code Builder
 *
 * Provides a clean interface between the Builder engine
 * and the Editor UI (EditorApp, SceneList, Toolbar, etc.)
 */

import Builder from "./Builder";

let api = null;

/**
 * Initialize the builder engine and expose a UI-friendly API.
 */
export async function initializeEditorBridge(projectData) {
  api = await Builder.initializeBuilder(projectData);

  return {
    getState: api.getState,
    dispatch: api.dispatch,
    getScenes: api.scenes,
    getCurrentScene: api.getCurrentScene,
  };
}

/**
 * Expose the API after initialization.
 */
export function useEditorAPI() {
  if (!api) {
    console.error("EditorBridge: API not initialized.");
    return null;
  }
  return api;
}

export default {
  initializeEditorBridge,
  useEditorAPI,
};

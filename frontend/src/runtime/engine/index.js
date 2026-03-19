// frontend/src/runtime/engine/index.js

/**
 * engine/index.js
 * ----------------
 * Tiny runtime entrypoint for Blue Lotus.
 * Wires together:
 *   - ProjectLoader
 *   - SceneManager
 *   - ActionDispatcher
 *   - Reducer dispatch loop (provided by EditorApp)
 */

import { loadProject, createNewProject, saveProject } from "../ProjectLoader";
import { createSceneManager } from "../SceneManager";
import { createActionDispatcher } from "../ActionDispatcher";

/**
 * Initialize the runtime engine.
 * Returns:
 *   {
 *     project,
 *     sceneManager,
 *     dispatcher
 *   }
 */
export function initializeEngine(dispatch) {
  // Load or create project
  let project = loadProject();
  if (!project) {
    project = createNewProject("Untitled Project");
  }

  const sceneManager = createSceneManager(project);
  const dispatcher = createActionDispatcher(dispatch);

  return {
    project,
    sceneManager,
    dispatcher,
    save: () => saveProject(project)
  };
}

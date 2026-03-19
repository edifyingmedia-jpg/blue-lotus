// frontend/src/runtime/SceneManager.js

/**
 * SceneManager.js
 * ----------------
 * A small helper module that manages scene-level operations
 * for the Blue Lotus runtime.
 *
 * This keeps scene logic clean and separate from the reducer.
 */

export function createSceneManager(project) {
  if (!project) {
    throw new Error("SceneManager requires a valid project instance");
  }

  /**
   * Create a new scene.
   */
  function createScene(name) {
    return project.addScene(name);
  }

  /**
   * Rename an existing scene.
   */
  function renameScene(id, newName) {
    project.renameScene(id, newName);
  }

  /**
   * Update the content of a scene.
   */
  function updateSceneContent(id, content) {
    project.updateSceneContent(id, content);
  }

  /**
   * Get a scene by ID.
   */
  function getScene(id) {
    return project.getScene(id);
  }

  /**
   * List all scenes.
   */
  function listScenes() {
    return project.scenes;
  }

  return {
    createScene,
    renameScene,
    updateSceneContent,
    getScene,
    listScenes
  };
}

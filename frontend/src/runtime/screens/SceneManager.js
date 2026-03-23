// frontend/src/runtime/screens/SceneManager.js

/**
 * SceneManager.js
 * ---------------------------------------------------------
 * Coordinates runtime screen lifecycle.
 *
 * Responsibilities:
 *  - Track the active scene
 *  - Handle scene transitions
 *  - Provide a single source of truth for scene state
 *
 * This manager must remain deterministic and side‑effect free.
 */

class SceneManager {
  constructor() {
    this.activeScene = null;
    this.listeners = new Set();
  }

  getActiveScene() {
    return this.activeScene;
  }

  setActiveScene(scene) {
    if (!scene || scene === this.activeScene) return;

    this.activeScene = scene;
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((listener) =>
      listener(this.activeScene)
    );
  }
}

const sceneManager = new SceneManager();
export default sceneManager;

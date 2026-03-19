/**
 * ProjectLoader.js
 * Blue Lotus — 2026 Architect Edition
 *
 * Loads a project into the Builder system:
 *  - Loads project metadata
 *  - Loads scenes
 *  - Loads component trees
 *  - Hydrates BuilderState
 *  - Prepares SceneManager + ComponentRegistry
 *  - Exposes async loadProject() for UI + Voice
 */

import BuilderState from "./BuilderState";
import SceneManager from "./SceneManager";
import ComponentRegistry from "./ComponentRegistry";
import ActionDispatcher from "./ActionDispatcher";

/**
 * Validate minimal project structure.
 */
function validateProject(project) {
  if (!project) throw new Error("ProjectLoader: No project provided.");
  if (!project.scenes || !Array.isArray(project.scenes)) {
    throw new Error("ProjectLoader: Project is missing scenes array.");
  }
  if (!project.name) {
    console.warn("ProjectLoader: Project has no name. Using 'Untitled Project'.");
    project.name = "Untitled Project";
  }
}

/**
 * Normalize scene structure.
 */
function normalizeScene(scene) {
  return {
    id: scene.id || crypto.randomUUID(),
    name: scene.name || "Untitled Scene",
    components: Array.isArray(scene.components) ? scene.components : [],
    data: scene.data || {},
  };
}

/**
 * Normalize component structure.
 */
function normalizeComponent(component) {
  return {
    id: component.id || crypto.randomUUID(),
    type: component.type || "Unknown",
    props: component.props || {},
    children: Array.isArray(component.children) ? component.children : [],
  };
}

/**
 * Recursively normalize component trees.
 */
function normalizeComponentTree(tree) {
  const node = normalizeComponent(tree);
  node.children = node.children.map(normalizeComponentTree);
  return node;
}

/**
 * Load scenes + components into BuilderState.
 */
function hydrateScenes(scenes) {
  const normalized = scenes.map((scene) => {
    const s = normalizeScene(scene);
    s.components = s.components.map(normalizeComponentTree);
    return s;
  });

  BuilderState.setScenes(normalized);
  SceneManager.initialize(normalized);
}

/**
 * Load project metadata.
 */
function hydrateMetadata(project) {
  BuilderState.setProject({
    id: project.id || crypto.randomUUID(),
    name: project.name,
    createdAt: project.createdAt || Date.now(),
    updatedAt: Date.now(),
    version: project.version || 1,
  });
}

/**
 * Register components from project (if any).
 */
function hydrateRegistry(project) {
  if (project.registry && typeof project.registry === "object") {
    Object.entries(project.registry).forEach(([type, renderer]) => {
      ComponentRegistry.register(type, renderer);
    });
  }
}

/**
 * Prepare ActionDispatcher for voice + UI actions.
 */
function hydrateActions() {
  ActionDispatcher.initialize({
    getState: () => BuilderState.getState(),
    updateState: (fn) => BuilderState.update(fn),
    switchScene: (id) => SceneManager.switchScene(id),
  });
}

/**
 * Main loader function.
 */
async function loadProject(project) {
  try {
    validateProject(project);

    // 1. Metadata
    hydrateMetadata(project);

    // 2. Component registry
    hydrateRegistry(project);

    // 3. Scenes + component trees
    hydrateScenes(project.scenes);

    // 4. Action dispatcher (voice + UI)
    hydrateActions();

    // 5. Mark project as loaded
    BuilderState.setLoaded(true);

    console.log("ProjectLoader: Project loaded successfully.");
    return true;
  } catch (err) {
    console.error("ProjectLoader: Failed to load project:", err);
    BuilderState.setLoaded(false);
    return false;
  }
}

export default {
  loadProject,
};

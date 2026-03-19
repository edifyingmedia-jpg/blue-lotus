/**
 * BuilderState.js
 * Blue Lotus — AI‑Driven No‑Code Builder
 *
 * Central reactive state container for the entire builder.
 * Designed for a fully AI‑driven workflow (no drag‑and‑drop).
 *
 * Responsibilities:
 *  - Hold project metadata
 *  - Hold scenes + component trees
 *  - Track current scene + selection
 *  - Provide safe update functions for AI + UI
 *  - Support undo/redo
 *  - Expose a clean API for ActionDispatcher + TWIN
 */

import { reactive } from "vue"; // If you're using React, we can switch to Zustand or Jotai.

const state = reactive({
  loaded: false,

  project: {
    id: null,
    name: "Untitled Project",
    createdAt: null,
    updatedAt: null,
    version: 1,
  },

  scenes: [],

  currentSceneId: null,

  // For AI refinement (e.g., “modify the selected button”)
  selectedComponentId: null,

  // Undo/redo stacks
  history: [],
  future: [],
});

/**
 * Internal helper to push snapshots for undo/redo.
 */
function snapshot() {
  const clone = JSON.parse(JSON.stringify({
    project: state.project,
    scenes: state.scenes,
    currentSceneId: state.currentSceneId,
    selectedComponentId: state.selectedComponentId,
  }));

  state.history.push(clone);
  state.future = [];
}

/**
 * Undo last change.
 */
function undo() {
  if (state.history.length === 0) return;

  const prev = state.history.pop();
  const current = JSON.parse(JSON.stringify({
    project: state.project,
    scenes: state.scenes,
    currentSceneId: state.currentSceneId,
    selectedComponentId: state.selectedComponentId,
  }));

  state.future.push(current);

  Object.assign(state.project, prev.project);
  state.scenes = prev.scenes;
  state.currentSceneId = prev.currentSceneId;
  state.selectedComponentId = prev.selectedComponentId;
}

/**
 * Redo undone change.
 */
function redo() {
  if (state.future.length === 0) return;

  const next = state.future.pop();
  snapshot();

  Object.assign(state.project, next.project);
  state.scenes = next.scenes;
  state.currentSceneId = next.currentSceneId;
  state.selectedComponentId = next.selectedComponentId;
}

/**
 * Set project metadata.
 */
function setProject(project) {
  snapshot();
  state.project = { ...state.project, ...project };
}

/**
 * Set scenes.
 */
function setScenes(scenes) {
  snapshot();
  state.scenes = scenes;
  if (!state.currentSceneId && scenes.length > 0) {
    state.currentSceneId = scenes[0].id;
  }
}

/**
 * Switch active scene.
 */
function setCurrentScene(id) {
  snapshot();
  state.currentSceneId = id;
}

/**
 * Select a component for AI refinement.
 */
function setSelectedComponent(id) {
  snapshot();
  state.selectedComponentId = id;
}

/**
 * Update state via a callback (used by ActionDispatcher + AI).
 */
function update(fn) {
  snapshot();
  fn(state);
}

/**
 * Mark project as loaded.
 */
function setLoaded(val) {
  state.loaded = val;
}

/**
 * Get full state (read‑only).
 */
function getState() {
  return state;
}

export default {
  getState,
  update,
  undo,
  redo,
  setProject,
  setScenes,
  setCurrentScene,
  setSelectedComponent,
  setLoaded,
};

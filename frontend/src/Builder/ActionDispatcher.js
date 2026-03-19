/**
 * ActionDispatcher.js
 * Blue Lotus — AI‑Driven No‑Code Builder
 *
 * Central command router for all AI + voice + typed intents.
 * This is the "brain" that applies changes to BuilderState.
 *
 * Responsibilities:
 *  - Receive parsed intents from AI or user commands
 *  - Validate actions
 *  - Apply updates to BuilderState
 *  - Coordinate with SceneManager + ComponentRegistry
 *  - Provide a single unified API for voice + text commands
 */

import BuilderState from "./BuilderState";
import SceneManager from "./SceneManager";
import ComponentRegistry from "./ComponentRegistry";

let dispatcher = null;

/**
 * Initialize dispatcher with injected dependencies.
 */
function initialize(api) {
  dispatcher = {
    getState: api.getState,
    updateState: api.updateState,
    switchScene: api.switchScene,
  };

  console.log("ActionDispatcher: initialized.");
}

/**
 * Add a new scene.
 */
function addScene(name = "New Scene") {
  dispatcher.updateState((state) => {
    const id = crypto.randomUUID();
    state.scenes.push({
      id,
      name,
      components: [],
      data: {},
    });
    state.currentSceneId = id;
  });

  console.log(`ActionDispatcher: Scene "${name}" created.`);
}

/**
 * Add a component to the current scene.
 */
function addComponent(type, props = {}) {
  const registry = ComponentRegistry.get(type);
  if (!registry) {
    console.error(`ActionDispatcher: Unknown component type "${type}".`);
    return;
  }

  dispatcher.updateState((state) => {
    const scene = state.scenes.find((s) => s.id === state.currentSceneId);
    if (!scene) return;

    const id = crypto.randomUUID();
    const component = {
      id,
      type,
      props,
      children: [],
    };

    scene.components.push(component);
    state.selectedComponentId = id;
  });

  console.log(`ActionDispatcher: Component "${type}" added.`);
}

/**
 * Update props of the selected component.
 */
function updateComponentProps(newProps) {
  dispatcher.updateState((state) => {
    const scene = state.scenes.find((s) => s.id === state.currentSceneId);
    if (!scene) return;

    const comp = findComponent(scene.components, state.selectedComponentId);
    if (!comp) return;

    comp.props = { ...comp.props, ...newProps };
  });

  console.log("ActionDispatcher: Component props updated.");
}

/**
 * Recursively find a component by ID.
 */
function findComponent(tree, id) {
  for (const node of tree) {
    if (node.id === id) return node;
    const child = findComponent(node.children, id);
    if (child) return child;
  }
  return null;
}

/**
 * Switch scenes.
 */
function switchScene(id) {
  dispatcher.switchScene(id);
  console.log(`ActionDispatcher: Switched to scene ${id}.`);
}

/**
 * Delete a component.
 */
function deleteComponent(id) {
  dispatcher.updateState((state) => {
    const scene = state.scenes.find((s) => s.id === state.currentSceneId);
    if (!scene) return;

    scene.components = removeComponent(scene.components, id);

    if (state.selectedComponentId === id) {
      state.selectedComponentId = null;
    }
  });

  console.log(`ActionDispatcher: Component ${id} deleted.`);
}

/**
 * Recursively remove a component.
 */
function removeComponent(tree, id) {
  return tree
    .filter((node) => node.id !== id)
    .map((node) => ({
      ...node,
      children: removeComponent(node.children, id),
    }));
}

/**
 * Main entry point for AI + typed commands.
 */
async function dispatch(intent) {
  if (!intent || !intent.action) {
    console.error("ActionDispatcher: Invalid intent.");
    return;
  }

  console.log("ActionDispatcher: Received intent:", intent);

  switch (intent.action) {
    case "add_scene":
      return addScene(intent.name);
    case "add_component":
      return addComponent(intent.componentType, intent.props);
    case "update_component":
      return updateComponentProps(intent.props);
    case "delete_component":
      return deleteComponent(intent.id);
    case "switch_scene":
      return switchScene(intent.id);
    default:
      console.warn(`ActionDispatcher: Unknown action "${intent.action}".`);
  }
}

export default {
  initialize,
  dispatch,
  addScene,
  addComponent,
  updateComponentProps,
  deleteComponent,
  switchScene,
};

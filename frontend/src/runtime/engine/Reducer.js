// frontend/src/runtime/engine/Reducer.js

/**
 * Reducer.js
 * ---------------------------------------------------------
 * Pure reducer for Blue Lotus runtime state.
 * Applies actions to the project model.
 *
 * IMPORTANT:
 * - Never mutates state directly
 * - Always returns a new state object
 * - Delegates scene operations to SceneManager
 */

export function createReducer(sceneManager, saveProject) {
  return function reducer(state, action) {
    switch (action.type) {
      // -----------------------------
      // Scene creation
      // -----------------------------
      case "SCENE_CREATE": {
        const scene = sceneManager.createScene(action.name);
        saveProject();
        return {
          ...state,
          scenes: [...state.scenes, scene]
        };
      }

      // -----------------------------
      // Scene rename
      // -----------------------------
      case "SCENE_RENAME": {
        sceneManager.renameScene(action.id, action.newName);
        saveProject();
        return {
          ...state,
          scenes: state.scenes.map((s) =>
            s.id === action.id ? { ...s, name: action.newName } : s
          )
        };
      }

      // -----------------------------
      // Scene content update
      // -----------------------------
      case "SCENE_UPDATE_CONTENT": {
        sceneManager.updateSceneContent(action.id, action.content);
        saveProject();
        return {
          ...state,
          scenes: state.scenes.map((s) =>
            s.id === action.id ? { ...s, content: action.content } : s
          )
        };
      }

      // -----------------------------
      // Unknown command
      // -----------------------------
      case "COMMAND_UNKNOWN": {
        console.warn("Unknown command:", action.raw);
        return state;
      }

      // -----------------------------
      // Default
      // -----------------------------
      default:
        return state;
    }
  };
}

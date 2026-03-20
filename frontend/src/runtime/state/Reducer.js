// frontend/src/runtime/state/Reducer.js

/**
 * Reducer
 * ---------------------------------------------------------
 * Pure reducer for global runtime state.
 * Handles:
 * - screen changes
 * - param updates
 * - data updates
 * - action responses
 *
 * IMPORTANT:
 * - Never mutate state directly
 * - Always return a new state object
 */

export default function Reducer(state, action) {
  switch (action.type) {
    // -----------------------------------------------------
    // Change active screen
    // -----------------------------------------------------
    case "SCREEN_SET": {
      return {
        ...state,
        currentScreen: action.screen,
        params: action.params || {},
      };
    }

    // -----------------------------------------------------
    // Update screen params
    // -----------------------------------------------------
    case "PARAMS_UPDATE": {
      return {
        ...state,
        params: {
          ...state.params,
          ...action.params,
        },
      };
    }

    // -----------------------------------------------------
    // Generic data update
    // -----------------------------------------------------
    case "DATA_UPDATE": {
      return {
        ...state,
        data: {
          ...state.data,
          ...action.data,
        },
      };
    }

    // -----------------------------------------------------
    // ActionEngine responses
    // -----------------------------------------------------
    case "ACTION_RESULT": {
      return {
        ...state,
        lastAction: {
          name: action.name,
          payload: action.payload,
          timestamp: Date.now(),
        },
      };
    }

    // -----------------------------------------------------
    // Unknown action
    // -----------------------------------------------------
    default:
      console.warn("Reducer: Unknown action type:", action.type);
      return state;
  }
}

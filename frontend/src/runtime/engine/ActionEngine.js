// frontend/src/runtime/engine/ActionEngine.js

import { useNavigation } from "./NavigationEngine";

/**
 * Action Engine
 * - Supports single actions
 * - Supports multiple actions (arrays)
 * - Easily extendable for API, state, conditions, etc.
 */

export function useActionEngine() {
  const { navigate } = useNavigation();

  function runAction(action) {
    if (!action) return;

    // If it's an array, run each action in order
    if (Array.isArray(action)) {
      action.forEach(a => runAction(a));
      return;
    }

    if (!action.type) {
      console.warn("Invalid action:", action);
      return;
    }

    switch (action.type) {
      case "navigate":
        if (action.target) navigate(action.target);
        break;

      case "log":
        console.log("LOG ACTION:", action.message);
        break;

      default:
        console.warn("Unknown action type:", action.type);
    }
  }

  return { runAction };
}

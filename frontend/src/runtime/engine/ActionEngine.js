// frontend/src/runtime/engine/ActionEngine.js

/**
 * ActionEngine
 * ---------------------------------------------------------
 * Central dispatcher for all actions triggered by components.
 * Supports:
 * - navigation actions
 * - state updates
 * - async operations
 * - custom user-defined actions
 */

import { useNavigation } from "./NavigationEngine";

export default function ActionEngine() {
  const navigation = useNavigation();

  const run = async (action, value) => {
    if (!action) return;

    const { type, params = {} } = action;

    switch (type) {
      case "navigate":
        navigation.push(params.screen, params);
        break;

      case "replace":
        navigation.replace(params.screen, params);
        break;

      case "back":
        navigation.goBack();
        break;

      case "log":
        console.log("ActionEngine log:", value);
        break;

      case "alert":
        alert(params.message || "Action triggered");
        break;

      default:
        console.warn("Unknown action type:", type, action);
        break;
    }
  };

  return { run };
}

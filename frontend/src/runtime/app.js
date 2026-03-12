// frontend/src/runtime/engine/ActionEngine.js

import { useNavigation } from "./NavigationEngine";

export function useActionEngine() {
  const { navigate } = useNavigation();

  function runAction(action) {
    if (!action || !action.type) {
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

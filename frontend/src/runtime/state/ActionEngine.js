// frontend/src/runtime/state/ActionEngine.js

/**
 * ActionEngine.js
 * ---------------------------------------------------------
 * Executes runtime actions triggered by components or screens.
 *
 * Responsibilities:
 *  - Run logic blocks
 *  - Update runtime state
 *  - Navigate between screens
 *  - Support async operations
 */

import { useRuntimeState } from "./StateContext";
import { useScreenEngine } from "../resolver/ScreenEngine";

export default function useActionEngine() {
  const { setValue, setValues, state } = useRuntimeState();
  const { navigate } = useScreenEngine();

  /**
   * Execute a single action object
   */
  async function runAction(action) {
    if (!action || typeof action !== "object") return;

    switch (action.type) {
      case "setValue":
        setValue(action.key, action.value);
        break;

      case "setValues":
        setValues(action.values);
        break;

      case "navigate":
        navigate(action.screenId);
        break;

      case "log":
        console.log("Runtime Log:", action.message, { state });
        break;

      case "delay":
        await new Promise((resolve) => setTimeout(resolve, action.ms));
        break;

      default:
        console.warn(`Unknown action type: ${action.type}`);
        break;
    }
  }

  /**
   * Execute an array of actions in sequence
   */
  async function runActions(actions = []) {
    for (const action of actions) {
      await runAction(action);
    }
  }

  return {
    runAction,
    runActions,
  };
}

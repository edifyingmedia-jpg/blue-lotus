/**
 * ActionEngine.js
 * ----------------------------------------------------
 * Executes actions defined in the project.
 *
 * Responsibilities:
 * - Look up actions by ID
 * - Execute action handlers
 * - Integrate with StateEngine and NavigationEngine
 * - Provide deterministic, synchronous action flow
 */

import project from "../../project";
import StateEngine from "./StateEngine";
import NavigationEngine from "../navigation/NavigationEngine";

class ActionEngine {
  constructor() {
    this.actions = project?.actions || {};
  }

  /**
   * Execute an action by ID.
   */
  run(actionId, payload = {}) {
    const action = this.actions[actionId];

    if (!action) {
      console.error(`ActionEngine: Action "${actionId}" not found`);
      return;
    }

    switch (action.type) {
      case "state.set":
        StateEngine.set(action.key, payload.value);
        break;

      case "state.merge":
        StateEngine.merge(payload.values || {});
        break;

      case "navigate.to":
        NavigationEngine.navigate(action.screenId);
        break;

      case "log":
        console.log("ActionEngine log:", payload);
        break;

      default:
        console.error(`ActionEngine: Unknown action type "${action.type}"`);
        break;
    }
  }
}

const engine = new ActionEngine();
export default engine;

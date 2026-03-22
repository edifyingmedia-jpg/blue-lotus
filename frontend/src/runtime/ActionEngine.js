// frontend/src/runtime/ActionEngine.js

/**
 * ActionEngine
 * ---------------------------------------------------------
 * Executes runtime actions defined in JSON.
 *
 * Responsibilities:
 *  - Handle navigation actions
 *  - Handle state update actions (future)
 *  - Provide a unified run() dispatcher
 *
 * It does NOT:
 *  - invent actions
 *  - simulate backend responses
 *  - mutate appDefinition
 */

export default class ActionEngine {
  constructor({ navigate, getState, setState, onEvent }) {
    this.navigate = navigate;
    this.getState = getState;
    this.setState = setState;
    this.onEvent = onEvent;
  }

  /**
   * Main dispatcher
   */
  run(action) {
    if (!action || typeof action !== "object") {
      console.warn("ActionEngine.run: invalid action:", action);
      return;
    }

    const { type } = action;

    switch (type) {
      case "navigate":
        return this.handleNavigate(action);

      case "setState":
        return this.handleSetState(action);

      default:
        console.warn(`ActionEngine: Unknown action type "${type}"`);
        return;
    }
  }

  /**
   * Navigation action
   */
  handleNavigate(action) {
    const { to } = action;

    if (!to || typeof to !== "string") {
      console.warn("ActionEngine.navigate: missing 'to' field:", action);
      return;
    }

    if (typeof this.navigate === "function") {
      this.navigate(to);
    }

    if (this.onEvent) {
      this.onEvent({
        type: "navigation",
        to,
      });
    }
  }

  /**
   * State update action (future‑ready)
   */
  handleSetState(action) {
    const { key, value } = action;

    if (!key) {
      console.warn("ActionEngine.setState: missing 'key' field:", action);
      return;
    }

    if (typeof this.setState === "function") {
      this.setState((prev) => ({
        ...prev,
        [key]: value,
      }));
    }

    if (this.onEvent) {
      this.onEvent({
        type: "stateUpdate",
        key,
        value,
      });
    }
  }
}
